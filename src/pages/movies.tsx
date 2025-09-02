import { Spinner } from "@/components/UI/Spinner";
import { Movies } from "@components/Movies";
import { toast } from "react-toastify";
import type { Movie } from "@/types/Movie";
import { useDebounce } from "@/utils/useDebounce";
import { useSearchMoviesQuery } from "@/store/services/moviesApi";
import { useState } from "react";

export const MoviesPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: movies = [],
    isLoading,
    error,
  } = useSearchMoviesQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  const patch = (updater: (draft: Movie[]) => void) => {
    // dispatch(moviesApi.util.updateQueryData("getMovies", undefined, updater));
  };

  const handleCreate = (newMovie: Movie): boolean => {
    const exists = movies.some(
      (m) => m.Title.trim().toLowerCase() === newMovie.Title.trim().toLowerCase()
    );
    if (exists) {
      toast.error("A movie with the same name already exists.");
      return false;
    }
    // patch((draft) => draft.unshift(newMovie));
    toast.success(`Added movie: ${newMovie.Title}`);
    return true;
  };

  const handleUpdate = (movie: Movie, originalTitle: string): boolean => {
    const newTitle = movie.Title.trim().toLowerCase();
    const original = originalTitle.trim().toLowerCase();
    const dup = movies.some(
      (m) =>
        m.Title.trim().toLowerCase() === newTitle &&
        m.Title.trim().toLowerCase() !== original
    );
    if (dup) {
      toast.error("A movie with the same name already exists.");
      return false;
    }
    patch((draft) => {
      const i = draft.findIndex(
        (m) => m.Title.trim().toLowerCase() === original
      );
      if (i !== -1) draft[i] = movie;
    });
    toast.success(`Updated: ${movie.Title}`);
    return true;
  };

  const handleToggleFavourite = (Title: string) => {
    patch((draft) => {
      const m = draft.find((x) => x.Title === Title);
      if (m) m.Favourite = !m.Favourite;
    });
    const m = movies.find((x) => x.Title === Title);
    if (m) {
      toast.success(
        `${m.Title} ${
          m.Favourite ? "removed from favourites" : "added to favourites"
        }`
      );
    }
  };

  const handleDelete = (Title: string) => {
    patch((draft) => {
      const i = draft.findIndex((m) => m.Title === Title);
      if (i !== -1) draft.splice(i, 1);
    });
    toast.success(`Deleted: ${Title}`);
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
    />
  );
};
