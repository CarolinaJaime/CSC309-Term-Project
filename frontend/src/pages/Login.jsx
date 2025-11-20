// src/pages/Login.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [utorid, setUtorid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // if a ProtectedRoute redirected them, it might have set state.from
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utorid, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to log in");
      }

      const data = await res.json();
      // data = { token: "...", expiresAt: "2025-03-10T01:41:47.000Z" }

      // ✅ update global auth state (and localStorage) via context
      login({ token: data.token, expiresAt: data.expiresAt });

      // ✅ go back to the page they tried to access, or home by default
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid UTORid or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900">
          Login
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Sign in with your UTORid to access the app.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="utorid">
              UTORid
            </label>
            <input
              id="utorid"
              type="text"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={utorid}
              onChange={(e) => setUtorid(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Optional footer */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span>Need access? Contact an administrator.</span>
          <br />
          <Link to="/" className="text-pink-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
