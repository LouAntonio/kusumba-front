import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GoogleOneTap } from '../auth/GoogleOneTap';

export function AppLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<GoogleOneTap />
			<Navbar />
			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
