// External imports
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Component imports
import { Modal } from "./Modal";

// Function imports
import { useAuth } from "../context/AuthContext";
import { adminService, type AdminStats, type User } from "../api/adminService";

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_households: 0,
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [menuState, setMenuState] = useState<{
    id: number;
    top: number;
    right: number;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });
  const [newPasswordInput, setNewPasswordInput] = useState("");

  useEffect(() => {
    const closeMenu = () => setMenuState(null);
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { users, stats } = await adminService.getDashboardData();
        setUsers(users);
        setStats(stats);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error("Failed to load dashboard data");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const toggleMenu = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();

    if (menuState?.id === user.id) {
      setMenuState(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setMenuState({
      id: user.id,
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await adminService.updateRole(user.id, newRole);
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
      toast.success(`${user.username} is now an ${newRole}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to update role");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal.user || !newPasswordInput) return;

    try {
      await adminService.resetPassword(passwordModal.user.id, newPasswordInput);
      toast.success(`Password updated for ${passwordModal.user.username}`);
      setPasswordModal({ isOpen: false, user: null });
      setNewPasswordInput("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail || "Failed to reset password");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;

    try {
      await adminService.deleteUser(deleteModal.user.id);
      setUsers(users.filter((u) => u.id !== deleteModal.user?.id));
      toast.success(`User deleted successfully`);
      setDeleteModal({ isOpen: false, user: null });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Failed to delete user");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-xl md:text-3xl font-bold">Admin Control Panel</h1>
        <Link
          to="/"
          className="text-sm md:text-xl bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Total Users
          </p>
          <p className="text-4xl font-bold text-blue-600">
            {stats.total_users}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Total Households
          </p>
          <p className="text-4xl font-bold text-blue-600">
            {stats.total_households}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-100">
        <table className="w-full text-left min-w-200">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                Username
              </th>
              <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                Email
              </th>
              <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                Role
              </th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                  {user.super ? (
                    <span className="text-sm font-bold text-gray-400 cursor-not-allowed">
                      Super Admin
                    </span>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => toggleMenu(e, user)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                        aria-label="Options"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {menuState?.id === user.id && (
                        <div
                          className="fixed w-48 bg-white rounded-xl shadow-xl z-50 border border-gray-200 py-2 overflow-hidden flex flex-col items-start"
                          style={{ top: menuState.top, right: menuState.right }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                toggleRole(user);
                                setMenuState(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors"
                            >
                              Change to{" "}
                              {user.role === "admin" ? "User" : "Admin"}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setPasswordModal({ isOpen: true, user });
                              setMenuState(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-50 transition-colors"
                          >
                            Reset Password
                          </button>

                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                setDeleteModal({ isOpen: true, user });
                                setMenuState(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-gray-50 transition-colors"
                            >
                              Delete User
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={passwordModal.isOpen}
        onClose={() => setPasswordModal({ isOpen: false, user: null })}
        title={`Reset Password for ${passwordModal.user?.username}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="text"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter new password..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setPasswordModal({ isOpen: false, user: null })}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Save Password
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete{" "}
            <strong>{deleteModal.user?.username}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
