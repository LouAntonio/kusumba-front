import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LoadingScreen } from '../ui/Spinner';

export function RequireAuth({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);
	const location = useLocation();

	if (loading) {
		return <LoadingScreen label="A carregar a sessão…" />;
	}

	if (!user) {
		return <Navigate to="/entrar" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
