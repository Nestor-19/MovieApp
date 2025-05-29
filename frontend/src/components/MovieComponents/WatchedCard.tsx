"use client";
import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";

export interface WatchedMovie {
  tmdbId: string;
  title: string;
  description: string;
  image: string;
  runTime: number;
  rating: number;
  liked: boolean | null;
}

type Props = {
  movie: WatchedMovie;
  onRemove: (id: string) => void;
  onLikeChange: (id: string, liked: boolean) => void;
};

export default function WatchedCard({ movie, onRemove, onLikeChange }: Props) {
    const [busy, setBusy] = useState(false);
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
        <div className="relative group w-72 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 hover:scale-105 transition-transform">
            {/* REMOVE BUTTON */}
            <button
                onClick={remove}
                disabled={busy}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Remove from watched"
            >
                <FaTrash />
            </button>

            {/* IMAGE */}
            <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-40 object-cover rounded-md mb-2"
            />

            {/* TITLE */}
            <h3 className="text-white font-semibold mb-1">{movie.title}</h3>

            {/* RUNTIME / RATING */}
            <div className="flex justify-between text-gray-300 text-sm mb-2">
                <span>{movie.runTime}m</span>
                <span>⭐ {movie.rating}</span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-200 text-xs mb-4 line-clamp-3">
                {movie.description}
            </p>

            {/* THUMBS UP / DOWN */}
            <div className="flex justify-center space-x-6">
                <button
                    onClick={() => toggle(true)}
                    disabled={busy}
                    className={`text-2xl ${movie.liked === true ? "text-green-400" : "text-gray-500"} hover:text-green-300`}
                >
                    <FaThumbsUp />
                </button>
                <button
                    onClick={() => toggle(false)}
                    disabled={busy}
                    className={`text-2xl ${movie.liked === false ? "text-red-400" : "text-gray-500"} hover:text-red-300`}
                >
                    <FaThumbsDown />
                </button>
            </div>
        </div>
    );
}
