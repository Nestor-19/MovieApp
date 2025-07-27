"use client";

import { useState, useEffect } from "react";
import RecommendedMovieCard from "@/components/MovieComponents/RecommendedMovieCard";
import { motion } from "framer-motion";  // Adding framer-motion for animations

export default function GenerateMovieResults() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [movies, setMovies] = useState<any[]>([]); // store movies here
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

  function getRatingColor(rating: number) {
    if (rating <= 4) return "text-red-500";
    if (rating <= 7) return "text-gray-400";
    return "text-yellow-400";
  }

  useEffect(() => {
    async function submitMovieIds() {
      setLoading(true);
      setError(null);

      try {
        const storedIds = localStorage.getItem("recommendedMovieIds");
        if (!storedIds) {
          setError("No recommended movies found.");
          setLoading(false);
          return;
        }

        const movieIds: number[] = JSON.parse(storedIds);

        const formData = new FormData();
        movieIds.forEach((id) => formData.append("movieIds[]", id.toString()));

        const res = await fetch(`${backendUrl}/api/movies/fetchRecommendedMovies`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to submit movies");
        }

        const movies = await res.json();
        console.log("Received movies:", movies);

        setMovies(movies); // save movies in state
        setSubmitted(true);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    submitMovieIds();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-white ml-4 text-lg">Submitting your recommendations...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center text-center text-red-500 text-xl">
        <p>{error}</p>
      </div>
    );

  if (submitted)
    return (
      <div className="px-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-white text-4xl font-bold">Your Recommendations...</h1>
          <p className="text-white text-2xl text-center">
            Here are some films we think you’ll love based on your preferences...
          </p>
        </div>

        {/* Animate grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {movies.map((movie: any) => (
            <motion.div
              key={movie.tmdbId}
              className="movie-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecommendedMovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </div>
    );

  return null;
}
