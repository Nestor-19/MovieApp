# ─── Base image ─────────────────────────────────────────────────
FROM python:3.13-slim
#   • Python 3.13 on a minimal Debian base

# ─── Install system deps ─────────────────────────────────────────
# • apt-get update to refresh the package index  
# • install git so pip can clone GitHub URLs  
# • remove apt caches to keep the image small
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
#   • All commands now run in /app

# ─── Dependencies ───────────────────────────────────────────────
COPY requirements.txt .
#   • Copy only your dependencies list first

RUN pip install --no-cache-dir -r requirements.txt
#   • Install them; --no-cache-dir keeps the image clean

# ─── Application code & data ────────────────────────────────────
COPY src ./src
#   • Your FastAPI code

# ─── Copy the processed data & model into the path your code wants ─
# create the directory ml/data/processed
RUN mkdir -p ml/data/processed

COPY data/processed/*.parquet ml/data/processed/
COPY data/processed/ranker.joblib ml/data/processed/
#   • Your ML artifacts (parquet files + trained ranker)
#   • You could also mount these as volumes, but copying is simplest

EXPOSE 8000
#   • FastAPI (Uvicorn) will listen on 8000

ENTRYPOINT ["uvicorn","src.recommendation_service:app","--host","0.0.0.0","--port","8000"]
#   • Launch Uvicorn on container start