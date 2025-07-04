"""
Build/recreate the Qdrant ANN index from movies_embeddings.parquet
Run:  python -m ml.src.build_index
"""

from qdrant_client import QdrantClient, models
import os, time, pandas as pd
from pathlib import Path
import tqdm

EMBED_FILE   = Path("ml/data/processed/movies_embeddings.parquet")
COLLECTION_NAME = "movies_vec"
VEC_DIM = 384
QDRANT_URL = os.getenv("QDRANT_URL")
API_KEY = os.getenv("QDRANT_API_KEY")

client = QdrantClient(url=QDRANT_URL, api_key=API_KEY)

collection_exists = client.collection_exists(collection_name=COLLECTION_NAME)

if collection_exists: # existing collection found
        print("Existing collection found!")
        client.delete_collection(collection_name=COLLECTION_NAME)
        time.sleep(2)
        
client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=models.VectorParams(size=VEC_DIM, distance=models.Distance.COSINE)
)

df = pd.read_parquet(EMBED_FILE)

BATCH = 256
points = []

for idx, row in tqdm.tqdm(df.iterrows(), total=len(df), desc="Upserting Movie Vectors"):
    points.append(
        models.PointStruct(
            id = int(row["_id"]),
            vector=row["text_vec"].astype(float).tolist(),
            payload = {
                "title":   str(row["title"]),
                "genres":  list(row["genres"]),
                "runtime": int(row["runTime"]),
                "numReviews" : int(len(row["clean_reviews_list"]))
            }
        )
    )
    
    if len(points) >= BATCH:
        client.upsert(collection_name=COLLECTION_NAME, points=points)
        points = []

# Upsert any leftover vectors
if points:
    client.upsert(collection_name=COLLECTION_NAME, points=points)

print("All movie vectors upserted into Qdrant!")