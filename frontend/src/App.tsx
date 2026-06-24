import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Login } from './components/login';
import { Register } from './components/register';
import { Dashboard } from './Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings } from './components/settings';
import { ChangePassword } from './components/changePassword';
import { AdminDashboard } from './components/adminDashboard';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

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
							<Settings></Settings>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings/changepassword"
					element={
						<ProtectedRoute>
							<ChangePassword></ChangePassword>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin"
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</Router>
	);
}
