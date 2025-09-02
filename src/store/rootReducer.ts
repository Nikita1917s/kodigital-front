import { combineReducers } from "@reduxjs/toolkit";
import moviesSlice from "./slices/moviesSlice";
import { moviesApi } from "./services/moviesApi";

const rootReducer = combineReducers({
  movies: moviesSlice,
  [moviesApi.reducerPath]: moviesApi.reducer,
});

export default rootReducer;
