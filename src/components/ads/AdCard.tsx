import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { RatingStars } from '../ui/RatingStars';
import { FavoriteButton } from './FavoriteButton';
import type { Ad } from '../../lib/types';
import { AD_TYPE_LABELS } from '../../lib/types';
import { formatDistance, formatKz, timeAgo } from '../../lib/format';
import { cn } from '../../lib/cn';

export function AdCard({
	ad,
	favorited = false,
	showFavorite = false,
	className,
}: {
	ad: Ad;
	favorited?: boolean;
	showFavorite?: boolean;
	className?: string;
}) {
	const isDonation = ad.type === 'DONATION';
	const isTrade = ad.type === 'TRADE';
	const hasPrice = ad.price !== null && ad.price !== undefined;

	return (
		<Link to={`/anuncios/${ad.slug}`} className="group block">
			<Card hover className={cn('h-full', className)}>
				<div className="relative aspect-square w-full overflow-hidden bg-slate-100">
					{ad.image ? (
						<img
							src={ad.image}
							alt={ad.title}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-slate-300">
							Sem imagem
						</div>
					)}
					{showFavorite && (
						<FavoriteButton ad={ad} favorited={favorited} />
					)}
					{ad.featured && (
						<div className="absolute left-2 top-2">
							<Badge tone="accent">Destaque</Badge>
						</div>
					)}
					<div className="absolute bottom-2 left-2">
						<Badge
							tone={
								isDonation
									? 'success'
									: isTrade
										? 'primary'
										: 'neutral'
							}
						>
							{AD_TYPE_LABELS[ad.type]}
						</Badge>
					</div>
				</div>
				<div className="space-y-1 p-3">
					<div className="flex items-baseline justify-between gap-2">
						{isDonation ? (
							<span className="font-mono text-base font-semibold text-emerald-600">
								Doação
							</span>
						) : hasPrice ? (
							<span className="font-mono text-base font-semibold text-slate-900">
								{formatKz(ad.price)}
							</span>
						) : (
							<span className="text-base">-</span>
						)}
						{timeAgo(ad.createdAt) && (
							<span className="text-xs text-muted">
								{timeAgo(ad.createdAt)}
							</span>
						)}
					</div>
					<h3 className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-primary-700">
						{ad.title}
					</h3>
					<div className="flex items-center gap-2 pt-1 text-xs text-muted">
						{ad.user?.neighborhood && (
							<span className="inline-flex items-center gap-1">
								<FaMapMarkerAlt className="h-3 w-3" />
								{ad.user.neighborhood}
							</span>
						)}
						{ad.distanceM !== undefined &&
							ad.distanceM !== null && (
								<span>• {formatDistance(ad.distanceM)}</span>
							)}
					</div>
					{(ad.averageRating ?? 0) > 0 && (
						<div className="flex items-center gap-1.5 pt-1">
							<RatingStars rating={ad.averageRating} size="sm" />
							<span className="text-xs text-muted">
								({ad.reviewCount})
							</span>
						</div>
					)}
				</div>
			</Card>
		</Link>
	);
}
