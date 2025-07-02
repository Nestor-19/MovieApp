"""
Create ONE 384-dimensional vector for every movie:
  - Encode description + reviews with MiniLM-L6-v2
  - Combine description/review vectors with the same weights used for sentiment:
        0 reviews  => 1.0 * desc
        1 review   => (0.7 * desc) + (0.3 * rev)
        ≥ 2 reviews => (0.4 * desc) + (0.6 * mean(reviews))
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
    return vec  # already L2-normalised by the library

vectors = [] # store very movie vector

for _, row in df.iterrows():
    desc_vector = embed(row['clean_desc'])
    
    reviews = row['clean_reviews_list']
    rev_vectors = [embed(r) for r in reviews]
    
    n = len(rev_vectors)
    if n == 0:
        movie_vector = desc_vector
    elif n == 1: 
        movie_vector = 0.7*desc_vector + 0.3*rev_vectors[0]
    else:          
        mean_review  = np.mean(rev_vectors, axis=0)
        movie_vector = 0.4*desc_vector + 0.6*mean_review
    
    
    # final normalisation 
    movie_vector_length = np.linalg.norm(movie_vector)
    movie_vector /= movie_vector_length
    vectors.append(movie_vector)

df["text_vec"] = vectors
df.to_parquet(OUT_FILE, index=False)
print(f"Embedding file written to {OUT_FILE}")