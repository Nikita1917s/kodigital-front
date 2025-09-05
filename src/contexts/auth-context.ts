import { createContext, useContext } from "react";

export type AuthCtx = {
  username: string;
  login: (u: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
