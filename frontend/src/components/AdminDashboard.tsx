import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

export const AdminDashboard = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [stats, setStats] = useState({ total_users: 0, total_households: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAdminData = async () => {
			try {
				const [usersRes, statsRes] = await Promise.all([
					apiClient.get('/admin/users'),
					apiClient.get('/admin/stats'),
				]);
				setUsers(usersRes.data);
				setStats(statsRes.data);
			} catch (err) {
				console.error('Failed to fetch admin data', err);
			} finally {
				setLoading(false);
			}
		};
		fetchAdminData();
	}, []);

	const toggleRole = async (user: User) => {
		const newRole = user.role === 'admin' ? 'user' : 'admin';
		try {
			await apiClient.patch(`/admin/users/${user.id}/role?new_role=${newRole}`);
			setUsers(
				users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
			);
		} catch (err) {
			alert('Failed to update role');
		}
	};

	const resetPassword = async (userId: number, username: string) => {
		const newPassword = window.prompt(`Enter a new password for ${username}:`);

		if (!newPassword) return;

		try {
			await apiClient.patch(`/admin/users/${userId}/reset-password`, {
				new_password: newPassword,
			});
			alert(`Password for ${username} has been successfully updated!`);
		} catch (err: any) {
			console.error(err);
			alert(
				`Failed to reset password: ${err.response?.data?.detail || err.message}`,
			);
		}
	};

	if (loading) return <div className="p-8">Loading Dashboard...</div>;

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Admin Control Panel</h1>
				<Link
					to="/"
					className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">
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

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<table className="w-full text-left">
					<thead className="bg-gray-50 border-b border-gray-100">
						<tr>
							<th className="px-6 py-4 font-semibold text-gray-600">
								Username
							</th>
							<th className="px-6 py-4 font-semibold text-gray-600">Email</th>
							<th className="px-6 py-4 font-semibold text-gray-600">Role</th>
							<th className="px-6 py-4 font-semibold text-gray-600 text-right">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{users.map((user) => (
							<tr key={user.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4">{user.username}</td>
								<td className="px-6 py-4">{user.email}</td>
								<td className="px-6 py-4">
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold ${
											user.role === 'admin'
												? 'bg-purple-100 text-purple-700'
												: 'bg-green-100 text-green-700'
										}`}>
										{user.role}
									</span>
								</td>
								<td className="px-6 py-4 flex justify-end gap-4">
									{user.username !== 'your_username' ? (
										<>
											<button
												onClick={() => toggleRole(user)}
												className="text-sm font-semibold text-blue-600 hover:text-blue-800">
												Change to {user.role === 'admin' ? 'User' : 'Admin'}
											</button>

											<button
												onClick={() => resetPassword(user.id, user.username)}
												className="text-sm font-semibold text-red-600 hover:text-red-800">
												Reset Password
											</button>
										</>
									) : (
										<span className="text-sm font-bold text-gray-400 cursor-not-allowed">
											Super Admin
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
