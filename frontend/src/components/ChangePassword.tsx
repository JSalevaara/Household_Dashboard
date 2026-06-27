import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { userService } from '../api/userService';

export const ChangePassword = () => {
	const [formData, setFormData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.newPassword.length < 6) {
			toast.error('New password must be at least 6 characters long');
			return;
		}

		if (formData.newPassword === formData.oldPassword) {
			toast.error('New password cannot be the same as the old password!');
			return;
		}

		if (formData.newPassword !== formData.confirmNewPassword) {
			toast.error('New password and confirm new password do not match');
			return;
		}

		setIsLoading(true);

		try {
			await userService.changePassword({
				old_password: formData.oldPassword,
				new_password: formData.newPassword,
			});

			toast.success('Password updated successfully!');
			setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
		} catch (error: any) {
			let errorMessage = 'Failed to update password.';

			if (error.response?.data?.detail) {
				const detail = error.response.data.detail;

				if (typeof detail === 'string') {
					errorMessage = detail;
				} else if (Array.isArray(detail) && detail.length > 0) {
					errorMessage = detail[0].msg;
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
				<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
				<Link
					to="/settings"
					className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
					&larr; Back to Settings
				</Link>
			</div>

			<div className="bg-gray-50 rounded-xl shadow p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Change Password
				</h2>

				<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Old Password
						</label>
						<div className="relative group">
							<input
								type={showPassword ? 'text' : 'password'}
								name="oldPassword"
								value={formData.oldPassword}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none 
                       opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							New Password
						</label>
						<div className="relative group">
							<input
								type={showNewPassword ? 'text' : 'password'}
								name="newPassword"
								value={formData.newPassword}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none 
                       					opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
								{showNewPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Confirm New Password
						</label>
						<div className="relative group">
							<input
								type={showNewPassword ? 'text' : 'password'}
								name="confirmNewPassword"
								value={formData.confirmNewPassword}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none 
                       opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
								{showNewPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-400">
						{isLoading ? 'Updating...' : 'Update Password'}
					</button>
				</form>
			</div>
		</div>
	);
};
