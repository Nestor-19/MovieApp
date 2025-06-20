import os, time, datetime
import requests
from pymongo import MongoClient, UpdateOne

TMDB_KEY    = os.getenv("TMDB_API_KEY")
MONGO_URI   = os.getenv("MONGO_URI")

MIN_LENGTH  = 100
MAX_REVIEWS = 8
RATE_LIMIT  = 0.25

client     = MongoClient(MONGO_URI)
movies_col = client.MovieMind.movies

cursor = movies_col.find(
    { "$or": [
        { "reviews":     { "$exists": False } },
        { "releaseDate": { "$exists": False } }
    ] },
    { "_id": 1 }
)
tmdb_ids = [doc["_id"] for doc in cursor]

bulk_ops = []
for tmdb_id in tmdb_ids:

    rev_url  = f"https://api.themoviedb.org/3/movie/{tmdb_id}/reviews"
    rev_resp = requests.get(rev_url,
                            params={ "api_key": TMDB_KEY, "page": 1 })
    reviews_json = rev_resp.json().get("results", []) if rev_resp.ok else []
    good_reviews = [r["content"].strip()
                    for r in reviews_json
                    if len(r.get("content", "")) >= MIN_LENGTH][:MAX_REVIEWS]

    meta_url  = f"https://api.themoviedb.org/3/movie/{tmdb_id}"
    meta_resp = requests.get(meta_url,
                             params={ "api_key": TMDB_KEY, "language": "en-US" })
    rel_date_str = None
    if meta_resp.ok:
        rel_date_str = meta_resp.json().get("release_date")

    update_doc = { "reviews": good_reviews } # set reviews

    if rel_date_str: # add date if present
        rel_date_obj  = datetime.datetime.strptime(rel_date_str, "%Y-%m-%d")
        update_doc["releaseDate"] = rel_date_obj
        update_doc["releaseYear"] = rel_date_obj.year

    bulk_ops.append(
        UpdateOne({ "_id": tmdb_id },
                  { "$set": update_doc })
    )

    time.sleep(RATE_LIMIT)
    if len(bulk_ops) >= 100:
        movies_col.bulk_write(bulk_ops)
        bulk_ops = []

if bulk_ops:
    movies_col.bulk_write(bulk_ops)

print("Done populating reviews and release dates.")