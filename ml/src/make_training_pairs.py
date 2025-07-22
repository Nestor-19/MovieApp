"""
Build a supervised data-set for the ranker.

Each row = (genre_overlap, embed_dist, split, liked)

  liked = 1 → user explicitly liked this movie
  liked = 0 → either:
             • explicit dislike in watch-list, OR
             • randomly sampled unseen movie
For every positive we keep ALL dislikes + enough random-unseen movies to reach
NEG_RATIO x positives (negatives may exceed the ratio if dislikes > quota).
Run nightly:  python -m ml.src.make_training_pairs
"""

from __future__ import annotations
from pathlib import Path
from typing import List, Dict
import random
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split

random.seed(42)

DATA_DIR = Path("ml/data")
PROC_DIR = DATA_DIR / "processed"
INTER_DIR = DATA_DIR / "interactions"

LATEST_INT = sorted(INTER_DIR.glob("interactions_*.parquet"))[-1]
USER_PROF_FILE = PROC_DIR / "user_profiles.parquet"
MOV_EMB_FILE   = PROC_DIR / "movies_embeddings.parquet"
# MOV_SPLIT_FILE = PROC_DIR / "movies_with_split.parquet"

OUT_FILE = PROC_DIR / "features_trainvaltest.parquet"
NEG_RATIO = 2


likes_df = pd.read_parquet(LATEST_INT)
profiles = pd.read_parquet(USER_PROF_FILE).set_index("user_id")

movies = (
    pd.read_parquet(MOV_EMB_FILE)[["_id", "text_vec", "genres"]]
      .assign(_id=lambda d: d["_id"].astype(str).str.strip())
      .set_index("_id")
)

all_movie_ids: List[str] = movies.index.tolist()

def jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(a), set(b)
    return len(sa & sb) / len(sa | sb or {1})

def cosine_dist(u: np.ndarray, v: np.ndarray) -> float:
    """Both u and v are unit-normalised 384-d vectors."""
    return 1.0 - float(cosine_similarity(u.reshape(1, -1), v.reshape(1, -1))[0, 0])

rows: List[Dict] = []

for uid, grp in likes_df.groupby("user_id"):
    # skip users with no positive likes or missing profile
    pos_ids = grp.loc[grp.liked == 1, "movie_id"].tolist()
    if not pos_ids or uid not in profiles.index:
        continue

    user_vec   = np.array(profiles.at[uid, "user_vec"], dtype=float)
    fav_genres = profiles.at[uid, "fav_genres"]

    # positive rows
    for mid in pos_ids:
        if mid not in movies.index:
            continue
        mv = movies.loc[mid]
        rows.append({
            "genre_overlap": jaccard(fav_genres, mv.genres),
            "embed_dist":    cosine_dist(user_vec, np.array(mv.text_vec, float)),
            "liked":         1
        })

    # negative rows
    # 1. explicit dislikes
    neg_ids = grp.loc[grp.liked == 0, "movie_id"].tolist()

    # 2. add unseen movies until we reach NEG_RATIO × positives
    needed   = max(0, NEG_RATIO * len(pos_ids) - len(neg_ids))
    unseen   = list(set(all_movie_ids) - set(pos_ids) - set(neg_ids))
    neg_ids += random.sample(unseen, min(len(unseen), needed))

    for mid in neg_ids:
        if mid not in movies.index:
            continue
        mv = movies.loc[mid]
        rows.append({
            "genre_overlap": jaccard(fav_genres, mv.genres),
            "embed_dist":    cosine_dist(user_vec, np.array(mv.text_vec, float)),
            "liked":         0
        })


feat_df = pd.DataFrame(rows)

temp_df, test_df = train_test_split(
    feat_df,
    test_size=0.10,
    stratify=feat_df["liked"],
    random_state=43
)

val_size = 0.15 / 0.90
train_df, val_df = train_test_split(
    temp_df,
    test_size=val_size,
    stratify=temp_df["liked"],
    random_state=42
)

train_df = train_df.copy()
val_df   = val_df.copy()
test_df  = test_df.copy()

train_df["split"] = "train"
val_df["split"]   = "val"
test_df["split"]  = "test"

out = pd.concat([train_df, val_df, test_df], ignore_index=True)

OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
out.to_parquet(OUT_FILE, index=False)
print(f"Feature matrix with {len(out):,} rows → {OUT_FILE}")
print(out["split"].value_counts(normalize=True).mul(100).round(2))