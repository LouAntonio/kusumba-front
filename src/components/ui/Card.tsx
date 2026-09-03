import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({
	children,
	className,
	hover = false,
}: {
	children: ReactNode;
	className?: string;
	hover?: boolean;
}) {
	return (
		<div
			className={cn(
				'overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60',
				hover &&
					'transition-shadow hover:shadow-md hover:ring-slate-300',
				className,
			)}
		>
			{children}
		</div>
	);
}
