import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, roles: [] }
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend "who am I" using the session cookie.
  // This keeps the user logged in across page refreshes.
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await client.get("/api/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    await client.post("/api/auth/login", { username, password });
    await checkSession();
  }

  async function register(name, username, email, password) {
    await client.post("/api/auth/register", { name, username, email, password });
  }

  async function logout() {
    await client.post("/api/auth/logout");
    setUser(null);
  }

  const isAdmin = user?.roles?.some((r) => r.includes("ADMIN")) ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
