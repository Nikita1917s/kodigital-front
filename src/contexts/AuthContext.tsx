import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/auth-context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const login = (u: string) => {
    const v = u.trim();
    localStorage.setItem("username", v);
    setUsername(v);
  };

  const logout = () => {
    localStorage.removeItem("username");
    setUsername("");
  };

  useEffect(() => {
    const sync = () => setUsername(localStorage.getItem("username") || "");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
