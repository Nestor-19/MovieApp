"use client";
import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";

export interface WatchedMovie {
  tmdbId: number;
  title: string;
  description: string;
  image: string;
  runTime: number;
  rating: number;
  liked: boolean | null;
}

type Props = {
  movie: WatchedMovie;
  onRemove: (id: number) => void;
  onLikeChange: (id: number, liked: boolean) => void;
};

export default function WatchedCard({ movie, onRemove, onLikeChange }: Props) {
    const [busy, setBusy] = useState(false);
      const [likedStatus, setLikedStatus] = useState(movie.liked);

  const handleLike = () => {
    if (busy) return; // Prevent multiple clicks when loading
    setLikedStatus(true); // Set the liked status to true
    toggle(true); // Update the parent state (or send to backend)
  };

  const handleDislike = () => {
    if (busy) return; // Prevent multiple clicks when loading
    setLikedStatus(false); // Set the liked status to false
    toggle(false); // Update the parent state (or send to backend)
  };
    const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

    const remove = async () => {
        setBusy(true);
        try {
            const res = await fetch(`${backendUrl}/api/watchlist/${movie.tmdbId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Delete failed: ${text}`);
            }

            onRemove(movie.tmdbId);
        } catch (error) {
            console.error("Failed to remove:", error);
        } finally {
            setBusy(false);
        }
    };

    const toggle = async (liked: boolean) => {
        setBusy(true);
        try {
            const res = await fetch(`${backendUrl}/api/watchlist/${movie.tmdbId}?liked=${liked}`, {
                method: "PUT",
                credentials: "include",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Update like failed:: ${text}`);
            }

            onLikeChange(movie.tmdbId, liked);
        } catch (error) {
            console.error("Failed to update like:", error);
        } finally {
            setBusy(false);
        }
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
    >            {/* REMOVE BUTTON */}
  <img
    src="/icons/removeIcon.png"
    alt="Remove from Watched List"
    className="absolute top-6 right-5 z-50 w-6 h-6 hover:opacity-80 transition-opacity duration-300"
      onClick={remove}
  />

                <div className="relative rounded-md overflow-hidden">
        <img
                src={movie.image}
          alt={movie.title}
          className="w-full h-auto object-cover rounded-md"
        />
        
      </div>

            {/* TITLE */}
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

            {/* RUNTIME / RATING */}
            <div className="flex justify-between text-gray-300 text-sm mb-2">
                <span>{movie.runTime}m</span>
                <span>⭐ {movie.rating}</span>
            </div>

            {/* DESCRIPTION */}
          <p
        className="
          mt-4
          text-gray-300
          text-md
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
            {/* THUMBS UP / DOWN */}
  <div className="flex justify-center space-x-8 mt-4">
      {/* Thumbs Up Button */}
      <button
        onClick={handleLike}
        disabled={busy}
        className={`p-4 rounded-full bg-gradient-to-r from-green-500 to-green-400 hover:scale-110 transform transition-all duration-300 ease-in-out 
          ${likedStatus === true ? "text-white bg-green-600 shadow-xl" : "text-gray-300"} 
          hover:shadow-2xl focus:outline-none`}
      >
        <FaThumbsUp className="text-3xl" />
      </button>

      {/* Thumbs Down Button */}
      <button
        onClick={handleDislike}
        disabled={busy}
        className={`p-4 rounded-full bg-gradient-to-r from-red-500 to-red-400 hover:scale-110 transform transition-all duration-300 ease-in-out 
          ${likedStatus === false ? "text-white bg-red-600 shadow-xl" : "text-gray-300"} 
          hover:shadow-2xl focus:outline-none`}
      >
        <FaThumbsDown className="text-3xl" />
      </button>
    </div>
        </div>
    );
}
