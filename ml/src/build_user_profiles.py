"""
Create one taste vector + favourite-genre list per user.
Run:  python -m ml.src.build_user_profiles
"""

from pathlib import Path
import numpy as np
import pandas as pd

INTERACTIONS_DIR = Path("ml/data/interactions")
latest  = sorted(INTERACTIONS_DIR.glob("interactions_*.parquet"))[-1]

likes = (
    pd.read_parquet(latest)
        .query("liked == 1")
        .assign(movie_id = lambda d: d.movie_id.str.strip())
)

MOV_EMB = Path("ml/data/processed/movies_embeddings.parquet")

movies = (
    pd.read_parquet(MOV_EMB)[["_id", "text_vec", "genres"]]
        .assign(_id=lambda d: d["_id"].astype(str).str.strip())
)

df = likes.merge(movies, left_on="movie_id", right_on="_id", how="inner")

profiles = [] # list of dictionaries

for uid, grp in df.groupby("user_id"):
    vecs = np.stack(grp["text_vec"].to_numpy())
    mean = vecs.mean(axis=0)
    mean /= np.linalg.norm(mean) + 1e-9

    fav_genres = list(set().union(*grp["genres"]))

    profiles.append({
        "user_id": uid,
        "user_vec": mean.astype(float).tolist(),
        "fav_genres": fav_genres
    })

profiles_df = pd.DataFrame(profiles)

out = Path("ml/data/processed/user_profiles.parquet")
out.parent.mkdir(parents=True, exist_ok=True)
profiles_df.to_parquet(out, index=False)

print(f"{len(profiles_df):,} user profiles written ➜ {out}")

