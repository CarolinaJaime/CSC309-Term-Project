import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
  const [utorid, setUtorid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState(""); // For demo 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utorid }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to request password reset");
      }

      const data = await res.json();
      setSuccess(true);
      
      // In real app, the token would be emailed to the user
      // For demo/testing, we display (remove in prod)
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your UTORid and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
              Password reset requested successfully! Check your email for the reset link.
            </div>
            
            {/* For demo: Show reset token (remove in prod) */}
            {resetToken && (
              <div className="text-sm bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
                <p className="font-medium text-yellow-800 mb-1">Demo Mode - Reset Token:</p>
                <p className="text-yellow-700 break-all font-mono text-xs">{resetToken}</p>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="inline-block mt-2 text-pink-600 hover:text-pink-700 font-medium"
                >
                  Click here to reset password →
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="block text-center text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Back to Login
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
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={utorid}
                onChange={(e) => setUtorid(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter your UTORid"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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