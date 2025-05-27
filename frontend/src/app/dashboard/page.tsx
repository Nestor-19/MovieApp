// src/app/dashboard/page.tsx
import React from "react";

const API_KEY = process.env.TMDB_API_KEY;

function truncateDescription(description:String, maxLength = 150) {
  if (!description) return ""; // handle empty or undefined
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

async function fetchTopMovies() {
  const totalPages = 5;
  let movies = [];

  for (let page = 1; page <= totalPages; page++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 60 } } // optional ISR, revalidate every 60 seconds
    );
    const data = await res.json();
    console.log(data)
    movies = movies.concat(data.results);
  }

  return movies;
}

export default async function Top100() {
  const movies = await fetchTopMovies();

  return (
    <div>
   <div className="grid grid-cols-4 gap-6">
  {movies.map((movie) => (
   <div
  key={movie.id}
  className="w-72 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4"
>
<h3 className="text-1xl text-center text-white font-semibold mb-2">{movie.title}</h3>

  <img
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    alt={movie.title}
    className="w-full h-auto rounded-md object-cover"/>
         
<p>Description: {truncateDescription(movie.overview)}</p>
 <div className="text-lg text-white font-semibold mb-2">
        <p>Avg rating: {movie.vote_average}</p>
       </div>
      <p className="text-gray-500">Release Year: {movie.release_date?.slice(0, 4)}</p>
        <p className="text-gray-500">Votes: {movie.vote_count}</p>
    </div>
  ))}
</div>

      
    </div>
  );
}
