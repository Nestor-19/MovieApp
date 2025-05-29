export interface MovieDetails {
  runtime: number;
  // … can add other fields here
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as MovieDetails;
  return data;
}

