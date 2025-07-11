import openai
import time
import json
import os

# Set your OpenAI API key (⚠️ Avoid hardcoding sensitive info!)
client = openai.OpenAI(api_key="")  # ← your actual key here
movie_titles = [
    "The Dark Knight",
    "American Psycho",
    "The Shawshank Redemption",
    "Inception",
    "La La Land",
    "Her",
    "Get Out"
]

moods = [
    "Happy", "Inspired", "Excited", "Romantic", "Nostalgic",
    "Surprised", "Tense", "Scary", "Disgusted", "Angry", "Sad"
]

def get_mood_scores(movie_name):
    prompt = (
        f"Rate the movie '{movie_name}' for how much it evokes each of these moods: "
        f"{', '.join(moods)}.\n"
        "Use a scale from 0.00 (not at all) to 1.00 (very strongly), rounded to two decimal places.\n"
        "Return ONLY the JSON dictionary (no explanation, no markdown, no extra text) where each mood is a key and the score is a float."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        reply = response.choices[0].message.content.strip()
        mood_scores = json.loads(reply)
        return mood_scores

    except Exception as e:
        print(f"Error for movie '{movie_name}': {e}")
        print(f"Raw reply was: {reply if 'reply' in locals() else 'No reply'}")
        return None


movie_mood_data = {}
all_probs = {mood: [] for mood in moods}

for idx, movie in enumerate(movie_titles):
    print(f"Processing [{idx + 1}/{len(movie_titles)}]: {movie}")
    scores = get_mood_scores(movie)
    if scores:
        movie_mood_data[movie] = scores
        print(f"Scores for '{movie}':")
        print(json.dumps(scores, indent=2))   # <-- print nicely formatted JSON here
        for mood in moods:
            all_probs[mood].append(scores.get(mood, 0.0))
    time.sleep(2)


with open("movie_moods.json", "w") as f:
    json.dump(movie_mood_data, f, indent=2)

with open("all_probs_by_mood.json", "w") as f:
    json.dump(all_probs, f, indent=2)