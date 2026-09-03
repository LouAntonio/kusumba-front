import { cn } from '../../lib/cn';

export function Logo({
	className,
	variant = 'default',
}: {
	className?: string;
	variant?: 'default' | 'white';
}) {
	const src = variant === 'white' ? '/logo/logoBranco.png' : '/logo/logo.png';
	return (
		<img
			src={src}
			alt="Kusumba"
			className={cn('h-8 w-auto object-contain', className)}
		/>
	);
}
