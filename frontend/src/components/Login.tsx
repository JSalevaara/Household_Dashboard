// External imports
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

// Internal imports
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Removed the manual message state entirely!
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/login", formData);
      const token = response.data.access_token;

      localStorage.setItem("token", token);
      await checkAuth();

      toast.success("Login successful! Welcome back."); // <-- Using toast!
      setFormData({ username: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Invalid username or password");
      } else {
        toast.error("An error occurred. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none 
                       opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-400"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>

          <div className="text-center pt-2">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors hover:underline"
            >
              Create one here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
