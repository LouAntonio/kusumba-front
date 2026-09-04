import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Skeleton } from '../ui/Skeleton';

export function RequireGuest({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center px-4">
				<div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
					<Skeleton className="mx-auto h-8 w-40" />
					<div className="space-y-3 pt-2">
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<Skeleton className="h-10 w-full rounded-lg" />
				</div>
			</div>
		);
	}

	if (user) {
		return <Navigate to="/anuncios" replace />;
	}

	return <>{children}</>;
}
