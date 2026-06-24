import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings } from './components/Settings';
import { ChangePassword } from './components/ChangePassword';
import { AdminDashboard } from './components/AdminDashboard';
import { Layout } from './components/Layout'; // Make sure this path is correct for your project

export default function App() {
	return (
		<Router>
			<Routes>
				{/* 1. ROUTES WITHOUT NAVBAR */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* 2. ROUTES WITH NAVBAR (Wrapped in Layout) */}
				<Route element={<Layout />}>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/settings/changepassword"
						element={
							<ProtectedRoute>
								<ChangePassword />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin"
						element={
							<ProtectedRoute allowedRoles={['admin']}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
				</Route>

				{/* 3. CATCH-ALL REDIRECT */}
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</Router>
	);
}
