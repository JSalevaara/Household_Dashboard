import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
			<p className="text-gray-600 mb-8">
				You made it! You are securely logged in.
			</p>
			<button
				onClick={handleLogout}
				className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
				Log Out
			</button>
		</div>
	);
};
