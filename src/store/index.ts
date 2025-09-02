import { configureStore } from "@reduxjs/toolkit";
import { moviesApi } from "./services/moviesApi";
import rootReducer from "./rootReducer";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(moviesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
