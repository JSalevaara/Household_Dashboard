import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../api/client';

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
	super?: boolean;
	household_id?: number | null;
}

interface AuthContextType {
	currentUser: User | null;
	isLoading: boolean;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuth = async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			setCurrentUser(null);
			setIsLoading(false);
			return;
		}

		try {
			const response = await apiClient.get('/me');
			setCurrentUser(response.data);
		} catch (error) {
			console.error('Token invalid or expired');
			localStorage.removeItem('token');
			setCurrentUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const logout = async () => {
		try {
			await apiClient.post('/logout');
		} catch (error) {
			console.error('Logout request failed, but clearing local state anyway');
		} finally {
			localStorage.removeItem('token');
			setCurrentUser(null);
			window.location.href = '/login';
		}
	};

	return (
		<AuthContext.Provider value={{ currentUser, isLoading, logout, checkAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
