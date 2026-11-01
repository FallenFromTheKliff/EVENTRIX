import { createContext, useContext, useState, useEffect, Fragment } from "react";
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

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const clearUser = () => setUser(null);
    window.addEventListener("auth:unauthorized", clearUser);

    return () => {
      window.removeEventListener("auth:unauthorized", clearUser);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let active = true;
    axiosClient.get("/user/profile").then((response) => {
      if (active) setProfile(response.data);
    });

    return () => {
      active = false;
      setProfile(null);
    };
  }, [user]);

  const authenticator = async (path, data) => {
    const response = await axiosClient.post(path, data);
    const token = response.data?.jwt;
    const authenticatedUser = getUser(token);

    if (!token || !authenticatedUser) {
      throw new Error("The server returned an invalid authentication token.");
    }

    localStorage.setItem("token", token);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const updateProfile = async (data) => {
    setProfile((await axiosClient.put("/user/profile", data)).data);
  };
  const getStats = async () => (await axiosClient.get("/user/stats")).data;

  const login = (credentials) => authenticator("/auth/login", credentials);
  const register = async (data) => {
    await axiosClient.post("/auth/register", data);
  };
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
    <AuthContext.Provider value={{ user, profile, getStats, updateProfile, login, register, logout }}>
      <Fragment key={user?.email ?? ""}>{children}</Fragment>
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);