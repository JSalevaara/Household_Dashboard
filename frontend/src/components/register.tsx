import { useState } from 'react';
import apiClient from '../api/client';

export const Register = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		try {
			const response = await apiClient.post(
				'http://localhost:8080/api/users',
				formData,
			);
			setMessage({
				type: 'success',
				text: `Welcome ${response.data.username}! Your account has been created.`,
			});
			setFormData({ username: '', email: '', password: '' });
		} catch (error: any) {
			if (error.response) {
				const detail = error.response.data.detail;
				if (error.response.status === 422 && Array.isArray(detail)) {
					setMessage({ type: 'error', text: detail[0].msg });
				} else {
					setMessage({
						type: 'error',
						text: detail || 'Something went wrong.',
					});
				}
			} else {
				setMessage({
					type: 'error',
					text: 'Network error. Please try again later.',
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
					Join the Household
				</h2>
				{message && (
					<div
						className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-500 text-green-700' : 'bg-red-100 text-red-800'}`}>
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
							className="w-full px-4- py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors"
							placeholder="JohnDoe"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							placeholder="john@example.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={8}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-blue-400">
						{isLoading ? 'Registering...' : 'Register'}
					</button>
				</form>
			</div>
		</div>
	);
};
