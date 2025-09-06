import { configureStore } from "@reduxjs/toolkit";
import { moviesApi } from "@/store/services/moviesApi";

export const makeTestStore = () =>
  configureStore({
    reducer: {
      [moviesApi.reducerPath]: moviesApi.reducer,
    },
    middleware: (gDM) => gDM().concat(moviesApi.middleware),
  });

export type TestStore = ReturnType<typeof makeTestStore>;
