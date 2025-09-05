import { useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "@/components/UI/Spinner";
import { Movies } from "@/components/Movies";
import type { Movie } from "@/types/Movie";
import { useDebounce } from "@/utils/useDebounce";
import {
  useSearchAnonQuery,
  useSearchAndSaveQuery,
  useGetUserMoviesQuery,
  useAddUserMovieMutation,
  useUpdateUserMovieMutation,
  useDeleteUserMovieMutation,
  useToggleFavouriteMutation,
} from "@/store/services/moviesApi";
import { useAuth } from "@/contexts/auth-context";

export const MoviesPage = () => {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);
  const { username } = useAuth();

  const anonSearch = useSearchAnonQuery(
    { q: debounced, page: 1 },
    { skip: !debounced || !!username }
  );

  const userList = useGetUserMoviesQuery(
    { username },
    { skip: !username || !!debounced }
  );

  const userSearchSave = useSearchAndSaveQuery(
    { username, q: debounced, page: 1 },
    { skip: !username || !debounced }
  );

  const movies: Movie[] = username
    ? debounced
      ? userSearchSave.data ?? []
      : userList.data ?? []
    : anonSearch.data ?? [];

  const isLoading =
    anonSearch.isLoading || userList.isLoading || userSearchSave.isLoading;
  const error = anonSearch.error || userList.error || userSearchSave.error;

  const requireLogin = () => {
    toast.info("Please log in to perform this action.");
  };

  const [addMovie] = useAddUserMovieMutation();
  const [updateMovie] = useUpdateUserMovieMutation();
  const [deleteMovie] = useDeleteUserMovieMutation();
  const [toggleFav] = useToggleFavouriteMutation();

  const handleCreate = async (newMovie: Movie) => {
    if (!username) {
      toast.error("Enter username to add movies.");
      return false;
    }
    const exists = movies.some(
      (m) =>
        m.Title.trim().toLowerCase() === newMovie.Title.trim().toLowerCase()
    );
    if (exists) {
      toast.error("A movie with the same name already exists.");
      return false;
    }
    try {
      await addMovie({ username, ...newMovie }).unwrap();
      toast.success(`Added: ${newMovie.Title}`);
      return true;
    } catch {
      toast.error("Failed to add movie");
      return false;
    }
  };

  const handleUpdate = async (movie: Movie, originalTitle: string) => {
    if (!username) return false;
    const newTitle = movie.Title.trim().toLowerCase();
    const orig = originalTitle.trim().toLowerCase();
    const dup = movies.some(
      (m) => m.Title.trim().toLowerCase() === newTitle && newTitle !== orig
    );
    if (dup) {
      toast.error("A movie with the same name already exists.");
      return false;
    }
    try {
      await updateMovie({ username, ...movie }).unwrap();
      toast.success(`Updated: ${movie.Title}`);
      return true;
    } catch {
      toast.error("Failed to update");
      return false;
    }
  };

  const handleToggleFavourite = async (Title: string) => {
    if (!username) return toast.error("Enter username to save favourites.");
    const current = movies.find((m) => m.Title === Title);
    const next = !current?.Favourite;
    try {
      await toggleFav({ username, Title, Favourite: next }).unwrap();
      toast.success(
        `${Title} ${next ? "added to" : "removed from"} favourites`
      );
    } catch {
      toast.error("Failed to toggle favourite");
    }
  };

  const handleDelete = async (Title: string) => {
    if (!username) return toast.error("Enter username to delete.");
    try {
      await deleteMovie({ username, Title }).unwrap();
      toast.success(`Deleted: ${Title}`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <h2>Failed to load movies.</h2>;

  return (
    <Movies
      movies={movies}
      search={search}
      setSearch={setSearch}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleFavourite={handleToggleFavourite}
      onDelete={handleDelete}
      isLoggedIn={!!username}
      requireLogin={requireLogin}
    />
  );
};
