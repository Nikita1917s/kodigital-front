import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Movie } from "@/types/Movie";
import { BASE_URL } from "@/config";

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["UserMovies", "SearchSave", "AnonSearch", "Movie"],
  endpoints: (b) => ({
    // 1) Anonymous search (does NOT save to DB)
    searchAnon: b.query<Movie[], { q: string; page?: number }>({
      query: ({ q, page = 1 }) =>
        `search?q=${encodeURIComponent(q)}&page=${page}`,
      transformResponse: (resp: { movies: Movie[] }) => resp.movies ?? [],
      providesTags: (_res, _e, { q }) => [{ type: "AnonSearch", id: q }],
    }),

    // 2) Search & save for a user (saves to that user's DB, returns filtered list)
    searchAndSave: b.query<
      Movie[],
      { username: string; q: string; page?: number }
    >({
      query: ({ username, q, page = 1 }) =>
        `search/save?username=${encodeURIComponent(
          username
        )}&q=${encodeURIComponent(q)}&page=${page}`,
      transformResponse: (resp: { movies: Movie[] }) => resp.movies ?? [],
      providesTags: (_res, _e, { username, q }) => [
        { type: "SearchSave", id: `${username}:${q}` },
        { type: "UserMovies", id: username },
      ],
    }),

    // 3) Load all movies for a user (their DB view)
    getUserMovies: b.query<Movie[], { username: string }>({
      query: ({ username }) =>
        `my/movies?username=${encodeURIComponent(username)}`,
      transformResponse: (resp: { movies: Movie[] }) => resp.movies ?? [],
      providesTags: (_res, _e, { username }) => [
        { type: "UserMovies", id: username },
      ],
    }),

    // 4) Add a custom movie for a user
    addUserMovie: b.mutation<{ ok: true }, { username: string } & Movie>({
      query: (body) => ({ url: `my/movies`, method: "POST", body }),
      invalidatesTags: (_res, _e, { username }) => [
        { type: "UserMovies", id: username },
      ],
    }),

    // 5) Edit a user movie (by Title for that user)
    updateUserMovie: b.mutation<
      { ok: true },
      { username: string } & Partial<Movie> & { Title: string }
    >({
      query: (body) => ({ url: `my/movies`, method: "PATCH", body }),
      invalidatesTags: (_res, _e, { username }) => [
        { type: "UserMovies", id: username },
      ],
    }),

    // 6) Delete a user movie (by Title for that user)
    deleteUserMovie: b.mutation<
      { ok: true },
      { username: string; Title: string }
    >({
      query: ({ username, Title }) => ({
        url: `my/movies?username=${encodeURIComponent(
          username
        )}&Title=${encodeURIComponent(Title)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _e, { username }) => [
        { type: "UserMovies", id: username },
      ],
    }),

    // 7) Toggle Favourite for a user movie
    toggleFavourite: b.mutation<
      { ok: true },
      { username: string; Title: string; Favourite: boolean }
    >({
      query: (body) => ({ url: `my/movies/favourite`, method: "PATCH", body }),
      async onQueryStarted(
        { username, Title, Favourite },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update both user list and search+save cache
        const patches = [
          moviesApi.util.updateQueryData(
            "getUserMovies",
            { username },
            (draft) => {
              const m = draft.find((x) => x.Title === Title);
              if (m) m.Favourite = Favourite;
            }
          ),
        ];
        const undos = patches.map(
          (patch) => dispatch(patch) as { undo: () => void }
        );
        try {
          await queryFulfilled;
        } catch {
          undos.forEach((p) => p.undo());
        }
      },
      invalidatesTags: (_r, _e, { username }) => [
        { type: "UserMovies", id: username },
      ],
    }),

    // 8) Get one movie by title (DB-first if username provided, otherwise OMDb)
    getMovieByTitle: b.query<
      Movie | null,
      { title: string; username?: string }
    >({
      query: ({ title, username }) => {
        const qs = new URLSearchParams({ title });
        if (username) qs.set("username", username);
        return `movie?${qs.toString()}`;
      },
      // server returns: { source: "db" | "omdb", movie: {...} }
      transformResponse: (resp: { source: string; movie: Movie }) =>
        resp?.movie ?? null,
      providesTags: (_res, _err, { title, username }) => [
        { type: "Movie", id: username ? `${username}:${title}` : title },
      ],
    }),
  }),
});

export const {
  useSearchAnonQuery,
  useSearchAndSaveQuery,
  useGetUserMoviesQuery,
  useAddUserMovieMutation,
  useUpdateUserMovieMutation,
  useDeleteUserMovieMutation,
  useToggleFavouriteMutation,
  useGetMovieByTitleQuery,
} = moviesApi;
