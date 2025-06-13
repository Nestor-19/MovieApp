import os, time
import requests
from pymongo import MongoClient, UpdateOne

TMDB_KEY    = os.getenv("TMDB_API_KEY")
MONGO_URI   = os.getenv("MONGO_URI")

MIN_LENGTH  = 100
MAX_REVIEWS = 8
RATE_LIMIT  = 0.25 # seconds between API calls

client     = MongoClient(MONGO_URI)
movies_col = client.MovieMind.movies

movies = list(movies_col.find({}, {"_id":1}))

ops = []
for doc in movies:
    tmdb_id = doc["_id"]
    url = f"https://api.themoviedb.org/3/movie/{tmdb_id}/reviews"
    params  = {"api_key": TMDB_KEY, "page": 1}
    
    resp = requests.get(url, params=params)
    if not resp:
        continue
    
    data = resp.json().get("results", [])
    
    good = [r["content"].strip()
            for r in data
            if len(r.get("content","")) >= MIN_LENGTH]
    
    reviews = good[:MAX_REVIEWS]
    
    ops.append(
      UpdateOne(
        {"_id": tmdb_id},
        {"$set": {"reviews": reviews}}
      )
    )
    
    time.sleep(RATE_LIMIT)
    
    if len(ops) >= 100:
        movies_col.bulk_write(ops)
        ops = []
if ops:
    movies_col.bulk_write(ops)
    
print("Done populating movies with reviews.")