"""
Inspect the 7-emotion sentiment scores for ONE movie.
Example:
    python -m ml.src.verify_sentiment --title ""
"""

import argparse
from pathlib import Path
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

parser = argparse.ArgumentParser()
parser.add_argument("--title", required=True, help="Exact movie title to inspect")
args = parser.parse_args()

CLEAN_FILE = Path("ml/data/processed/movies_clean.parquet")

try:
    row = (
        pd.read_parquet(CLEAN_FILE)
          .loc[lambda d: d["title"] == args.title]
          .iloc[0]
    )
except IndexError:
    raise SystemExit(f"Movie titled “{args.title}” not found in {CLEAN_FILE}")

desc_text   = row["clean_desc"]
reviews     = list(row["clean_reviews_list"])

MODEL = "j-hartmann/emotion-english-distilroberta-base"
tok   = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)
clf   = pipeline("text-classification",
                 model=model, tokenizer=tok,
                 top_k=None, truncation=True, padding=True, device=-1)

EMOS = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]

def score(txt: str) -> dict:
    """Return {emotion: probability} for one text."""
    out = clf(txt)[0]
    return {d["label"]: d["score"] for d in out}


desc_scores = score(desc_text)
rev_scores  = [score(r) for r in reviews]

mean_rev = {
    emo: (sum(r[emo] for r in rev_scores) / len(rev_scores)) if rev_scores else 0.0
    for emo in EMOS
}

n = len(reviews)
w_desc, w_rev = (1.0, 0.0) if n == 0 else (0.7, 0.3) if n == 1 else (0.2, 0.8)

final = {emo: w_desc*desc_scores[emo] + w_rev*mean_rev[emo] for emo in EMOS}

print(f"\n Sentiment for “{args.title}”")
print("-"*60)
print("Description first 300 chars:")
print(desc_text[:300] + ("…" if len(desc_text) > 300 else ""))
print(f"\nReviews used: {n}\n")

def fmt(d): return {k: f"{v:.3f}" for k, v in d.items()}

print("Description-only probs :", fmt(desc_scores))
print("Mean review probs      :", fmt(mean_rev))
print(f"Weights                : desc={w_desc}, reviews={w_rev}\n")

print("➡  FINAL blended probabilities")
for emo, p in sorted(final.items(), key=lambda x: x[1], reverse=True):
    print(f"{emo:8s}: {p:.3f}")