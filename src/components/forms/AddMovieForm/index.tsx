import { useForm } from "react-hook-form";
import styles from "./AddMovieForm.module.scss";
import type { Movie } from "@/types/Movie";
import { ActionButton } from "@/components/UI/ActionButton";

interface AddMovieFormProps {
  defaultValues?: Partial<Movie>;
  onSubmit: (values: Movie) => void;
  onCancel: () => void;
}

export const AddMovieForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: AddMovieFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Movie>({
    defaultValues: {
      Title: "",
      Year: "",
      Runtime: "",
      Genre: "",
      Director: "",
      Favourite: false,
      ...defaultValues,
    },
  });

  const validateYear = (value: string) => {
    const yearNum = Number(value);
    if (!/^\d{4}$/.test(value)) return "Use 4 digits, e.g. 1982";
    if (yearNum < 1888 || yearNum > 2100) return "Enter a realistic year (1888–2100)";
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
          placeholder="Titanic"
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
        <label htmlFor="Year">Year</label>
        <input
          id="Year"
          placeholder="1982"
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
          placeholder="117 min"
          {...register("Runtime", {
            required: "Runtime is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
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
          placeholder="Action, Drama, Sci-Fi"
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
          placeholder="Ridley Scott"
          {...register("Director", {
            required: "Director is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
        />
        {errors.Director && (
          <span className={styles["error"]}>{errors.Director.message}</span>
        )}
      </div>

      <label className={styles["checkbox"]}>
        <input type="checkbox" {...register("Favourite")} />
        Favourite
      </label>

      <div className={styles["actions"]}>
        <ActionButton type="button" onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" disabled={isSubmitting}>
          Save
        </ActionButton>
      </div>
    </form>
  );
};
