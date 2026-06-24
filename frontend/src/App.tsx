import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Login } from './components/login'; // Adjust path if your components are in a folder!
import { Register } from './components/register'; // Adjust path
import { Dashboard } from './Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

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

				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</Router>
	);
}
