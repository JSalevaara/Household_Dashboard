import React, { useState } from 'react';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';

export const ChangePassword = () => {
	const [formData, setFormData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);

		if (formData.newPassword.length < 6) {
			setMessage({
				type: 'error',
				text: 'New password must be atleast 6 characters long',
			});
			return;
		}

		if (formData.newPassword === formData.oldPassword) {
			setMessage({
				type: 'error',
				text: 'New password cannot be the same as the old password!',
			});
			return;
		}

		if (formData.newPassword !== formData.confirmNewPassword) {
			setMessage({ type: 'error', text: 'New passwords do not match!' });
			return;
		}

		setIsLoading(true);

		try {
			const token = localStorage.getItem('token');

			await apiClient.put(
				'/api/users/me/password',
				{
					old_password: formData.oldPassword,
					new_password: formData.newPassword,
					confirm_new_password: formData.confirmNewPassword,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			setMessage({ type: 'success', text: 'Password changed successfully!' });
			setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
		} catch (error: any) {
			if (error.response && error.response.status === 400) {
				setMessage({ type: 'error', text: 'Incorrect old password.' });
			} else {
				setMessage({ type: 'error', text: 'Failed to update password.' });
			}
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
					className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">
					&larr; Back to settings
				</Link>
			</div>

			<div className="bg-gray-50 rounded-xl shadow p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Change Password
				</h2>

				{message && (
					<div
						className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
						{message.text}
					</div>
				)}

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

				<div className="mt-6">
					<Link to="/settings" className="text-blue-600 hover:underline">
						Back to settings
					</Link>
				</div>
			</div>
		</div>
	);
};
