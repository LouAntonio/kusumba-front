import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LoadingScreen } from '../ui/Spinner';

export function RequireGuest({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);

	if (loading) {
		return <LoadingScreen label="A carregar a sessão…" />;
	}

	if (user) {
		return <Navigate to="/anuncios" replace />;
	}

	return <>{children}</>;
}
