"""
Snapshot the current watch-list likes/dislikes -> Parquet
Run:  python -m ml.src.ingest_interactions
"""

from pathlib import Path
from datetime import datetime, timezone
import os
import pandas as pd
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME     = "MovieMind"
USERS_COLLECTION = "users"

client = MongoClient(MONGO_URI)
users_c = client[DB_NAME][USERS_COLLECTION]

docs = list(
    users_c.find(
        {},                   # all users
        {"_id": 1, "watchlist": 1}
    )
)

rows = [] # is a list of dictionaries
for doc in docs:
    uid = doc["_id"]                        # e.g. "nesdamien@gmail.com"
    for item in doc.get("watchlist", []):   # iterate array of movies
        rows.append({
            "user_id":  uid,
            "movie_id": str(item.get("movieid", "")).strip(),
            "liked":    bool(item.get("liked", False))
        })

df = pd.DataFrame(rows)
if df.empty:
    raise ValueError("No watchlist data found. Aborting!")

df["liked"] = df["liked"].astype("int8")

out_dir = Path("ml/data/interactions")
out_dir.mkdir(parents=True, exist_ok=True)

stamp  = datetime.now(timezone.utc).strftime("%Y-%m-%d")
out_f  = out_dir / f"interactions_{stamp}.parquet"
df.to_parquet(out_f, index=False)

print(f"Saved {len(df):,} interaction rows ➜ {out_f}")