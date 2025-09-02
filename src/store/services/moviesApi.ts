import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Movie } from "@/types/Movie";

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api/" }),
  endpoints: (builder) => ({
    searchMovies: builder.query<Movie[], string>({
      query: (q) => `search?q=${encodeURIComponent(q)}`,
      transformResponse: (resp: { Search?: Movie[] }) => resp?.Search ?? [],
    }),
  }),
});

export const { useSearchMoviesQuery } = moviesApi;
