
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/me")
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const r = await api.post("/login", { email, password });
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const register = async (pseudo, email, password) => {
    const r = await api.post("/register", { pseudo, email, password });
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };

  const logout = async () => {
    await api.post("/logout").catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
