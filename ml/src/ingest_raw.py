"""
Pull movies + actors from MongoDB and write raw snapshots to data/raw
Run:  python -m ml.src.ingest_raw
"""

import os, pandas as pd
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
SNAP_DIR  = "ml/data/raw"

def main():
    client = MongoClient(MONGO_URI)
    
    movies = list(client.MovieMind.movies.find({}))
    
    today  = pd.Timestamp("today").strftime("%Y-%m-%d")
    pd.DataFrame(movies).to_parquet(f"{SNAP_DIR}/movies_{today}.parquet", index=False)
    
    print("Saved raw snapshots")

if __name__ == "__main__":
    main()
