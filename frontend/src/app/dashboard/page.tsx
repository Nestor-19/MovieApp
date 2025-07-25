import React from "react";
import { notFound } from "next/navigation";
import MovieCard from "@/components/MovieComponents/MovieCard";

const BACKEND_BASE = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

// How many movies per page (tune this: 20, 32, 40, etc.)
const PAGE_SIZE = 20;

interface MovieListDto {
  tmdbId: number;
  title: string;
  image: string;
  rating: number;
  runTime: number;
  releaseYear: number | null;
  genres: string[];
  description: string
}

/**
 * Fetch ALL movies once from Spring.
 */
async function fetchAllMovies(): Promise<MovieListDto[]> {
  const res = await fetch(`${BACKEND_BASE}/api/movies/all`, {
    // Revalidate every 5 minutes (adjust or remove for always-fresh)
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error("Failed to fetch movies:", res.status);
    return [];
  }
  return res.json();
}

/**
 * Convert MovieListDto to the "TMDB-like" object MovieCard was built for.
 * Adjust field names here if MovieCard expects something different.
 */
function adaptToMovieCard(dto: MovieListDto) {
  return {
    id: dto.tmdbId,
    title: dto.title,
    image: dto.image,
    description: dto.description || "",
    vote_average: dto.rating,
    genres: dto.genres,
    release_year: dto.releaseYear,
    runtime: dto.runTime,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  const allMovies = await fetchAllMovies();
  if (!allMovies.length) {
    return notFound();
  }

  const total = allMovies.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  if (currentPage > totalPages) {
    return notFound();
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageSlice = allMovies.slice(start, start + PAGE_SIZE);

  // Adapt each to what MovieCard expects
  const moviesForCard = pageSlice.map(adaptToMovieCard);

  return (
    <div className="px-6 py-8">
      <h1 className="text-white text-5xl font-bold text-center mb-6">
        The Best Films Currently On Screen
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {moviesForCard.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-10 space-x-4">
        {currentPage > 1 && (
          <a
            href={`/dashboard?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Previous
          </a>
        )}
        {currentPage < totalPages && (
          <a
            href={`/dashboard?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}

