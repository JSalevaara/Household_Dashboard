import { Link } from 'react-router-dom';

export const Settings = () => {
	return (
		<div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Settings</h1>
					<Link
						to="/"
						className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">
						&larr; Back to Dashboard
					</Link>
				</div>
				<div className="bg-white rounded-xl shadow-lg p-8">
					<div className="space-y-4">
						<Link
							to="/settings/changePassword"
							className="block w-full text-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
							Change Password
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
