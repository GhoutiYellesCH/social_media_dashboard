import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as api from "./api-client";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

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
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
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
        // Fallback when edge function is unreachable: validate token directly with Supabase Auth
        supabase.auth.getUser(token).then(({ data }) => {
          if (data?.user?.id) {
            const u = {
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.name || "Utilisateur",
            };
            setUser(u);
            localStorage.setItem("socialdz_user", JSON.stringify(u));
            return;
          }
          api.logout();
          setUser(null);
        }).catch(() => {
          api.logout();
          setUser(null);
        });
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
      if (e?.status === 404 || e?.status === 0) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          return { success: false, error: error?.message || "Erreur de connexion" };
        }
        if (data.session?.access_token) {
          api.setAccessToken(data.session.access_token);
        }
        const u = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || "Utilisateur",
        };
        setUser(u);
        localStorage.setItem("socialdz_user", JSON.stringify(u));
        return { success: true };
      }
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
      if (e?.status === 404 || e?.status === 0) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) {
          return { success: false, error: error.message || "Erreur d'inscription" };
        }
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError || !loginData.user) {
          return { success: true };
        }
        if (loginData.session?.access_token) {
          api.setAccessToken(loginData.session.access_token);
        }
        const u = {
          id: loginData.user.id,
          email: loginData.user.email || email,
          name: loginData.user.user_metadata?.name || name,
        };
        setUser(u);
        localStorage.setItem("socialdz_user", JSON.stringify(u));
        return { success: true };
      }
      return { success: false, error: e.message || "Erreur d'inscription" };
    }
  };

  const resetPasswordFn = async (email: string) => {
    try {
      const data = await api.resetPassword(email);
      if (data.success) return { success: true };
      return { success: false, error: data.error || "Erreur lors de la réinitialisation" };
    } catch (e: any) {
      if (e?.status === 404 || e?.status === 0) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { success: false, error: error.message || "Erreur système" };
        return { success: true };
      }
      return { success: false, error: e.message || "Erreur système" };
    }
  };

  const updatePasswordFn = async (password: string) => {
    try {
        const data = await api.updatePassword(password);
        if (data.success) return { success: true };
        return { success: false, error: data.error || "Erreur lors de la mise à jour" };
    } catch (e: any) {
        if (e?.status === 404 || e?.status === 0) {
          const { error } = await supabase.auth.updateUser({ password });
          if (error) return { success: false, error: error.message || "Erreur système" };
          return { success: true };
        }
        return { success: false, error: e.message || "Erreur système" };
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
        resetPassword: resetPasswordFn,
        updatePassword: updatePasswordFn,
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
