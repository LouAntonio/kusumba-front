import { useState } from 'react';
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
import { LoadingScreen } from '../components/ui/Spinner';
import { RatingStars } from '../components/ui/RatingStars';
import { Avatar } from '../components/ui/Avatar';
import { ReportModal } from '../components/ui/ReportModal';
import { AdReviews } from '../components/ads/AdReviews';
import { AD_TYPE_LABELS, type AdType } from '../lib/types';
import { formatKz, formatDistance, timeAgo } from '../lib/format';

export function AdDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const { data: ad, isLoading, isError } = useAd(slug);
	const [reportOpen, setReportOpen] = useState(false);

	const { data: wishlistCheck } = useWishlistCheck(ad?.id);
	const toggleWishlist = useToggleWishlist();
	const createConversation = useCreateConversation();

	if (isLoading) {
		return <LoadingScreen label="A carregar o anúncio…" />;
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
		toggleWishlist.mutate(ad.id);
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
											to={`/anuncios?categoryIds=${cat.id}`}
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
										{ad.distanceM !== undefined &&
											ad.distanceM !== null && (
												<span>
													•
													{formatDistance(
														ad.distanceM,
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
