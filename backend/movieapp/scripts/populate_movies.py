from __future__ import annotations

import os
import time
import math
import sys
import re
from typing import List, Dict, Any, Optional

import requests
from pymongo import MongoClient
from pymongo.collection import Collection
from requests.adapters import HTTPAdapter, Retry

# ───────────────────────── Configuration ─────────────────────────
TMDB_KEY    = os.getenv("TMDB_API_KEY")
MONGO_URI   = os.getenv("MONGO_URI")
TARGET_SIZE = 1200              # number of accepted movie docs we want
MIN_REVIEWS = 2                 # must retain ≥ 2 reviews
MIN_REVIEW_CHARS = 100
MAX_REVIEW_PAGES = 10            # safety cap to avoid endless paging
MAX_REVIEWS_PER_MOVIE = 3 
ACTOR_POP_MIN = 3.0
RATE_DELAY = 0.30               # seconds between raw requests
POSTER_BASE = "https://image.tmdb.org/t/p/w500"

if not TMDB_KEY:
    print("❌ TMDB_API_KEY not set in environment.")
    sys.exit(1)

# ───────────────────────── HTTP Session with Retries ─────────────
session = requests.Session()
retries = Retry(
    total=5,
    backoff_factor=0.7,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)
session.mount("https://", HTTPAdapter(max_retries=retries))

def tmdb_get(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Wrapper with rate delay + unified error handling."""
    params = {**params, "api_key": TMDB_KEY}
    url = f"https://api.themoviedb.org/3{path}"
    time.sleep(RATE_DELAY)
    r = session.get(url, params=params, timeout=20)
    if r.status_code != 200:
        raise RuntimeError(f"TMDB {path} {r.status_code}: {r.text[:200]}")
    js = r.json()
    if not isinstance(js, dict):
        raise RuntimeError(f"Unexpected JSON for {path}: {js}")
    return js

# ───────────────────────── Mongo Setup ───────────────────────────
mongo_client = MongoClient(MONGO_URI)
movies_col  = mongo_client.MovieMind.movies

print(f"Connected to MongoDB database, Collection = 'movies'.")

# ───────────────────────── Utility Functions ─────────────────────
WS_RE = re.compile(r"\s+")

def clean_text(txt: str) -> str:
    return WS_RE.sub(" ", txt).strip()

def build_iso_date(date_str: str) -> Optional[str]:
    if not date_str:
        return None
    # Expecting "YYYY-MM-DD"
    parts = date_str.split("-")
    if len(parts) != 3:
        return None
    return f"{date_str}T00:00:00.000+00:00"

def fetch_movie_details(mid: int) -> Optional[Dict[str, Any]]:
    try:
        return tmdb_get(f"/movie/{mid}", {"language": "en-US"})
    except Exception as e:
        print(f"[warn] details failed {mid}: {e}")
        return None

def fetch_credits(mid: int) -> List[Dict[str, Any]]:
    try:
        js = tmdb_get(f"/movie/{mid}/credits", {"language": "en-US"})
        return js.get("cast", []) if isinstance(js, dict) else []
    except Exception as e:
        print(f"[warn] credits failed {mid}: {e}")
        return []

def fetch_reviews(mid: int,
                      min_need: int,
                      max_pages: Optional[int] = MAX_REVIEW_PAGES,
                      max_keep: Optional[int] = MAX_REVIEWS_PER_MOVIE) -> List[str]:
    """
    Collect ALL qualifying reviews (>= MIN_REVIEW_CHARS) up to max_pages.
    Return [] if fewer than min_need are found (signals caller to skip movie).
    If max_keep is set, keep the *longest* max_keep reviews (better sentiment signal).
    """
    collected: List[str] = []
    page = 1
    while True:
        try:
            js = tmdb_get(f"/movie/{mid}/reviews", {"page": page})
        except Exception as e:
            print(f"[warn] reviews failed mid={mid} page={page}: {e}")
            break

        results = js.get("results", []) if isinstance(js, dict) else []
        if not results:
            break

        for r in results:
            content = r.get("content")
            if not isinstance(content, str):
                continue
            cleaned = clean_text(content)
            if len(cleaned) >= MIN_REVIEW_CHARS:
                collected.append(cleaned)

        total_pages = js.get("total_pages", page)

        # Stop if we reached last page
        if page >= total_pages:
            break

        # Stop if we reached max_pages (if defined)
        if max_pages is not None and page >= max_pages:
            break

        page += 1

    if len(collected) < min_need:
        return []

    # Optional: keep longest (more semantic content)
    if max_keep is not None and len(collected) > max_keep:
        collected.sort(key=len, reverse=True)
        collected = collected[:max_keep]

    return collected

def select_actors(cast: List[Dict[str, Any]]) -> List[str]:
    # Primary pass: acting dept + popularity threshold
    acting_pop = [
        c for c in cast
        if c.get("known_for_department") == "Acting"
        and c.get("popularity", 0.0) >= ACTOR_POP_MIN
    ]
    names = [c.get("name") for c in acting_pop if c.get("name")]

    # Fallback: add top-billed until we have a reasonable list (limit)
    if len(names) < 3:
        billed = sorted(
            (c for c in cast if c.get("known_for_department") == "Acting"),
            key=lambda x: x.get("order", math.inf)
        )
        for c in billed:
            nm = c.get("name")
            if nm and nm not in names:
                names.append(nm)
            if len(names) >= 10:
                break
    return names

# ───────────────────────── Main Harvest Loop ─────────────────────
accepted = 0
page = 1
seen_ids = set()

print(f"Starting harvest to reach {TARGET_SIZE} movies with ≥ {MIN_REVIEWS} reviews (each ≥ {MIN_REVIEW_CHARS} chars).")

while accepted < TARGET_SIZE:
    try:
        top_page = tmdb_get("/movie/top_rated", {"page": page})
    except Exception as e:
        print(f"[error] top_rated page {page} failed: {e} – retrying next page.")
        page += 1
        continue

    page_results = top_page.get("results", [])
    if not page_results:
        print(f"[info] No results on top_rated page {page}. Stopping.")
        break

    print(f"[page {page}] Fetched {len(page_results)} candidates. Accepted so far: {accepted}")

    for item in page_results:
        if accepted >= TARGET_SIZE:
            break

        mid = item.get("id")
        if mid in seen_ids or not isinstance(mid, int):
            continue
        seen_ids.add(mid)

        # ---- Fetch details ----
        details = fetch_movie_details(mid)
        if not details:
            continue

        overview = details.get("overview") or ""
        overview = clean_text(overview)
        if not overview:
            # empty description reduces sentiment quality; skip
            continue

        genres_js = details.get("genres", [])
        genre_names = [g.get("name") for g in genres_js if g.get("name")]
        if not genre_names:
            # require at least one genre
            continue

        runtime = details.get("runtime")
        if runtime is None or not isinstance(runtime, int) or runtime <= 0:
            # require runtime to exist
            continue

        poster_path = details.get("poster_path")
        image_url = f"{POSTER_BASE}{poster_path}" if poster_path else None

        vote_avg = details.get("vote_average", 0.0)
        rating_int = int(round(vote_avg)) if isinstance(vote_avg, (int, float)) else 0

        release_date = details.get("release_date") or ""
        iso_date = build_iso_date(release_date)
        if not iso_date:
            continue
        try:
            release_year = int(release_date.split("-")[0])
        except Exception:
            release_year = None

        # ---- Reviews (need ≥2) ----
        reviews = fetch_reviews(mid, MIN_REVIEWS)
        if len(reviews) < MIN_REVIEWS:
            # skip movie (insufficient review text)
            continue

        # ---- Credits (actors) ----
        cast = fetch_credits(mid)
        actor_names = select_actors(cast)

        doc = {
            "_id": mid,
            "title": details.get("title") or details.get("original_title"),
            "description": overview,
            "image": image_url,
            "runTime": runtime,
            "genres": genre_names,
            "rating": rating_int,
            "reviews": reviews,
            "releaseDate": iso_date,
            "releaseYear": release_year,
            "actors": actor_names
        }

        movies_col.replace_one({"_id": mid}, doc, upsert=True)
        accepted += 1

        if accepted % 50 == 0:
            print(f"  → Progress: {accepted} / {TARGET_SIZE}")

    page += 1

print(f"\n✅ Completed. Total accepted movies: {accepted}")
if accepted < TARGET_SIZE:
    print("⚠️  Finished early because there were no more top_rated pages with qualifying movies.")
else:
    print("All target movies inserted.")