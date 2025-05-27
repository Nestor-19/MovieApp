// src/app/dashboard/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import MovieCard from "@/components/MovieComponents/MovieCard";

const API_KEY = process.env.TMDB_API_KEY;

async function fetchMoviesByPage(page: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  console.log(data)
  return data;
}

export default async function TopRated({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const data = await fetchMoviesByPage(currentPage);

  if (!data) return notFound();

  const movies = data.results;
  const totalPages = data.total_pages;

  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
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
