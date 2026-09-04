import { cn } from '../../lib/cn';

export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn('animate-pulse rounded-lg bg-slate-200', className)}
		/>
	);
}

export function AdCardSkeleton() {
	return (
		<div className="h-full rounded-2xl border border-slate-200 bg-white">
			<Skeleton className="aspect-square w-full rounded-b-none" />
			<div className="space-y-2 p-3">
				<Skeleton className="h-4 w-1/3" />
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="h-3 w-2/3" />
			</div>
		</div>
	);
}
