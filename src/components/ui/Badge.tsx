import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'primary' | 'accent' | 'success' | 'warning' | 'neutral' | 'danger';

const tones: Record<Tone, string> = {
	primary: 'bg-primary-100 text-primary-800',
	accent: 'bg-orange-100 text-accent-dark',
	success: 'bg-emerald-100 text-emerald-800',
	warning: 'bg-amber-100 text-amber-800',
	danger: 'bg-red-100 text-red-700',
	neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({
	children,
	tone = 'neutral',
	className,
}: {
	children: ReactNode;
	tone?: Tone;
	className?: string;
}) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
				tones[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}
