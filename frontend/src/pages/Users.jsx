import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Users() {
  const { user, token, currentView } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use currentView if available, otherwise fall back to user.role
  const activeView = currentView || user?.role;

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    verified: "",
    activated: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, filters, token]);

  const fetchUsers = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (filters.name) params.append("name", filters.name);
      if (filters.role) params.append("role", filters.role);
      if (filters.verified) params.append("verified", filters.verified);
      if (filters.activated) params.append("activated", filters.activated);

      const res = await fetch(`${API_BASE_URL}/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      role: "",
      verified: "",
      activated: "",
    });
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  // Check permission based on activeView
  const isManager = activeView === "manager" || activeView === "superuser";

  if (!isManager) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          You don't have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <span className="text-gray-500">{totalCount} total users</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name / UTORid
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Search..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Roles</option>
              <option value="regular">Regular</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="superuser">Superuser</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verified
            </label>
            <select
              value={filters.verified}
              onChange={(e) => handleFilterChange("verified", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activated
            </label>
            <select
              value={filters.activated}
              onChange={(e) => handleFilterChange("activated", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All</option>
              <option value="true">Activated</option>
              <option value="false">Not Activated</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{u.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{u.utorid}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === "superuser"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "manager"
                          ? "bg-blue-100 text-blue-700"
                          : u.role === "cashier"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-pink-600">{u.points || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          u.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.verified ? "Verified" : "Not Verified"}
                      </span>
                      {u.suspicious && (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                          Suspicious
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/users/${u.id}`}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      View / Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}