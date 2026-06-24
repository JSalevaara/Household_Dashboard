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

	// 1. Wait for the backend to verify the token
	if (isLoading) {
		// You can replace this with a nice spinner component if you have one
		return (
			<div className="p-8 text-center font-semibold text-gray-500">
				Verifying access...
			</div>
		);
	}

	// 2. If there is no verified user, kick them to the login screen
	if (!currentUser) {
		return <Navigate to="/login" replace />;
	}

	// 3. If this route requires specific roles, check if the user has one of them
	if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
		// Kick them back to the home page (or an unauthorized page)
		return <Navigate to="/" replace />;
	}

	// 4. If all checks pass, render the component!
	// This supports both wrapping elements (children) and nested routes (Outlet)
	return children ? <>{children}</> : <Outlet />;
};
