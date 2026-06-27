import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings } from './components/Settings';
import { ChangePassword } from './components/ChangePassword';
import { ChangeUsername } from './components/ChangeUsername';
import { AdminDashboard } from './components/AdminDashboard';
import { Layout } from './components/Layout';
export default function App() {
	return (
		<>
			<Toaster position="top-right" />
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
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
							path="/settings/changeusername"
							element={
								<ProtectedRoute>
									<ChangeUsername />
								</ProtectedRoute>
							}></Route>

						<Route
							path="/admin"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</Router>
		</>
	);
}
