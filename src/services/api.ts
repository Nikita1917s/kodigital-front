import type { Movie } from "@/types/Movie";
import { JSON_URL } from "@services/contants";

const MOVIES_URL =
  "https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json";

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const res = await fetch(MOVIES_URL);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch movies: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return Array.isArray(data.movies) ? data.movies : [];
  } catch (err) {
    console.error("fetchMovies error:", err);
    throw err;
  }
};
export const fetchUserByTitle = async (id: number): Promise<Movie> => {
  const res = await fetch(`${JSON_URL}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
};
