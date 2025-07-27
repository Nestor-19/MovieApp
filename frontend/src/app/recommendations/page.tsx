"use client";
import { useRecStore } from "@/hooks/useRecStore";
import MovieCard from "@/components/MovieComponents/MovieCard";

export default function RecommendationsPage() {
  const movies = useRecStore((s) => s.movies);

  if (!movies.length) return <div className="text-white">No recommendations yet.</div>;

    return (
        <div className="px-6 py-8">
          <h1 className="text-white text-5xl font-bold text-center mb-6">
            Your Recommendations!
          </h1>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} showActions={false} movie={movie} />
            ))}
          </div>
        </div>
    );
}