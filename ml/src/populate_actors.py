"""
Populate each movie document in MongoDB with an `actors` string-array.

Rule
-----
• Take people from  /movie/{id}/credits  where
      known_for_department == "Acting"   AND   popularity > 5
• If fewer than 3 such names, fall back to the movie’s billing order
  (field `order`) until we have at most TOP_N names.

Run:  python -m ml.src.populate_actors
"""

from __future__ import annotations
import os, time, requests
from typing import List
from pymongo import MongoClient, UpdateOne

TMDB_KEY   = os.getenv("TMDB_API_KEY")
MONGO_URI  = os.getenv("MONGO_URI")
RATE_LIMIT = 0.25
TOP_N      = 10 

client      = MongoClient(MONGO_URI)
movies_col  = client.MovieMind.movies

tmdb_ids = [d["_id"] for d in movies_col.find({}, {"_id": 1})]
print(f"Refreshing actors + genres for {len(tmdb_ids)} movies …")

bulk_ops: List[UpdateOne] = []

for mid in tmdb_ids:
    url   = f"https://api.themoviedb.org/3/movie/{mid}/credits"
    creds = requests.get(url, params={"api_key": TMDB_KEY}).json()

    cast  = creds.get("cast", []) if isinstance(creds, dict) else []

    popular = [c for c in cast
               if c.get("known_for_department") == "Acting"
               and c.get("popularity", 0) > 3]
    
    names = [c["name"] for c in popular]

    if len(popular) < 3:
        billed = sorted(
            (c for c in cast if c.get("known_for_department") == "Acting"),
            key=lambda x: x.get("order", 9999)
        )
        
        extra = [c["name"] for c in billed]
        names = list(dict.fromkeys(names + extra))[:TOP_N]
        
        
    meta_url = f"https://api.themoviedb.org/3/movie/{mid}"
    meta_js  = requests.get(meta_url,
                            params={"api_key": TMDB_KEY, "language": "en-US"}).json()

    genres_js  = meta_js.get("genres", []) if isinstance(meta_js, dict) else []
    genre_names = [g["name"] for g in genres_js]
    
    update_doc = {}
    if names:
        update_doc["actors"] = names
    if genre_names:
        update_doc["genres"] = genre_names

    if not update_doc:
        continue
    
    bulk_ops.append(UpdateOne({"_id": mid}, {"$set": update_doc}))

    # flush every 100 movies
    if len(bulk_ops) >= 100:
        movies_col.bulk_write(bulk_ops)
        bulk_ops = []

    time.sleep(RATE_LIMIT)

# flush leftovers
if bulk_ops:
    movies_col.bulk_write(bulk_ops)

print("Actors & genres refreshed for all movies.")