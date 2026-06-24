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
			<div className="p-8 text-center font-semibold text-gray-500">
				Verifying access...
			</div>
		);
	}

	if (!currentUser) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
		return <Navigate to="/" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
};
