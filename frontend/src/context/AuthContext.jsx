import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

const getUser = (token) => {
  if (!token) return null;

  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;

    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));

    if (!payload.sub || !payload.role || !payload.exp || payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return { email: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const restoredUser = getUser(token);

    if (token && !restoredUser) localStorage.removeItem("token");
    return restoredUser;
  });

  useEffect(() => {
    const clearUser = () => setUser(null);
    window.addEventListener("auth:unauthorized", clearUser);

    return () => {
      window.removeEventListener("auth:unauthorized", clearUser);
    };
  }, []);

  const authenticator = async (path, data) => {
    const response = await axiosClient.post(path, data);
    const token = response.data?.jwt;
    const authenticatedUser = getUser(token);

    if (!token || !authenticatedUser) {
      throw new Error("The server returned an invalid authentication token.");
    }

    localStorage.setItem("token", token);
    setUser(authenticatedUser);
  };

  const login = (credentials) => authenticator("/auth/login", credentials);
  const register = (data) => authenticator("/auth/register", data);
  const logout = async () => {
    try {
      if (localStorage.getItem("token")) {
        await axiosClient.post("/user/logout");
      }
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);