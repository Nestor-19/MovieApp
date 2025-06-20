"""
Print how many rows are in each train / val / test split
Run:  python -m ml.src.check_split
"""

import pandas as pd
from pathlib import Path

PROC_FILE = Path("ml/data/processed/movies_with_split.parquet")

df = pd.read_parquet(PROC_FILE)

counts = df["split"].value_counts().sort_index()
total  = len(df)
percent = (counts / total * 100).round(2)

print("\nRow counts:")
print(counts.to_string())

print("\nPercentages:")
print(percent.to_string())