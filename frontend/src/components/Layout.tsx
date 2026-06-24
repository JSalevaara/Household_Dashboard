import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar'; // Adjust path if needed

export const Layout = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<NavBar />
			<main className="grow">
				<Outlet />
			</main>
		</div>
	);
};
