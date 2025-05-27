// src/app/dashboard/page.tsx
import React from "react";
import { notFound } from "next/navigation";

const API_KEY = process.env.TMDB_API_KEY;

function truncateDescription(description: string, maxLength = 150) {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

async function fetchMoviesByPage(page: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

export default async function TopRated({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const data = await fetchMoviesByPage(currentPage);

  if (!data) return notFound();

  const movies = data.results;
  const totalPages = data.total_pages;

  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <div
            key={movie.id}
            className="w-72 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4"
          >
            <h3 className="text-1xl text-center text-white font-semibold mb-2">
              {movie.title}
            </h3>

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-md object-cover"
            />

            <p className="text-white">{truncateDescription(movie.overview)}</p>
            <div className="text-lg text-white font-semibold mb-2">
              <p>Avg rating: {movie.vote_average}</p>
            </div>
            <p className="text-gray-500">Release Year: {movie.release_date?.slice(0, 4)}</p>
            <p className="text-gray-500">Votes: {movie.vote_count}</p>

            <div className="flex justify-center items-center mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-3">
                Add to watch list
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Watched?
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
