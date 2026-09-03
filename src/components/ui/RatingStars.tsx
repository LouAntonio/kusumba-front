import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { cn } from '../../lib/cn';

export function RatingStars({
	rating,
	className,
	size = 'md',
}: {
	rating: number | null | undefined;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}) {
	const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
	const stars = [];
	const value = rating ?? 0;
	for (let i = 1; i <= 5; i++) {
		if (value >= i) {
			stars.push(<FaStar key={i} className="text-amber-400" />);
		} else if (value >= i - 0.5) {
			stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
		} else {
			stars.push(<FaRegStar key={i} className="text-slate-300" />);
		}
	}
	return (
		<div
			className={cn('flex items-center gap-0.5', sizes[size], className)}
			aria-label={`${value} de 5 estrelas`}
		>
			{stars}
		</div>
	);
}
