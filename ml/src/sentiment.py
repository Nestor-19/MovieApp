"""
Peform sentiment analysis on description and reviews, and add 7 emotion probabilities to each movie row
Run:  python -m ml.src.sentiment
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import pandas as pd
from pathlib import Path

IN_FILE = Path("ml/data/processed/movies_clean.parquet")
OUT_FILE = Path("ml/data/processed/movies_sentiment.parquet")

df = pd.read_parquet(IN_FILE)

MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"
tok   = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

clf = pipeline(
    task="text-classification",
    model=model,
    tokenizer=tok,
    top_k=None,      
    truncation=True,   # stop at 512 tokens
    padding=True,
    device=-1
)

EMOTIONS = ["Happy", "Inspired", "Excited", "Romantic", "Nostalgic", "Surprised", "Tense", "Scary","Disgusted","Angry","Sad"]

def score(text: str) -> dict:
    """Run model on ONE text -> {emotion: probability}."""
    out = clf(text)[0]
    return {d["label"]: d["score"] for d in out}


all_probs = {e: [] for e in EMOTIONS}

for _, row in df.iterrows():
    desc_score = score(row["clean_desc"])
    reviews = list(row['clean_reviews_list'])
    mean_rev = {}
    
    if len(reviews) > 0:
        rev_scores = [score(r) for r in reviews] # rev_scores is a list of dictionaries
        for emo in EMOTIONS:
            total = sum(r[emo] for r in rev_scores)
            mean_rev[emo] = total / len(rev_scores)
    else:
         mean_rev = {emo: 0.0 for emo in EMOTIONS}
    
    n = len(reviews)
    if n == 0:
        w_desc = 1.0
        w_rev = 0.0
    elif n == 1:
        w_desc = 0.7
        w_rev = 0.3
    else:
        w_desc = 0.4
        w_rev = 0.6
    
    for emo in EMOTIONS:
        final = w_desc * desc_score[emo] + w_rev * mean_rev[emo]
        all_probs[emo].append(final)

for emo in EMOTIONS:
    df[f"prob_{emo}"] = all_probs[emo]

df.to_parquet(OUT_FILE, index=False)
print(f"Sentiment features written to {OUT_FILE}")