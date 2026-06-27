import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

interface ProtectedRouteProps {
	children?: React.ReactNode;
	allowedRoles?: string[];
}

export const ProtectedRoute = ({
	children,
	allowedRoles,
}: ProtectedRouteProps) => {
	const { currentUser, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<div className="text-gray-500 font-medium animate-pulse">
					Verifying access...
				</div>
			</div>
		);
	}

	if (!currentUser) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles) {
		const hasAllowedRole = allowedRoles.includes(currentUser.role);
		const isSuperAdmin = currentUser.super === true;

		if (!hasAllowedRole && !isSuperAdmin) {
			return <Navigate to="/" replace />;
		}
	}

	return children ? <>{children}</> : <Outlet />;
};
