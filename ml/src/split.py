"""
Read latest raw snapshot, add a 'split' column (train/val/test), and save to data/processed.
Run:  python -m ml.src.split
"""

import glob, pandas as pd, pathlib

RAW_DIR = pathlib.Path("ml/data/raw")
PROCESSED_DIR = pathlib.Path("ml/data/processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

latest_snapshot = sorted(glob.glob(f"{RAW_DIR}/movies_*.parquet"))[-1]
movies = pd.read_parquet(latest_snapshot)

def assign(row):
    y = row["releaseYear"]
    if y <= 2015:
        return "train"
    elif 2016 <= y < 2021:
        return "val"
    else:
        return "test"  # >= 2021

movies["split"] = movies.apply(assign, axis=1)

out_path = PROCESSED_DIR / "movies_with_split.parquet"
movies.to_parquet(out_path, index=False)
print(f"Saved {out_path}")