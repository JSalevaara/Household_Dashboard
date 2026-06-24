import React from 'react';
import { Link } from 'react-router-dom';

export const Settings = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Settings
				</h2>

				<div className="space-y-4">
					<Link
						to="/settings/changePassword"
						className="block w-full text-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
						Change Password
					</Link>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-100 text-center">
					<Link
						to="/dashboard"
						className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
						← Back to dashboard
					</Link>
				</div>
			</div>
		</div>
	);
};
