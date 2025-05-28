import { useEffect, useState } from "react";

type Genre = { id: number; name: string };
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export function useGenreMap() {
  const [map, setMap] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const lookup: Record<number, string> = {};
        (data.genres as Genre[]).forEach(g => { lookup[g.id] = g.name });
        setMap(lookup);
      })
      .catch(console.error);
  }, []);

  return map;
}
