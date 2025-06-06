"use client";
import React, { useEffect, useState } from "react";
import WatchedCard, {WatchedMovie} from "@/components/MovieComponents/WatchedCard";

export default function WatchedListPage() {
  const [movies, setMovies] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

  useEffect(() => {
    fetch(`${backendUrl}/api/wishlist`, { credentials: "include" })
      .then(res => {
        console.log(res)
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<WatchedMovie[]>;
      })
      .then(data => setMovies(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  const handleRemove = (id: string) => {
    setMovies(prev => prev.filter(m => m.tmdbId !== id));
  };

  const handleLikeChange = (id: string, liked: boolean) => {
    setMovies(prev =>
      prev.map(m => (m.tmdbId === id ? { ...m, liked } : m))
    );
  };


  if (loading) return <p className="text-center">Loading…</p>;
  if (error)   return <p className="text-center text-red-500">{error}</p>;

  if (movies.length === 0) {
    return <p className="text-center text-white">Your watched list is empty.</p>;
  }

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl text-white mb-6 pl-5">Your Wish List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <WatchedCard
          controllerPath={"wishlist"}
            key={movie.tmdbId}
            movie={movie}
            onRemove={handleRemove}
            onLikeChange={handleLikeChange}
            isWishlistPage={true}
          />
        ))}
      </div>
    </div>
  );
}