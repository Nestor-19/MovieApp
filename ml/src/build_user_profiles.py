"""
Create one taste vector + favourite-genre list + watched_ids per user.

• user_vec      = mean( text-embeddings of *liked* movies )
• fav_genres    = union of genres across *liked* movies
• watched_ids   = every movie_id the user has rated (like OR dislike)

Run:  python -m ml.src.build_user_profiles
"""

from pathlib import Path
import numpy as np
import pandas as pd

INTER_DIR   = Path("ml/data/interactions")
LATEST_INT  = sorted(INTER_DIR.glob("interactions_*.parquet"))[-1]
inter_df    = pd.read_parquet(LATEST_INT)

inter_df["movie_id"] = inter_df.movie_id.astype(str).str.strip()

EMB_PATH = Path("ml/data/processed/movies_embeddings.parquet")
movies   = (
    pd.read_parquet(EMB_PATH)[["_id", "text_vec", "genres"]]
      .assign(_id=lambda d: d["_id"].astype(str).str.strip())
      .set_index("_id")
)

# build one profile per user
profiles = []

for uid, grp_all in inter_df.groupby("user_id"):
    watched_ids = grp_all["movie_id"].tolist()

    grp_like = grp_all[grp_all.liked == 1]

    if grp_like.empty:
        continue

    # join liked rows with movie table to fetch vectors / genres
    liked_movies = grp_like.merge(
        movies, left_on="movie_id", right_index=True, how="inner"
    )

    # average text vectors
    vecs = np.stack(liked_movies["text_vec"].to_numpy())
    mean = vecs.mean(axis=0)
    mean /= np.linalg.norm(mean) + 1e-9

    fav_genres = list(set().union(*liked_movies["genres"]))

    profiles.append({
        "user_id":      uid,
        "user_vec":     mean.astype(float).tolist(),
        "fav_genres":   fav_genres,
        "watched_ids":  watched_ids
    })

profiles_df = pd.DataFrame(profiles)

OUT = Path("ml/data/processed/user_profiles.parquet")
OUT.parent.mkdir(parents=True, exist_ok=True)
profiles_df.to_parquet(OUT, index=False)

print(f"{len(profiles_df):,} user profiles written ➜ {OUT}")
