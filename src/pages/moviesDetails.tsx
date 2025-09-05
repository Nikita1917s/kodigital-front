import { useParams } from "react-router-dom";
import { MovieDetails } from "@components/MovieDetails";
import { Spinner } from "@/components/UI/Spinner";
import { useGetMovieByTitleQuery } from "@/store/services/moviesApi";
import { useAuth } from "@/contexts/auth-context";

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { username } = useAuth();
  const title = id ?? "";

  const {
    data: movie,
    isLoading,
    isFetching,
    error,
  } = useGetMovieByTitleQuery({ title, username }, { skip: !title });

  if (!title) return <div role="alert">No title provided.</div>;
  if (isLoading || isFetching) return <Spinner />;

  if (error || !movie) {
    return (
      <div role="alert">
        Movie not found: <strong>{title}</strong>
      </div>
    );
  }
  return <MovieDetails movie={movie} />;
};
