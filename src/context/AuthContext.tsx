import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types";
import { findUser, changePassword as cp } from "../lib/usersStore";

interface AuthContextType {
  user: Usuario | null;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return false;
    const u = JSON.parse(saved);
    return !!u.mustChangePassword;
  });

  const login = async (email: string, password: string) => {
    const found = findUser(email, password);
    if (found) {
      const u: Usuario = { id: found.id, nombre: found.nombre, email: found.email, rol: found.rol, mustChangePassword: !!found.mustChangePassword };
      setUser(u);
      setMustChangePassword(!!found.mustChangePassword);
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("token", "mock-token-" + found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setMustChangePassword(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!user) return false;
    const ok = cp(user.email, oldPassword, newPassword);
    if (ok) {
      const u = { ...user, mustChangePassword: false };
      setUser(u);
      setMustChangePassword(false);
      localStorage.setItem("user", JSON.stringify(u));
    }
    return ok;
  };

  return (
    <AuthContext.Provider value={{ user, mustChangePassword, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}