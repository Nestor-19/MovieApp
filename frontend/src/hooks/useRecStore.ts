// hooks/useRecStore.ts
import { create } from "zustand";
import { MovieCardType } from "@/types/MovieCardType";

interface RecState {
  movies: MovieCardType[];
  setMovies: (m: MovieCardType[]) => void;
}
export const useRecStore = create<RecState>((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies })
}));