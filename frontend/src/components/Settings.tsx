import { Link } from 'react-router-dom';

export const Settings = () => {
	return (
		<div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="max-w-xl w-full">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
					<Link
						to="/"
						className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
						&larr; Back to Dashboard
					</Link>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<div className="p-6 border-b border-gray-100 bg-gray-50">
						<h2 className="text-lg font-semibold text-gray-800">
							Account Preferences
						</h2>
						<p className="text-sm text-gray-500">
							Manage your security and profile details.
						</p>
					</div>

					<div className="divide-y divide-gray-100">
						<Link
							to="/settings/changePassword"
							className="flex items-center p-6 hover:bg-gray-50 transition-colors group">
							<div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
								{/* Lock Icon */}
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<div className="ml-4 flex-1">
								<h3 className="text-gray-900 font-medium">Change Password</h3>
								<p className="text-sm text-gray-500">
									Update your current password to keep your account secure.
								</p>
							</div>
							<div className="text-gray-400 group-hover:text-blue-600 transition-colors">
								&rarr;
							</div>
						</Link>

						<Link
							to="/settings/changeUsername"
							className="flex items-center p-6 hover:bg-gray-50 transition-colors group">
							<div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
							<div className="ml-4 flex-1">
								<h3 className="text-gray-900 font-medium">Change Username</h3>
								<p className="text-sm text-gray-500">
									Update how your name appears to others in your household.
								</p>
							</div>
							<div className="text-gray-400 group-hover:text-purple-600 transition-colors">
								&rarr;
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
