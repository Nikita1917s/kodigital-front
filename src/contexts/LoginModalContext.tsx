import { createContext, useContext } from "react";

export type LoginModalCtx = { openLogin: () => void };

export const LoginModalContext = createContext<LoginModalCtx | null>(null);

export function useLoginModal(): LoginModalCtx {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error("useLoginModal must be used within LoginModalProvider");
  return ctx;
}
