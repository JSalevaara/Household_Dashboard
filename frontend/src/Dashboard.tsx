import { NavBar } from './components/NavBar';

export const Dashboard = () => {
	return (
		<div>
			<div className="min-h-screen bg-gray-50">
				<main className="flex flex-col items-center justify-center p-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
					<p className="text-gray-600">
						You made it! You are securely logged in.
					</p>
				</main>
			</div>
		</div>
	);
};
