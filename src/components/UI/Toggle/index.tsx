import { StarIcon } from "@components/UI/Icons";
import styles from "./Toggle.module.scss";

interface ToggleProps {
  text: string;
  toggleState: boolean;
  changeToggleState: (state: boolean) => void;
}

export const Toggle = ({
  text,
  toggleState,
  changeToggleState,
}: ToggleProps) => {
  return (
    <>
      <label className={styles["switch"]}>
        <input
          type="checkbox"
          name="checkbox"
          checked={toggleState}
          onChange={(e) => changeToggleState(e.target.checked)}
        />
        <span className={styles["slider"]}>
          <span className={styles["knob"]}>
            <StarIcon />
          </span>
          <span className={styles["text"]}>{text}</span>
        </span>
      </label>
    </>
  );
};
