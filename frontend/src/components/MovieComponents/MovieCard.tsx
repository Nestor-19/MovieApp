"use client";

import React, { useState } from "react";

export default function MovieCard({ movie }) {
  const [success, setSuccessMsg] = useState("");
  const [fail, setFailMsg] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

  const addToWatchlist = async (tmdbId: number) => {
    try {
      const response = await fetch(`${backendUrl}/api/movie/add/${tmdbId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setSuccessMsg("✅ Movie successfully added to your watchlist!");
        setFailMsg(""); // clear any previous error
      } else {
        const errorText = await response.text();
        setFailMsg(`❌ ${errorText}`);
        setSuccessMsg(""); // clear any previous success
      }
    } catch (error) {
      console.error("Client error:", error);
      setFailMsg("❌ Network error. Please check your connection.");
      setSuccessMsg("");
    }
  };

  const addToWishlist = async (tmdbId: number) => {
    alert("Clicked watchlist btn");
    try {
      const response = await fetch(`${backendUrl}/api/movie/add/${tmdbId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setSuccessMsg("✅ Movie successfully added to your watchlist!");
        setFailMsg(""); // clear any previous error
      } else {
        const errorText = await response.text();
        setFailMsg(`❌ ${errorText}`);
        setSuccessMsg(""); // clear any previous success
      }
    } catch (error) {
      console.error("Client error:", error);
      setFailMsg("❌ Network error. Please check your connection.");
      setSuccessMsg("");
    }
  };

  return (
    <div
      className="group w-72 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4
                 transform transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <h3
        className="text-1xl text-center text-white font-semibold mb-2
                   transition-transform duration-300 group-hover:scale-110"
      >
        {movie.title}
      </h3>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto rounded-md object-cover"
      />
      <p
        className="text-white max-h-16 overflow-hidden transition-all duration-300
                   group-hover:max-h-64 group-hover:overflow-auto
                   transition-transform duration-300 group-hover:scale-105"
      >
        {movie.overview}
      </p>
      <div
        className="text-lg text-white font-semibold mb-2
                   transition-transform duration-300 group-hover:scale-105"
      >
        <p>Avg rating: {movie.vote_average}</p>
      </div>
      <p
        className="text-gray-500 transition-transform duration-300 group-hover:scale-105"
      >
        Release Year: {movie.release_date?.slice(0, 4)}
      </p>
      <p
        className="text-gray-500 transition-transform duration-300 group-hover:scale-105"
      >
        Votes: {movie.vote_count}
      </p>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => addToWatchlist(movie.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-3
                     transition-transform duration-300 group-hover:scale-105"
        >
          Add to watch list
        </button>
        <button
          onClick={() => addToWishlist(movie.id)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700
                     transition-transform duration-300 group-hover:scale-105"
        >
          Watched?
        </button>
      </div>

      {success && (
        <p
          className="mt-4 text-green-600 font-semibold text-center sm:text-left text-sm sm:text-base
                     transition-transform duration-300 group-hover:scale-105"
        >
          {success}
        </p>
      )}
      {fail && (
        <p
          className="mt-4 text-red-600 font-semibold text-center sm:text-left text-sm sm:text-base
                     transition-transform duration-300 group-hover:scale-105"
        >
          {fail}
        </p>
      )}
    </div>
  );
}
