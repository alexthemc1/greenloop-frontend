import { createContext, useEffect, useState } from "react";
import authAPI from "../api/authAPI";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error("User load error", err);
      setUser(null);
    }
  };

  const login = async (credentials) => {
    const token = await authAPI.authenticate(credentials);

    if (token) {
      setIsAuthenticated(true);
      await loadUser();
    }

    return token;
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (isAuthenticated) loadUser();
  }, [isAuthenticated]);

  const isAdmin = user?.roles?.includes("ROLE_ADMIN") ?? false;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        login,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}