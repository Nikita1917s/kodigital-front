import type { ReactNode } from "react";
import styles from "./ModalWindow.module.scss";
import Modal from "@mui/material/Modal";

interface ModalWindowProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const ModalWindow = ({ open, onClose, children }: ModalWindowProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles["modalContent"]}>{children}</div>
    </Modal>
  );
};
