"""
Clean raw movie description and reviews
Run:  python -m ml.src.clean_text
"""

import re
import glob
import pandas as pd, pathlib
from pathlib import Path

PROCESSED_DIR = pathlib.Path("ml/data/processed")
OUT_FILE = PROCESSED_DIR / "movies_clean.parquet"

latest = sorted(glob.glob(f"{PROCESSED_DIR}/movies_with_split.parquet"))[-1]
df = pd.read_parquet(latest) 

_clean_re_html   = re.compile(r"<[^>]+>")
_clean_re_emoji  = re.compile(r"[^\w\s.,!?'\-]")
_clean_re_spaces = re.compile(r"\s{2,}")

def clean(text):
    """
    Lower-case, strip HTML & emoji, collapse whitespace.
    """
    text = text.lower()
    text = _clean_re_html.sub(" ", text)
    text = text.replace("\n", " ").replace("\r", " ")
    text = _clean_re_emoji.sub(" ", text)
    text = _clean_re_spaces.sub(" ", text)
    return text.strip()

# Apply clean() to each row
df["clean_desc"] = df["description"].fillna("").apply(clean)

df["clean_reviews_list"] = df["reviews"].apply(
    lambda lst: [clean(r) for r in lst]
)

# df["clean_reviews"] = (
#     df["reviews"]
#     .apply(lambda lst: " ".join(clean(r) for r in lst))
# )

df.to_parquet(OUT_FILE, index=False)
print(f"Cleaned movie description + reviews written to {OUT_FILE}")