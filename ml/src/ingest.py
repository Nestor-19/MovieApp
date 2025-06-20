"""
Pull movies + actors from MongoDB and write raw snapshots to data/raw
Run:  python -m ml.src.ingest
"""

import os, pandas as pd
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
SNAP_DIR  = "ml/data/raw"

def main():
    client = MongoClient(MONGO_URI)
    
    movies = list(client.MovieMind.movies.find({}, {"_id":0}))
    actors = list(client.MovieMind.actors.find({}, {"_id":0}))
    
    today  = pd.Timestamp("today").strftime("%Y-%m-%d")
    pd.DataFrame(movies).to_parquet(f"{SNAP_DIR}/movies_{today}.parquet", index=False)
    pd.DataFrame(actors).to_parquet(f"{SNAP_DIR}/actors_{today}.parquet", index=False)
    
    print("Saved raw snapshots")

if __name__ == "__main__":
    main()
