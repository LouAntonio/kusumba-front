import { cn } from '../../lib/cn';

export function Spinner({
	className,
	size = 'md',
}: {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}) {
	const sizes = {
		sm: 'h-4 w-4 border-2',
		md: 'h-6 w-6 border-2',
		lg: 'h-10 w-10 border-[3px]',
	};
	return (
		<div
			className={cn(
				'animate-spin rounded-full border-primary-200 border-t-primary-600',
				sizes[size],
				className,
			)}
		/>
	);
}

export function LoadingScreen({ label }: { label?: string }) {
	return (
		<div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
			<Spinner size="lg" />
			{label && <p className="text-sm">{label}</p>}
		</div>
	);
}
