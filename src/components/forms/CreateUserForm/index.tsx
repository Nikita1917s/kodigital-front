import { useForm } from "react-hook-form";
import styles from "./CreateUserForm.module.scss";
import { ActionButton } from "@/components/UI/ActionButton";

export interface CreateUserFormValues {
  username: string;
}

interface CreateUserFormProps {
  defaultValues?: Partial<CreateUserFormValues>;
  onSubmit: (values: CreateUserFormValues) => void;
  onCancel: () => void;
}

export const CreateUserForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: CreateUserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    defaultValues: { username: "", ...defaultValues },
  });

  return (
    <form className={styles["form"]} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles["row"]}>
        <label htmlFor="username">User name</label>
        <input
          id="username"
          autoFocus
          placeholder="e.g. sarah_w"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            pattern: {
              value: /^[A-Za-z0-9_]+$/,
              message: "Only letters, numbers, and underscores",
            },
            setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
          })}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <span id="username-error" className={styles["error"]}>
            {errors.username.message}
          </span>
        )}
      </div>

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
