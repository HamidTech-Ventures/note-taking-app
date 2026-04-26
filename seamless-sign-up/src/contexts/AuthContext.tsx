import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might fetch the user profile here using the token
    if (token) {
      // Mock user for now, or fetch from API
      setUser({ email: "user@example.com", name: "User" });
    }
    setLoading(false);
  }, [token]);

  const login = async (data: any) => {
    const response = await authApi.login(data);
    const newToken = response.access_token;
    sessionStorage.setItem("auth_token", newToken);
    setToken(newToken);
    // Ideally fetch user details here
  };

  const signup = async (data: any) => {
    await authApi.signup(data);
    // After signup, we might auto-login or redirect to login
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
