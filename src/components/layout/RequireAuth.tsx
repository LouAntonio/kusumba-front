import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Skeleton } from '../ui/Skeleton';

export function RequireAuth({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);
	const location = useLocation();

	if (loading) {
		return (
			<div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
				<Skeleton className="h-7 w-48" />
				<Skeleton className="h-4 w-72" />
				<div className="grid gap-6 lg:grid-cols-2">
					<div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-28 rounded-lg" />
					</div>
					<div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-36 rounded-lg" />
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/entrar" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
