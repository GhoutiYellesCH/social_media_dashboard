import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as api from "./api-client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const token = api.getAccessToken();
    const storedUser = localStorage.getItem("socialdz_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // invalid stored data
      }
      // Verify token is still valid
      api.getMe().then((data) => {
        if (data.user) {
          const u = { id: data.user.id, email: data.user.email, name: data.user.name || "Utilisateur" };
          setUser(u);
          localStorage.setItem("socialdz_user", JSON.stringify(u));
        }
      }).catch(() => {
        // Token expired
        api.logout();
        setUser(null);
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginFn = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      if (data.success && data.user) {
        const u = { id: data.user.id, email: data.user.email, name: data.user.name };
        setUser(u);
        localStorage.setItem("socialdz_user", JSON.stringify(u));
        return { success: true };
      }
      return { success: false, error: data.error || "Erreur de connexion" };
    } catch (e: any) {
      return { success: false, error: e.message || "Erreur de connexion" };
    }
  };

  const signupFn = async (email: string, password: string, name: string) => {
    try {
      const data = await api.signup(email, password, name);
      if (data.success && data.user) {
        const u = { id: data.user.id, email: data.user.email, name: data.user.name || name };
        setUser(u);
        localStorage.setItem("socialdz_user", JSON.stringify(u));
        return { success: true };
      }
      return { success: false, error: data.error || "Erreur d'inscription" };
    } catch (e: any) {
      return { success: false, error: e.message || "Erreur d'inscription" };
    }
  };

  const logoutFn = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: loginFn,
        signup: signupFn,
        logout: logoutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
