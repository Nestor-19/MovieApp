"""
FastAPI app that blends form score (85 %) with ranker taste score (15 %)
to return the Top-10 movies for a single request.
"""

from __future__ import annotations
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np, pandas as pd, joblib
from pathlib import Path
from typing import List, Dict

def _to_list(x):
    # if None / NaN  -> empty list
    # if ndarray -> list(x)
    # if list ➜ do nothing
    if x is None or (isinstance(x, float) and pd.isna(x)):
        return []
    if isinstance(x, np.ndarray):
        return list(x)
    if isinstance(x, list):
        return x
    return [x]

PROC_DIR = Path("ml/data/processed")

movies_sent = (
    pd.read_parquet(PROC_DIR / "movies_sentiment.parquet")
      .set_index("_id")
      .assign(
          genres=lambda d: d.genres.apply(_to_list),
          actors=lambda d: d.actors.apply(_to_list),
          runTime=lambda d: pd.to_numeric(d.runTime, errors="coerce")
                               .fillna(0).astype(int)
      )
)

movies_emb = pd.read_parquet(PROC_DIR / "movies_embeddings.parquet") \
                   .set_index("_id")

profiles = pd.read_parquet(PROC_DIR / "user_profiles.parquet") \
                   .set_index("user_id")

ranker = joblib.load(PROC_DIR / "ranker.joblib")

movies = movies_sent.join(movies_emb[["text_vec"]])

print(movies.columns.tolist())

MOOD_MAP = { # UI to model emotion
    "Happy": "joy", "Surprised": "surprise", "Scary": "fear", 
    "Disgusted": "disgust", "Angry": "anger", "Sad": "sadness", "Neutral": "neutral"
}

# form model
class GenForm(BaseModel):
    user_id: str
    mood: str
    genres: List[str] = []
    actors: List[str] = []
    max_runtime: int   # minutes

app = FastAPI(title="MovieMind recommender")

def form_scores(row, form: GenForm, mood_prob: float) -> float:
    # 0-1 sub-scores
    g_match = len(set(row.genres) & set(form.genres)) / max(1, len(form.genres))
    a_match = len(set(row.actors) & set(form.actors)) / max(1, len(form.actors))
    rt      = 1 - ((form.max_runtime - row.runTime) / form.max_runtime)

    return 0.70*mood_prob + 0.12*g_match + 0.12*a_match + 0.06*rt


def taste_score(user_vec: np.ndarray, fav_genres: List[str], row) -> float:
    genre_overlap = len(set(fav_genres) & set(row.genres)) / \
                    len(set(fav_genres) | set(row.genres) or {1})
    embed_dist    = 1 - np.dot(user_vec, np.array(row.text_vec, float))
    return float(ranker.predict_proba([[genre_overlap, embed_dist]])[0, 1])


@app.post("/recommend")
def recommend(form: GenForm) -> Dict[str, List[str]]:
    if form.mood not in MOOD_MAP:
        raise HTTPException(status_code=400, detail="Unknown mood")

    if form.user_id in profiles.index:
        user_vec   = np.array(profiles.at[form.user_id, "user_vec"], float)
        fav_genres = profiles.at[form.user_id, "fav_genres"]
        seen_ids   = set(movies.index.intersection(
                         profiles.at[form.user_id, "watched_ids"]))
    else:
        user_vec   = np.zeros(384, dtype=float)
        fav_genres = []
        seen_ids   = set()

    # Hard filters
    cand = movies.query("runTime <= @form.max_runtime").copy()

    if form.genres:
        cand = cand[cand.genres.apply(lambda g: bool(set(g) & set(form.genres)))]
    if form.actors:
        cand = cand[cand.actors.apply(lambda a: bool(set(a) & set(form.actors)))]
        
    if cand.empty:
        raise HTTPException(status_code=404, detail="No movies match those filters! Please try again.")


    # Form scores
    emo_col = f"prob_{MOOD_MAP[form.mood]}"
    cand["form_score"] = cand.apply(
        lambda r: form_scores(r, form, r[emo_col]), axis=1)

    topN = cand.nlargest(30, "form_score").copy()

    # Taste score + blend
    topN["taste"] = topN.apply(lambda r: taste_score(user_vec, fav_genres, r), axis=1)
    print(topN)
    
    topN["ultimate"] = 0.85*topN.form_score + 0.15*topN.taste

    # Final sort, drop already-seen films
    topN = topN.drop(index=topN.index.intersection(seen_ids))
    top10 = topN.nlargest(10, "ultimate")

    return {
        "movie_ids": top10.index.tolist(),
        "titles":    top10.title.tolist()
    }