// External imports
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Function imports
import { userService } from "../api/userService";

export const ChangeUsername = () => {
  const [formData, setFormData] = useState({
    newUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newUsername.length < 3) {
      toast.error("New username must be at least 3 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await userService.changeUsername({
        password: formData.password,
        new_username: formData.newUsername,
      });

      toast.success("Username updated successfully!");
      setFormData({ newUsername: "", password: "" });
    } catch (error) {
      let errorMessage = "Failed to update password.";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;

          if (typeof detail === "string") {
            errorMessage = detail;
          } else if (Array.isArray(detail) && detail.length > 0) {
            errorMessage = detail[0].msg;
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Link
          to="/settings"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          &larr; Back to settings
        </Link>
      </div>

      <div className="bg-gray-50 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Change Username
        </h2>

        <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Username
            </label>
            <div className="relative group">
              <input
                type="text"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative group">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none 
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
            {isLoading ? "Updating..." : "Update Username"}
          </button>
        </form>
      </div>
    </div>
  );
};
