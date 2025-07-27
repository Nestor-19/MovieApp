import os
import time
import requests
from pymongo import MongoClient
from requests.adapters import HTTPAdapter, Retry

# ───────────────────────── Configuration ─────────────────────────
TMDB_KEY        = os.getenv("TMDB_API_KEY")
MONGO_URI       = os.getenv("MONGO_URI")
# MOVIES_COL_NAME = os.getenv("MOVIES_COLLECTION", "movies")
# ACTORS_COL_NAME = os.getenv("ACTORS_COLLECTION", "actors")
RATE_DELAY      = float(os.getenv("RATE_DELAY", 0.3))  # seconds between requests

if not TMDB_KEY:
    raise RuntimeError("❌ TMDB_API_KEY environment variable not set")
if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI environment variable not set")

# ────────────────── HTTP Session with Retries ──────────────────
session = requests.Session()
retries = Retry(
    total=5,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)
session.mount("https://", HTTPAdapter(max_retries=retries))

def tmdb_search_person(name: str) -> dict:
    """
    Call /search/person and return the JSON of the first match (or {} if none).
    """
    time.sleep(RATE_DELAY)
    res = session.get(
        "https://api.themoviedb.org/3/search/person",
        params={"api_key": TMDB_KEY, "query": name},
        timeout=10
    )
    res.raise_for_status()
    data = res.json()
    results = data.get("results") or []
    return results[0] if results else {}

# ─────────────────────────── Main Script ───────────────────────────
def main():
    client = MongoClient(MONGO_URI)
    # db = client.get_default_database()
    # movies_col = db[MOVIES_COL_NAME]
    # actors_col = db[ACTORS_COL_NAME]
    movies_col = client.MovieMind.movies
    actors_col = client.MovieMind.actors

    # 1. Gather all unique actor names from movies
    actor_names = set()
    for movie in movies_col.find({}, {"actors": 1}):
        actor_names.update(movie.get("actors", []))
    total = len(actor_names)
    print(f"Found {total} unique actor names in `{movies_col}`.")

    # 2. For each name, query TMDB and upsert into actors collection
    for idx, name in enumerate(sorted(actor_names), start=1):
        try:
            person = tmdb_search_person(name)
            if not person:
                print(f"[warn] No TMDB match for “{name}”")
                continue
                
            dept = person.get("known_for_department")
            popularity  = person.get("popularity", 0.0)
            
            if dept != "Acting" or popularity < 3:
                print(f"[skip] {name}: dept={dept}, popularity={popularity:.1f}")
                continue

            actor_doc = {
                "_id":        person["id"],
                "fullName":   person["name"],
                "popularity": person.get("popularity", 0.0)
            }
            
            actors_col.replace_one(
                {"_id": actor_doc["_id"]},
                actor_doc,
                upsert=True
            )
            print(f"[{idx}/{total}] Upserted: {actor_doc['fullName']} (ID={actor_doc['_id']})")

        except Exception as e:
            print(f"[error] Failed for “{name}”: {e}")

    print("\n✅ All done. Actors collection populated.")

if __name__ == "__main__":
    main()
