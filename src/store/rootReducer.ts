import { combineReducers } from "@reduxjs/toolkit";
import { moviesApi } from "./services/moviesApi";

const rootReducer = combineReducers({
  [moviesApi.reducerPath]: moviesApi.reducer,
});

export default rootReducer;
