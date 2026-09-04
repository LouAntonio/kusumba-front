import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useToggleWishlist } from '../../hooks/useWishlist';
import { getApiError } from '../../lib/axios';
import type { Ad } from '../../lib/types';
import { cn } from '../../lib/cn';

export function FavoriteButton({
	ad,
	favorited,
	className,
}: {
	ad: Ad;
	favorited: boolean;
	className?: string;
}) {
	const toggle = useToggleWishlist();
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const adding = !favorited;
		toast.promise(
			toggle.mutateAsync({ adId: ad.id, isFavorited: favorited }),
			{
				loading: adding
					? 'A adicionar aos favoritos…'
					: 'A remover dos favoritos…',
				success: adding
					? 'Adicionado aos favoritos.'
					: 'Removido dos favoritos.',
				error: (err) => getApiError(err),
			},
			{ id: `fav-${ad.id}` },
		);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={toggle.isPending}
			className={cn(
				'absolute right-2 top-2 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:text-red-500',
				favorited && 'text-red-500',
				className,
			)}
			aria-label={
				favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
			}
		>
			{favorited ? (
				<FaHeart className="h-4 w-4" />
			) : (
				<FaRegHeart className="h-4 w-4" />
			)}
		</button>
	);
}
