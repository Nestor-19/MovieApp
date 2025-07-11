"""
Fit logistic-regression ranker on genre_overlap & embed_dist.
Run nightly:  python -m ml.src.train_ranker
"""

from pathlib import Path
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

FEAT_FILE = Path("ml/data/processed/features_trainvaltest.parquet")
MODEL_OUT = Path("ml/data/processed/ranker.joblib")

df = pd.read_parquet(FEAT_FILE)

train = df.query("split == 'train'")
val   = df.query("split == 'val'")

X_train, y_train = train[["genre_overlap", "embed_dist"]], train["liked"]
X_val,   y_val   = val[["genre_overlap", "embed_dist"]],   val["liked"]

clf = LogisticRegression(solver="liblinear", class_weight="balanced")
clf.fit(X_train, y_train)

val_auc = roc_auc_score(y_val, clf.predict_proba(X_val)[:, 1])
print(f"Validation AUC = {val_auc:.3f}")

MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(clf, MODEL_OUT)
print(f"Ranker saved ➜ {MODEL_OUT}")

w = clf.coef_[0]
print(f"Weights genre_overlap: {w[0]:.3f}   embed_dist: {w[1]:.3f}")