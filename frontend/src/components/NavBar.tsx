import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavBar = () => {
	const { currentUser, logout, isLoading } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	if (isLoading) {
		return <div className="px-6 py-4">Loading...</div>;
	}

	return (
		<nav className="relative w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
			<Link to="/dashboard" className="text-xl font-bold text-gray-800">
				My Household
			</Link>
			<div
				ref={menuRef}
				className="relative"
				onMouseLeave={() => setIsMenuOpen(false)}>
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
					aria-label="Toggle menu">
					<svg
						className="w-7 h-7"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						{isMenuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>

				{isMenuOpen && (
					<div className="absolute top-full right-0 p-4 w-48 z-50">
						<div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 overflow-hidden">
							{(currentUser?.role === 'admin' || currentUser?.super) && (
								<Link
									to="/admin"
									onClick={() => setIsMenuOpen(false)}
									className="block px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors">
									Admin Dashboard
								</Link>
							)}

							<Link
								to="/settings"
								onClick={() => setIsMenuOpen(false)}
								className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
								Settings
							</Link>
							<hr className="my-1 border-gray-100" />

							<button
								onClick={() => {
									setIsMenuOpen(false);
									logout();
								}}
								className="w-full text-left block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
								Log Out
							</button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};
