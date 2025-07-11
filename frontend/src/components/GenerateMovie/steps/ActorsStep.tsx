"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";  // Adding framer-motion for animations

type Props = {
  selected: string[];
  onChange: (a: string[]) => void;
};

export interface Actor {
  actorId: string;
  fullName: string;
  moviesActedIn: string[];
  pictureUrl: string;
}

export default function ActorsStep({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [actors, setActors] = useState<Actor[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

  // Fetch all actors once when this component mounts
  useEffect(() => {
    setLoading(true);
    fetch(`${backendUrl}/api/actors/getAllActors`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Actor[]>;
      })
      .then((data) => {
        setActors(data);
      })
      .catch((err) => console.error("Failed to fetch actors:", err))
      .finally(() => setLoading(false));
  }, [backendUrl]);

  // As `query` changes, recompute `suggestions` by filtering `actors`
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { // only suggestions after 2 characters
      setSuggestions([]);
      return;
    }

    const matches = actors
      .filter((actor) => actor.fullName.toLowerCase().includes(q))
      .map((actor) => actor.fullName);

    // (Optional) Limit to top 10 matches, to avoid too long a dropdown
    setSuggestions(matches.slice(0, 10));
  }, [query, actors]);

  // ③ When user clicks on a suggested name, add it (max 2 total)
  const addActor = (name: string) => {
    if (selected.includes(name)) {
      return; // already in the list
    }
    if (selected.length >= 2) {
      return; // we only allow up to 2 actors
    }
    onChange([...selected, name]);
    setQuery("");
    setSuggestions([]);
  };

  // ④ Remove an actor from the selected list
  const removeActor = (name: string) => {
    onChange(selected.filter((actor) => actor !== name));
  };

  return (
      <motion.div

              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
    <div className="space-y-6">
      {/* Title & instructions */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Favorite actors</h2>
        <p className="text-gray-400">
          Search and add up to 2 actors you'd like to see (optional)
        </p>
      </div>

      {/* Search input with a loading spinner */}
      <div className="relative w-full max-w-md mx-auto">
        <input
          type="text"
          value={query}
          placeholder="Type actor name..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-96 px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
        />
        {/* 🔍 icon */}
        <div className="absolute left-3 top-1/4 transform -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </div>
        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestion dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-[445px] h-[130px] bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-auto">
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => addActor(name)}
              className="w-full px-4 py-3 text-left text-white bg-sky-900 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span>{name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected actors list (with remove “×”) */}
      {selected.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Selected Actors</h3>
            <button
              onClick={() => onChange([])}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((name) => (
              <div
                key={name}
                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm shadow-md"
              >
                <span className="mr-2">⭐</span>
                <span>{name}</span>
                <button
                  onClick={() => removeActor(name)}
                  className="ml-2 hover:text-red-300 transition-colors font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint if user typed fewer than 2 chars */}
      {query.length > 0 && query.length < 2 && (
        <p className="text-sm text-gray-500 text-center">
          Type at least 2 characters to search for actors
        </p>
      )}
    </div>
    </motion.div>
  );
}