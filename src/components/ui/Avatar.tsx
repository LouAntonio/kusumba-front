import { cn } from '../../lib/cn';
import { initialsOf } from '../../lib/format';

export function Avatar({
	image,
	name,
	size = 'md',
	className,
}: {
	image?: string | null;
	name: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
}) {
	const sizes = {
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-14 w-14 text-lg',
		xl: 'h-24 w-24 text-3xl',
	};
	return (
		<div
			className={cn(
				'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 font-semibold text-primary-800',
				sizes[size],
				className,
			)}
		>
			{image ? (
				<img
					src={image}
					alt={name}
					className="h-full w-full object-cover"
				/>
			) : (
				<span className="select-none">{initialsOf(name)}</span>
			)}
		</div>
	);
}
