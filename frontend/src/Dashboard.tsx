import { useNavigate, Link } from 'react-router-dom';

export const Dashboard = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
				<h2 className="text-xl font-bold text-gray-800">My Household</h2>

				<div className="flex items-center gap-4">
					<Link
						to="/settings"
						className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
						Settings
					</Link>
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
						Log Out
					</button>
				</div>
			</nav>
			<main className="flex flex-col items-center justify-center p-8 mt-10">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
				<p className="text-gray-600">
					You made it! You are securely logged in.
				</p>
			</main>
		</div>
	);
};
