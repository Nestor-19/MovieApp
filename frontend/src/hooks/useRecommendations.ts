import { useState } from "react";
import { MovieCardType } from "@/types/MovieCardType";

export interface GenRequest {
  user_id: string;
  mood: string;
  genres: string[];
  actors: string[];
  max_runtime: number;
}

export interface GenResult {
  movies: MovieCardType[];
}

export function useRecommendations() {
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<null | string>(null);
  const [data,    setData]      = useState<GenResult | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

  const fetchRecs = async (req: GenRequest) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/recommendations`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(req),
        credentials: "include",
      });

      if (!res.ok) {
        const raw = await res.text();
        let msg = raw;
        try {
          const js = JSON.parse(raw);
          msg = js.detail ?? js.message ?? raw;
        } catch {/* ignore parse error */ }
        throw new Error(msg);
      }

      const json = (await res.json()) as GenResult;
      setData(json);
      return json;
    } catch (e: any) {
      setError(e.message || "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { fetchRecs, data, loading, error };
}
