"""
Create ONE 384-dimensional vector for every movie:
  - Encode description with MiniLM-L6-v2
  - L2-normalise the final vector (good practice for ANN search)
  - Save to  ml/data/processed/movies_embeddings.parquet
Run:  python -m ml.src.embeddings
"""

from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd
from pathlib import Path

IN_FILE  = Path("ml/data/processed/movies_clean.parquet")
OUT_FILE = Path("ml/data/processed/movies_embeddings.parquet")

df = pd.read_parquet(IN_FILE)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def embed(text: str) -> np.ndarray:
    """Return 384-float numpy array (unit length)."""
    vec = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    return vec

vectors = [] # store very movie vector

for _, row in df.iterrows():
    movie_vector = embed(row['clean_desc'])
    vectors.append(movie_vector)

df["text_vec"] = vectors
df.to_parquet(OUT_FILE, index=False)
print(f"Embedding file written to {OUT_FILE}")