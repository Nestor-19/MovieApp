import openai
import time
import json
import os

# Set your OpenAI API key (⚠️ Avoid hardcoding sensitive info!)
client = openai.OpenAI(api_key="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")  # ← your actual key here
movie_titles = [...]  # your 900+ movie list
moods = [
    "Happy", "Inspired", "Excited", "Romantic", "Nostalgic",
    "Surprised", "Tense", "Scary", "Disgusted", "Angry", "Sad"
]

def get_mood_scores(movie_name, max_retries=3):
    prompt = (
        f"Rate the movie '{movie_name}' for how much it evokes each of these moods: "
        f"{', '.join(moods)}.\n"
        "Use a scale from 0.00 (not at all) to 1.00 (very strongly), rounded to two decimal places.\n"
        "Return ONLY the JSON dictionary (no explanation, no markdown, no extra text) where each mood is a key and the score is a float."
    )
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            reply = response.choices[0].message.content.strip()
            mood_scores = json.loads(reply)
            # Validate keys and values (optional)
            if all(mood in mood_scores for mood in moods):
                return mood_scores
            else:
                print(f"Warning: Missing moods in response for '{movie_name}'. Retrying...")
        except json.JSONDecodeError as e:
            print(f"JSON decode error for movie '{movie_name}' on attempt {attempt+1}: {e}")
        except Exception as e:
            print(f"Error for movie '{movie_name}' on attempt {attempt+1}: {e}")
        
        sleep_time = 2 ** attempt + random.uniform(0, 1)
        time.sleep(sleep_time)  # Exponential backoff with jitter

    print(f"Failed to get valid response for '{movie_name}' after {max_retries} attempts.")
    return None


movie_mood_data = {}
all_probs = {mood: [] for mood in moods}
save_interval = 20  # save after every 20 movies processed

for idx, movie in enumerate(movie_titles):
    print(f"Processing [{idx + 1}/{len(movie_titles)}]: {movie}")
    scores = get_mood_scores(movie)
    if scores:
        movie_mood_data[movie] = scores
        print(f"Scores for '{movie}': {json.dumps(scores, indent=2)}")
        for mood in moods:
            all_probs[mood].append(scores.get(mood, 0.0))
    else:
        # Append zeros for missing data to keep length consistent
        for mood in moods:
            all_probs[mood].append(0.0)

    # Periodic saving to avoid data loss
    if (idx + 1) % save_interval == 0:
        print(f"Saving progress after {idx + 1} movies...")
        with open("movie_moods.json", "w") as f:
            json.dump(movie_mood_data, f, indent=2)
        with open("all_probs_by_mood.json", "w") as f:
            json.dump(all_probs, f, indent=2)

    # Be mindful of rate limits, adjust sleep as necessary
    time.sleep(1.5)

# Final save
with open("movie_moods.json", "w") as f:
    json.dump(movie_mood_data, f, indent=2)
with open("all_probs_by_mood.json", "w") as f:
    json.dump(all_probs, f, indent=2)

print("Processing complete!")