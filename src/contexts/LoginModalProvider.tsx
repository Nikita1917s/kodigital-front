import { useState, type ReactNode } from "react";
import { ModalWindow } from "@/components/UI/ModalWindow";
import { CreateUserForm } from "@/components/forms/CreateUserForm";

import { useAuth } from "@/contexts/auth-context";
import { LoginModalContext } from "./LoginModalContext";

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openLogin = () => setOpen(true);
  return (
    <LoginModalContext.Provider value={{ openLogin }}>
      {children}
      <AuthLoginModal open={open} onClose={() => setOpen(false)} />
    </LoginModalContext.Provider>
  );
}

function AuthLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { login } = useAuth();

  return (
    <ModalWindow open={open} onClose={onClose}>
      <div>
        <h2>Log in to save movies</h2>
        <CreateUserForm
          defaultValues={{ username: "" }}
          onSubmit={({ username }) => {
            login(username);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </ModalWindow>
  );
}
