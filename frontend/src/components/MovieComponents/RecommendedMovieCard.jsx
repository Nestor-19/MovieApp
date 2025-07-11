import React, { useState, useEffect } from "react";
import { fetchMovieDetails } from "@/utils/movieDetails";
function getRatingColor(rating) {
  if (rating <= 4) return "text-red-500";
  if (rating <= 7) return "text-gray-400";
  return "text-yellow-400";
}

export default function RecommendedMovieCard({ movie }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [failMsg, setFailMsg] = useState("");
  const [imageUrl, setImage] = useState("")
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;


  const fallbackImage = "https://image.tmdb.org/t/p/original/"+image; // Your fallback image path

  useEffect(() => {
    async function getRuntime() {
      try {
        const details = await fetchMovieDetails(movie.tmdbId);
        setImage(details.poster_path);
      } catch (error) {
        console.error("Failed to fetch movie runtime:", error);
      }
    }
    getRuntime();
  }, [movie.id]);
  
  const addToWishlist = async (tmdbId) => {
    alert("Clicked watchlist btn");
    console.log(tmdbId);
    try {
      const response = await fetch(`${backendUrl}/api/wishlist/addToWishlist`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tmdbId),
      });

      if (response.ok) {
        setSuccessMsg("✅ Movie successfully added to your watchlist!");
        setFailMsg("");
      } else {
        const errorText = await response.text();
        setFailMsg(`❌  Movie is already in your watchlist`);
        setSuccessMsg("");
      }
    } catch (error) {
      console.error("Client error:", error);
      setFailMsg("❌ Network error. Please check your connection.");
      setSuccessMsg("");
    }
  };

  // Handlers for thumbs up/down buttons
  const handleThumbsUp = () => {
    alert(`👍 Glad "${movie.title}" matched what you wanted!`);
  };

  const handleThumbsDown = () => {
    alert(`👎 Sorry that "${movie.title}" didn't match your expectations.`);
  };

  return (
    <div
      className="
        group
        relative
        w-72
        bg-gray-800
        rounded-xl
        shadow-lg
        border
        border-gray-700
        p-4
        transform
        transition-all
        duration-300
        ease-in-out
        hover:scale-110
        hover:z-50
        hover:shadow-2xl
        overflow-hidden
      "
      style={{ transformOrigin: "center" }}
    >
      <h3
        className="
          text-2xl
          text-center
          text-white
          font-semibold
          mb-2
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {movie.title}
      </h3>

      <div className="relative rounded-md overflow-hidden">
        <img
                src={movie.image || fallbackImage}
          alt={movie.title}
          className="w-full h-auto object-cover rounded-md"
        />
        <button
          className="
            absolute
            top-2
            left-2
            bg-green-600
            hover:bg-blue-700
            text-white
            text-sm
            px-4
            py-2
            rounded
            shadow-lg
            opacity-80
            transition
            duration-300
          "
          onClick={() => addToWishlist(movie)}
        >
          Add To List
        </button>
      </div>

      {/* Thumbs up/down buttons */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handleThumbsUp}
          aria-label="Thumbs up"
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            text-2xl
            p-2
            rounded
            shadow-md
            transition
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-green-400
            focus:ring-opacity-75
          "
        >
          👍
        </button>
        <button
          onClick={handleThumbsDown}
          aria-label="Thumbs down"
          className="
            bg-red-600
            hover:bg-red-700
            text-white
            text-2xl
            p-2
            rounded
            shadow-md
            transition
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
            focus:ring-opacity-75
          "
        >
          👎
        </button>
      </div>

      {/* Full description, only visible on hover */}
      <p
        className="
          mt-4
          text-gray-300
          text-sm
          opacity-0
          max-h-0
          overflow-hidden
          transition-all
          duration-500
          group-hover:opacity-100
          group-hover:max-h-96
        "
      >
        {movie.description}
      </p>

      {/* Hint text, visible only when NOT hovered */}
      <span
        className="
          block
          mt-4
          text-md
          text-gray-400
          italic
          transition-opacity
          duration-500
          group-hover:opacity-0
          opacity-100
          max-h-6
        "
      >
        Hover to read more...
      </span>

      <div
        className={`
          mt-3
          text-center
          font-bold
          text-xl
          max-h-0
          opacity-0
          overflow-hidden
          transition-all
          duration-500
          group-hover:max-h-10
          group-hover:opacity-100
          ${getRatingColor(movie.rating)}
        `}
      >
        Critics Rate This: ⭐ {movie.rating}
      </div>

      {/* Optional: Show success or fail message */}
      {successMsg && <p className="text-green-400 mt-2">{successMsg}</p>}
      {failMsg && <p className="text-red-400 mt-2">{failMsg}</p>}
    </div>
  );
}
