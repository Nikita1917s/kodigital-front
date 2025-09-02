import styles from "./ActionButton.module.scss";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ActionButton = ({ children, ...props }: ActionButtonProps) => {
  return (
    <button type="button" className={styles["actionButton"]} {...props}>
      {children}
    </button>
  );
};
