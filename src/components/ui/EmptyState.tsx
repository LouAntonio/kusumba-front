import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-14 text-center',
				className,
			)}
		>
			{icon && <div className="text-4xl text-slate-400">{icon}</div>}
			<h3 className="font-display text-lg text-slate-800">{title}</h3>
			{description && (
				<p className="max-w-sm text-sm text-muted">{description}</p>
			)}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
