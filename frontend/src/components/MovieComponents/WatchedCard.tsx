"use client";
import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';

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
  controllerPath: string;
  isWishlistPage?: boolean;
};

export default function WatchedCard({ movie, onRemove, controllerPath, isWishlistPage, onLikeChange }: Props) {
    const [busy, setBusy] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

    const remove = async () => {
        setBusy(true);
        try {
            const res = await fetch(`${backendUrl}/api/${controllerPath}/${movie.tmdbId}`, {
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
            const res = await fetch(`${backendUrl}/api/${controllerPath}/${movie.tmdbId}?liked=${liked}`, {
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
        <div className="relative group w-72 bg-pink-800 rounded-xl shadow-lg border border-gray-700 p-4 hover:scale-105 transition-transform">
            {/* REMOVE BUTTON */}
                    <div
            onClick={remove}
            className="absolute bg-white p-1 top-2 right-2 text-red border border-white hover:border-gray-300 rounded-[3px]"
            title="Remove from watched"
            >
            <FaTrash />
            </div>


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
                            {!isWishlistPage && (
            <>
                <div
                onClick={() => toggle(true)}
                className={`text-2xl ${movie.liked === true ? "text-green-400" : "text-gray-500"} hover:text-green-300`}
                >
                <FaThumbsUp />
                </div>
                <div
                onClick={() => toggle(false)}
                className={`text-2xl ${movie.liked === false ? "text-red-400" : "text-gray-500"} hover:text-red-300`}
                >
                <FaThumbsDown />
                </div>
            </>
            )}

            </div>
        </div>
    );
}
