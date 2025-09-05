import styles from "./AuthBar.module.scss";
import { ActionButton } from "@components/UI/ActionButton";
import { useAuth } from "@/contexts/auth-context";
import { useLoginModal } from "@/contexts/LoginModalContext";

export const AuthBar = () => {
  const { username, logout } = useAuth();
  const { openLogin } = useLoginModal();

  return (
    <nav className={styles["authbar"]}>
      <div className={styles["authWrapper"]}>
        {username ? (
          <>
            <h2 className={styles["userName"]}>
              You’re logged in as: <span>{username}</span>
            </h2>
            <ActionButton onClick={logout}>Logout</ActionButton>
          </>
        ) : (
          <>
            <h2 className={styles["userName"]}>To save movies please login</h2>
            <ActionButton onClick={openLogin}>Login</ActionButton>
          </>
        )}
      </div>
    </nav>
  );
};
