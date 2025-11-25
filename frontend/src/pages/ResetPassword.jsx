import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    utorid: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resets/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utorid: formData.utorid,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your UTORid and new password.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
              Password reset successfully! Redirecting to login...
            </div>
            <Link
              to="/login"
              className="block text-center text-pink-600 hover:text-pink-700 font-medium"
            >
              Go to Login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1" htmlFor="utorid">
                UTORid
              </label>
              <input
                id="utorid"
                type="text"
                name="utorid"
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.utorid}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Enter your UTORid"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1" htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              to="/login"
              className="text-center text-sm text-gray-600 hover:text-pink-600"
            >
              ← Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}