import { useForm } from "react-hook-form";
import styles from "./EditMovieForm.module.scss";
import type { Movie } from "@/types/Movie";
import { ActionButton } from "@/components/UI/ActionButton";

interface EditMovieFormProps {
  defaultValues: Movie;
  onSubmit: (values: Movie) => void;
  onCancel: () => void;
}

export const EditMovieForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: EditMovieFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Movie>({
    defaultValues,
  });

  const validateYear = (value: string) => {
    const yearNum = Number(value);
    if (!/^\d{4}$/.test(value)) return "Use 4 digits, e.g. 1982";
    if (yearNum < 1888 || yearNum > 2100)
      return "Enter a realistic year (1888–2100)";
    return true;
  };

  return (
    <form
      className={styles["form"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles["row"]}>
        <label htmlFor="Title">Title</label>
        <input
          id="Title"
          {...register("Title", {
            required: "Title is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
        />
        {errors.Title && (
          <span className={styles["error"]}>{errors.Title.message}</span>
        )}
      </div>

      <div className={styles["row"]}>
        <label htmlFor="yeYearYearar">Year</label>
        <input
          id="Year"
          inputMode="numeric"
          {...register("Year", {
            required: "Year is required",
            validate: validateYear,
          })}
        />
        {errors.Year && (
          <span className={styles["error"]}>{errors.Year.message}</span>
        )}
      </div>

      <div className={styles["row"]}>
        <label htmlFor="Runtime">Runtime</label>
        <input
          id="Runtime"
          {...register("Runtime", {
            required: "Runtime is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
        />
        {errors.Runtime && (
          <span className={styles["error"]}>{errors.Runtime.message}</span>
        )}
      </div>

      <div className={styles["row"]}>
        <label htmlFor="Genre">Genre</label>
        <input
          id="Genre"
          {...register("Genre", {
            required: "Genre is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
        />
        {errors.Genre && (
          <span className={styles["error"]}>{errors.Genre.message}</span>
        )}
      </div>

      <div className={styles["row"]}>
        <label htmlFor="Director">Director</label>
        <input
          id="Director"
          {...register("Director", {
            required: "Director is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
        />
        {errors.Director && (
          <span className={styles["error"]}>{errors.Director.message}</span>
        )}
      </div>

      <div className={styles["actions"]}>
        <ActionButton type="button" onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" disabled={isSubmitting}>
          Update
        </ActionButton>
      </div>
    </form>
  );
};
