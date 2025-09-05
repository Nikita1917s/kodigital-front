import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types/Movie";
import styles from "./MovieDetails.module.scss";
import { MovieIcon } from "@/assets/img";
import { ActionButton } from "../UI/ActionButton";

export interface MovieProps {
  movie: Movie;
}

export const MovieDetails = ({ movie }: MovieProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles["wrapper"]}>
      <MovieIcon className={styles["movieIcon"]} />
      <h1 className={styles["title"]}>{movie.Title}</h1>
      <div key={movie.Title} className={styles["movieCard"]}>
        <p className={styles["movieField"]}>Year: {movie.Year}</p>
        <p className={styles["movieField"]}>Runtime: {movie.Runtime}</p>
        <p className={styles["movieField"]}>Genre: {movie.Genre}</p>
        <p className={styles["movieField"]}>Director: {movie.Director}</p>
      </div>
      <div className={styles["buttonWrapper"]}>
        <ActionButton onClick={() => navigate(-1)}>Back</ActionButton>
      </div>
    </div>
  );
};
