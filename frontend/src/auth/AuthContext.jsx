import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token); // if we have a token, we'll try to fetch user

  // Fetch current user info when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function fetchMe() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data); // expects { id, utorid, role, ... }
      } catch (err) {
        console.error("Error fetching /users/me:", err);
        // token might be invalid/expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("authTokenExpiresAt");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [token]);

  function login({ token, expiresAt }) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTokenExpiresAt", expiresAt);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiresAt");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
