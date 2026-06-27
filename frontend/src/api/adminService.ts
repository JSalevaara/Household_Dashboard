import apiClient from './client';

export interface User {
	id: number;
	username: string;
	email: string;
	role: string;
	super: boolean;
}

export interface AdminStats {
	total_users: number;
	total_households: number;
}

export const adminService = {
	getDashboardData: async () => {
		const [usersRes, statsRes] = await Promise.all([
			apiClient.get<User[]>('/admin/users'),
			apiClient.get<AdminStats>('/admin/stats'),
		]);
		return {
			users: usersRes.data,
			stats: statsRes.data,
		};
	},

	updateRole: async (userId: number, newRole: string) => {
		const response = await apiClient.patch(
			`/admin/users/${userId}/role?new_role=${newRole}`,
		);
		return response.data;
	},

	resetPassword: async (userId: number, newPassword: string) => {
		const response = await apiClient.patch(
			`/admin/users/${userId}/reset-password`,
			{
				new_password: newPassword,
			},
		);
		return response.data;
	},

	deleteUser: async (userId: number) => {
		const response = await apiClient.delete(`/admin/users/${userId}`);
		return response.data;
	},
};
