import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const { user, token } = useAuth();
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    avatar: "",
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
        avatar: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setLoading(true);

    try {
      // Build payload with only changed fields
      const payload = {};
      if (formData.name && formData.name !== user.name) {
        payload.name = formData.name;
      }
      if (formData.email && formData.email !== user.email) {
        payload.email = formData.email;
      }
      if (formData.birthday) {
        payload.birthday = formData.birthday;
      }
      if (formData.avatar !== (user.avatarUrl || "")) {
        payload.avatarUrl = formData.avatar;
      }

      if (Object.keys(payload).length === 0) {
        setProfileError("No changes to save");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setProfileSuccess("Profile updated successfully!");
      
      // Refresh page to get updated user data
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords match
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Validate password length
    if (passwordData.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old: passwordData.old,
          new: passwordData.new,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ old: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {/* Account Info (Read-only) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">UTORid</p>
            <p className="font-medium text-gray-900">{user.utorid}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-900 capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Points Balance</p>
            <p className="font-medium text-pink-600">{user.points || 0} points</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verified</p>
            <p className={`font-medium ${user.verified ? "text-green-600" : "text-yellow-600"}`}>
              {user.verified ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h2>

        {profileError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {profileError}
          </div>
        )}

        {profileSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
            {profileSuccess}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleProfileChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>

        {passwordError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="old"
              value={passwordData.old}
              onChange={handlePasswordChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="new"
              value={passwordData.new}
              onChange={handlePasswordChange}
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 transition"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}