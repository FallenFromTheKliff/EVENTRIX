import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

const getUser = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/_/g, "/")));
    if (payload.exp * 1000 < Date.now()) return;
    return { email: payload.sub, role: payload.role };
  } catch {
    return;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser(localStorage.getItem("token")));
  const authenticator = async (path, data) => {
    const response = await axiosClient.post(path, data);
    localStorage.setItem("token", response.data.jwt);
    setUser(getUser(response.data.jwt));
  };
  const login = (credentials) => authenticator("/auth/login", credentials);
  const register = (data) => authenticator("/auth/register", data);
  const logout = async () => {
    await axiosClient.post("/user/logout").catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <AuthContext value={{ user, login, register, logout }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = () => useContext(AuthContext);