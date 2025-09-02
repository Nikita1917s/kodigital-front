import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "@/types/Movie";

interface MoviesState {
  list: Movie[];
}

const initialState: MoviesState = {
  list: [],
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addMovie(state, action: PayloadAction<Movie>) {
      state.list.unshift(action.payload);
    },
    updateMovie(state, action: PayloadAction<Movie>) {
      const idx = state.list.findIndex(
        (m) => m.Title.toLowerCase() === action.payload.Title.toLowerCase()
      );
      if (idx !== -1) {
        state.list[idx] = action.payload;
      }
    },
    deleteMovie(state, action: PayloadAction<string>) {
      state.list = state.list.filter(
        (m) => m.Title.toLowerCase() !== action.payload.toLowerCase()
      );
    },
    toggleFavourite(state, action: PayloadAction<string>) {
      const movie = state.list.find(
        (m) => m.Title.toLowerCase() === action.payload.toLowerCase()
      );
      if (movie) {
        movie.Favourite = !movie.Favourite;
      }
    },
    setMovies(state, action: PayloadAction<Movie[]>) {
      state.list = action.payload;
    },
  },
});

export const {
  addMovie,
  updateMovie,
  deleteMovie,
  toggleFavourite,
  setMovies,
} = moviesSlice.actions;
export default moviesSlice.reducer;
