import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	FaHeart,
	FaRegHeart,
	FaShieldAlt,
	FaMapMarkerAlt,
	FaFlag,
	FaCommentDots,
	FaCheckCircle,
	FaHandshake,
} from 'react-icons/fa';
import { useAd } from '../hooks/useAds';
import { useWishlistCheck, useToggleWishlist } from '../hooks/useWishlist';
import { useCreateConversation } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { getApiError } from '../lib/axios';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Gallery } from '../components/ads/Gallery';
import { Skeleton } from '../components/ui/Skeleton';
import { RatingStars } from '../components/ui/RatingStars';
import { Avatar } from '../components/ui/Avatar';
import { ReportModal } from '../components/ui/ReportModal';
import { AdReviews } from '../components/ads/AdReviews';
import { AD_TYPE_LABELS, type AdType } from '../lib/types';
import { formatKz, formatDistance, timeAgo } from '../lib/format';

function distanceMeters(
	a: { lat: number; lng: number },
	b: { lat: number; lng: number },
): number {
	const R = 6371000;
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const la1 = toRad(a.lat);
	const la2 = toRad(b.lat);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

function formatCoords(lat: number, lng: number): string {
	const latDir = lat >= 0 ? 'N' : 'S';
	const lngDir = lng >= 0 ? 'E' : 'O';
	return `${Math.abs(lat).toFixed(3)}°${latDir} · ${Math.abs(lng).toFixed(
		3,
	)}°${lngDir}`;
}

const MAPBOX_TOKEN = (
	import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
)?.trim();

export function AdDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const { data: ad, isLoading, isError } = useAd(slug);
	const [reportOpen, setReportOpen] = useState(false);
	const [myCoords, setMyCoords] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [place, setPlace] = useState<{
		for: string;
		value: string | null;
	} | null>(null);
	const [geoDenied, setGeoDenied] = useState(false);

	const geoUnsupported = !('geolocation' in navigator);

	useEffect(() => {
		if (!('geolocation' in navigator)) {
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				setMyCoords({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				}),
			() => setGeoDenied(true),
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	}, []);

	useEffect(() => {
		if (!ad?.location || !MAPBOX_TOKEN) {
			return;
		}
		let cancelled = false;
		const { lat, lng } = ad.location;
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&country=ao&limit=1`;
		fetch(url)
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			.then((data) => {
				if (cancelled) {
					return;
				}
				setPlace({
					for: ad.id,
					value:
						typeof data?.features?.[0]?.place_name === 'string'
							? (data.features[0].place_name as string)
							: null,
				});
			})
			.catch(() => {
				if (!cancelled) {
					setPlace({ for: ad.id, value: null });
				}
			});
		return () => {
			cancelled = true;
		};
	}, [ad?.id, ad?.location]);

	const { data: wishlistCheck } = useWishlistCheck(ad?.id);
	const toggleWishlist = useToggleWishlist();
	const createConversation = useCreateConversation();

	if (isLoading) {
		return (
			<div className="space-y-8">
				<nav className="flex items-center gap-2 text-sm text-muted">
					<Skeleton className="h-4 w-16" />
					<span>/</span>
					<Skeleton className="h-4 w-40" />
				</nav>

				<div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
					<div className="space-y-6">
						<Skeleton className="aspect-square w-full rounded-2xl" />

						<div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-4/5" />
							<Skeleton className="h-4 w-3/5" />
						</div>

						<div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>

					<div className="lg:sticky lg:top-24 lg:self-start">
						<div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
							<Skeleton className="h-4 w-20 rounded-full" />
							<Skeleton className="h-8 w-40" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full rounded-lg" />
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		);
	}
	if (isError || !ad) {
		return (
			<div className="py-20 text-center">
				<h1 className="font-display text-xl">Anúncio não encontrado</h1>
				<p className="mt-2 text-muted">
					Pode ter sido removido ou oculto.
				</p>
				<Button to="/anuncios" variant="outline" className="mt-6">
					Voltar a explorar
				</Button>
			</div>
		);
	}

	const isOwner = user?.id === ad.user?.id;
	const images = [
		...(ad.image ? [ad.image] : []),
		...(ad.gallery?.map((g) => g.url) ?? []),
	];
	const proximityMeters =
		myCoords && ad.location ? distanceMeters(myCoords, ad.location) : null;
	const mapLink = ad.location
		? `https://www.google.com/maps?q=${ad.location.lat},${ad.location.lng}`
		: null;

	const handleContact = () => {
		if (!user) {
			navigate('/entrar', { state: { from: `/anuncios/${ad.slug}` } });
			return;
		}
		createConversation.mutate(ad.id, {
			onSuccess: (conversation) => {
				navigate(`/mensagens/${conversation.id}`);
			},
			onError: (error) => toast.error(getApiError(error)),
		});
	};

	const handleFavorite = () => {
		if (!user) {
			navigate('/entrar', { state: { from: `/anuncios/${ad.slug}` } });
			return;
		}
		toggleWishlist.mutate({
			adId: ad.id,
			isFavorited: Boolean(wishlistCheck?.inWishlist),
		});
	};

	return (
		<div className="space-y-8">
			<nav className="flex items-center gap-2 text-sm text-muted">
				<Link to="/anuncios" className="hover:text-primary-600">
					Anúncios
				</Link>
				<span>/</span>
				<span className="truncate text-slate-700">{ad.title}</span>
			</nav>

			<div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
				<div className="space-y-6">
					<Gallery images={images} title={ad.title} />

					<Card className="p-5">
						<h2 className="mb-3 font-display text-lg">Descrição</h2>
						<p className="whitespace-pre-line text-slate-700">
							{ad.description}
						</p>

						{ad.type === 'TRADE' &&
							(ad.tradefor?.length ?? 0) > 0 && (
								<div className="mt-5">
									<p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
										<FaHandshake className="text-primary-600" />
										Aceita trocar por:
									</p>
									<div className="flex flex-wrap gap-2">
										{ad.tradefor.map((item, i) => (
											<Badge key={i} tone="primary">
												{item}
											</Badge>
										))}
									</div>
								</div>
							)}

						{(ad.categories?.length ?? 0) > 0 && (
							<div className="mt-5 flex flex-wrap gap-2">
								{ad.categories.map((cat) => (
									<Badge key={cat.id} tone="neutral">
										<Link
											to={`/anuncios?categorySlugs=${cat.slug}`}
											className="hover:text-primary-700"
										>
											{cat.name}
										</Link>
									</Badge>
								))}
							</div>
						)}
					</Card>

					<AdReviews adId={ad.id} />

					<div className="flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
						<span className="text-muted">
							Publicado {timeAgo(ad.createdAt)}
						</span>
						<button
							onClick={() => setReportOpen(true)}
							className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700"
						>
							<FaFlag className="h-3.5 w-3.5" /> Denunciar
						</button>
					</div>
				</div>

				<div className="lg:sticky lg:top-24 lg:self-start">
					<Card className="overflow-hidden">
						<div className="border-b border-slate-200 p-5">
							<div className="mb-3">
								<Badge
									tone={
										ad.type === 'DONATION'
											? 'success'
											: ad.type === 'TRADE'
												? 'primary'
												: 'neutral'
									}
								>
									{AD_TYPE_LABELS[ad.type as AdType]}
								</Badge>
							</div>
							{ad.type === 'DONATION' ? (
								<p className="font-mono text-2xl font-semibold text-emerald-600">
									Doação
								</p>
							) : ad.price !== null && ad.price !== undefined ? (
								<p className="font-mono text-3xl font-semibold text-slate-900">
									{formatKz(ad.price)}
								</p>
							) : (
								<p className="text-xl">-</p>
							)}
							{ad.featured && (
								<p className="mt-1 text-xs font-medium text-accent-dark">
									★ Anúncio em destaque
								</p>
							)}
						</div>

						<div className="space-y-3 p-5">
							{ad.averageRating ? (
								<div className="flex items-center gap-2">
									<RatingStars rating={ad.averageRating} />
									<span className="text-sm text-muted">
										{ad.averageRating.toFixed(1)} (
										{ad.reviewCount} avaliações)
									</span>
								</div>
							) : null}

							{ad.location && (
								<div className="space-y-2 border-t border-slate-100 pt-4">
									<div className="flex items-center gap-2 text-sm text-slate-700">
										<FaMapMarkerAlt className="h-3.5 w-3.5 shrink-0 text-primary-600" />
										{place?.for === ad.id &&
										!place.value ? (
											<span className="font-mono text-xs text-muted">
												{formatCoords(
													ad.location.lat,
													ad.location.lng,
												)}
											</span>
										) : place?.for === ad.id &&
										  place.value ? (
											<span>{place.value}</span>
										) : (
											<Skeleton className="h-4 w-40" />
										)}
									</div>

									{proximityMeters !== null && (
										<div className="flex items-center gap-2 text-sm">
											<span className="text-primary-600">
												A{' '}
												{formatDistance(
													proximityMeters,
												)}{' '}
												de si
											</span>
										</div>
									)}
									{(geoDenied || geoUnsupported) && (
										<p className="text-xs text-muted">
											Ative a localização para ver a
											distância até si.
										</p>
									)}
									{mapLink && (
										<a
											href={mapLink}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
										>
											<FaMapMarkerAlt className="h-3.5 w-3.5" />
											Ver no mapa
										</a>
									)}
								</div>
							)}

							<div className="flex items-center gap-3 border-t border-slate-100 pt-4">
								<Avatar
									image={ad.user?.image}
									name={ad.user?.name ?? 'V'}
								/>
								<div className="min-w-0 flex-1">
									<Link
										to={`/perfil?user=${ad.user?.id}`}
										className="block truncate text-sm font-semibold text-slate-800 hover:text-primary-700"
									>
										{ad.user?.name} {ad.user?.surname}
									</Link>
									<div className="flex items-center gap-2 text-xs text-muted">
										{ad.user?.neighborhood && (
											<span className="inline-flex items-center gap-1">
												<FaMapMarkerAlt className="h-3 w-3" />
												{ad.user.neighborhood}
											</span>
										)}
										{ad.distanceKm !== undefined &&
											ad.distanceKm !== null && (
												<span>
													•
													{formatDistance(
														ad.distanceKm * 1000,
													)}
												</span>
											)}
									</div>
								</div>
								{ad.user?.isVerified && (
									<FaCheckCircle
										className="h-5 w-5 text-primary-500"
										title="Verificado"
									/>
								)}
							</div>

							{!isOwner && (
								<div className="space-y-2 pt-2">
									<Button
										onClick={handleContact}
										disabled={createConversation.isPending}
										fullWidth
									>
										<FaCommentDots className="h-4 w-4" />
										{createConversation.isPending
											? 'A abrir…'
											: 'Contactar'}
									</Button>
									<Button
										onClick={handleFavorite}
										variant="outline"
										fullWidth
									>
										{wishlistCheck?.inWishlist ? (
											<FaHeart className="h-4 w-4 text-red-500" />
										) : (
											<FaRegHeart className="h-4 w-4" />
										)}
										{wishlistCheck?.inWishlist
											? 'Guardo nos favoritos'
											: 'Guardar nos favoritos'}
									</Button>
								</div>
							)}

							<div className="mt-2 flex items-start gap-2 rounded-xl bg-sand p-3 text-xs text-slate-600">
								<FaShieldAlt className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
								<p>
									Confie em vizinhos. Transações sem frete,
									com reviews e verificação de identidade.
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>

			<ReportModal
				open={reportOpen}
				onClose={() => setReportOpen(false)}
				targetType="AD"
				targetId={ad.id}
			/>
		</div>
	);
}
