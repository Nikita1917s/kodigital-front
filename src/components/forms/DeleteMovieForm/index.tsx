import styles from "./DeleteMovieForm.module.scss";
import { ActionButton } from "@/components/UI/ActionButton";

interface DeleteMovieFormProps {
  Title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteMovieForm = ({
  Title,
  onCancel,
  onConfirm,
}: DeleteMovieFormProps) => {
  return (
    <form
      className={styles["form"]}
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm();
      }}
    >
      <p>
        Are you sure you want to delete “<strong>{Title}</strong>”?
      </p>
      <div className={styles["actions"]}>
        <ActionButton type="button" onClick={onCancel}>
          Cancel
        </ActionButton>
        <ActionButton type="submit">Delete</ActionButton>
      </div>
    </form>
  );
};
