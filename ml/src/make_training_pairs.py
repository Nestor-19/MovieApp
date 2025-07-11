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
from sklearn.model_selection import StratifiedShuffleSplit

random.seed(42)

DATA_DIR = Path("ml/data")
PROC_DIR = DATA_DIR / "processed"
INTER_DIR = DATA_DIR / "interactions"

LATEST_INT = sorted(INTER_DIR.glob("interactions_*.parquet"))[-1]
USER_PROF_FILE = PROC_DIR / "user_profiles.parquet"
MOV_EMB_FILE   = PROC_DIR / "movies_embeddings.parquet"
MOV_SPLIT_FILE = PROC_DIR / "movies_with_split.parquet"

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

sss = StratifiedShuffleSplit(n_splits=1, test_size=0.15, random_state=42)
train_idx, val_idx = next(sss.split(feat_df, feat_df["liked"]))

feat_df["split"] = "train"
feat_df.loc[val_idx, "split"] = "val"

sss2 = StratifiedShuffleSplit(n_splits=1, test_size=0.10, random_state=43)
new_train_idx, test_idx = next(sss2.split(feat_df.loc[train_idx], feat_df.loc[train_idx, "liked"]))
feat_df.loc[test_idx, "split"] = "test"

OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
feat_df.to_parquet(OUT_FILE, index=False)
print(f"Feature matrix with {len(feat_df):,} rows → {OUT_FILE}")