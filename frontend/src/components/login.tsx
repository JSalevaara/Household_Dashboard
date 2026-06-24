import React, { useState } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		try {
			const response = await apiClient.post('/api/login', formData);
			const token = response.data.access_token;

			localStorage.setItem('token', token);
			setMessage({ type: 'success', text: 'Login successful! Welcome back.' });
			setFormData({ username: '', password: '' });
			navigate('/dashboard');
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				setMessage({ type: 'error', text: 'Invalid username or password' });
			} else {
				setMessage({
					type: 'error',
					text: 'An error occured. Try again later.',
				});
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

				{message && (
					<div
						className={`p-4 rounded-lg mb-6 text-sm font-medium ${
							message.type === 'success'
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}>
						{message.text}
					</div>
				)}

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
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-9.5 text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-400">
						{isLoading ? 'Signing in...' : 'Log In'}
					</button>
				</form>
			</div>
		</div>
	);
};
