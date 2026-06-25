import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
	super: boolean;
}

export const AdminDashboard = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [stats, setStats] = useState({ total_users: 0, total_households: 0 });
	const [loading, setLoading] = useState(true);
	const { currentUser } = useAuth();

	// State to track exact position of the dropdown
	const [menuState, setMenuState] = useState<{
		id: number;
		top: number;
		right: number;
	} | null>(null);

	// Global listener to close the dropdown if you click away or scroll
	useEffect(() => {
		const closeMenu = () => setMenuState(null);
		window.addEventListener('click', closeMenu);
		window.addEventListener('scroll', closeMenu, true);

		return () => {
			window.removeEventListener('click', closeMenu);
			window.removeEventListener('scroll', closeMenu, true);
		};
	}, []);

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

	// Function to calculate exact button position and open the menu
	const toggleMenu = (e: React.MouseEvent, user: User) => {
		e.stopPropagation();

		if (menuState?.id === user.id) {
			setMenuState(null);
			return;
		}

		const rect = e.currentTarget.getBoundingClientRect();

		setMenuState({
			id: user.id,
			top: rect.bottom + 8, // 8px below the button
			right: window.innerWidth - rect.right, // Align with the right side
		});
	};

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

	const deleteUser = async (userId: number, username: string) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete the user ${username}? This action cannot be undone.`,
		);

		if (!confirmDelete) return;

		try {
			await apiClient.delete(`/admin/users/${userId}/delete`);
			setUsers(users.filter((u) => u.id !== userId));
			alert(`User ${username} has been successfully deleted!`);
		} catch (err: any) {
			console.error(err);
			alert(
				`Failed to delete user: ${err.response?.data?.detail || err.message}`,
			);
		}
	};

	if (loading) return <div className="p-8">Loading Dashboard...</div>;

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Admin Control Panel</h1>
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

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
				<table className="w-full text-left min-w-[800px]">
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
											user.role === 'admin'
												? 'bg-purple-100 text-purple-700'
												: 'bg-green-100 text-green-700'
										}`}>
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
											{/* The Trigger Button */}
											<button
												onClick={(e) => toggleMenu(e, user)}
												className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
												aria-label="Options">
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
												</svg>
											</button>

											{/* The Fixed Breakout Menu */}
											{menuState?.id === user.id && (
												<div
													className="fixed w-48 bg-white rounded-xl shadow-xl z-50 border border-gray-200 py-2 overflow-hidden flex flex-col items-start"
													style={{ top: menuState.top, right: menuState.right }}
													onClick={(e) => e.stopPropagation()}>
													{user.id !== currentUser?.id && (
														<button
															onClick={() => {
																toggleRole(user);
																setMenuState(null);
															}}
															className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors">
															Change to{' '}
															{user.role === 'admin' ? 'User' : 'Admin'}
														</button>
													)}

													<button
														onClick={() => {
															resetPassword(user.id, user.username);
															setMenuState(null);
														}}
														className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-50 transition-colors">
														Reset Password
													</button>

													{user.id !== currentUser?.id && (
														<button
															onClick={() => {
																deleteUser(user.id, user.username);
																setMenuState(null);
															}}
															className="w-full text-left px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-gray-50 transition-colors">
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
		</div>
	);
};
