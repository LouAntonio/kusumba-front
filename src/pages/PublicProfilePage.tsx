import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	FaCheckCircle,
	FaMapMarkerAlt,
	FaBoxOpen,
	FaUserPlus,
	FaStar,
} from 'react-icons/fa';
import { usePublicUser } from '../hooks/useUsers';
import { useAds } from '../hooks/useAds';
import { useUserReviews } from '../hooks/useReviews';
import { useCreateConversation } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { getApiError } from '../lib/axios';
import { fullName, formatDate, timeAgo } from '../lib/format';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner, LoadingScreen } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { AdCard } from '../components/ads/AdCard';
import { RatingStars } from '../components/ui/RatingStars';

export function PublicProfilePage() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const userId = params.get('user') ?? undefined;
	const currentUser = useAuthStore((s) => s.user);

	const { data: profile, isLoading, isError } = usePublicUser(userId);
	const { data: adsData, isLoading: adsLoading } = useAds(
		useMemo(() => ({ userId: userId as string, limit: 24 }), [userId]),
	);
	const { data: reviewsData, isLoading: reviewsLoading } =
		useUserReviews(userId);
	const createConversation = useCreateConversation();

	if (isLoading || !userId) {
		return <LoadingScreen label="A carregar o perfil…" />;
	}

	if (isError || !profile) {
		return (
			<div className="py-20 text-center">
				<h1 className="font-display text-xl">Perfil não encontrado</h1>
				<p className="mt-2 text-muted">
					O utilizador pode ter sido removido ou a conta pode estar
					inativa.
				</p>
				<Button to="/anuncios" variant="outline" className="mt-6">
					Voltar a explorar
				</Button>
			</div>
		);
	}

	const handleContact = () => {
		if (!currentUser) {
			navigate('/entrar', {
				state: { from: `/perfil?user=${userId}` },
			});
			return;
		}
		const targetAd = adsData?.items?.[0];
		if (!targetAd) {
			toast.error(
				'Este utilizador ainda não tem anúncios ativos para contacto.',
			);
			return;
		}
		createConversation.mutate(targetAd.id, {
			onSuccess: (conversation) => {
				navigate(`/mensagens/${conversation.id}`);
			},
			onError: (error) => toast.error(getApiError(error)),
		});
	};

	const ads = adsData?.items ?? [];
	const reviews = reviewsData?.items ?? [];

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<Card className="p-6">
				<div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
					<Avatar
						image={profile.image}
						name={profile.name}
						size="xl"
					/>
					<div className="flex-1 text-center sm:text-left">
						<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
							<h1 className="font-display text-2xl">
								{fullName(profile)}
							</h1>
							{profile.isVerified && (
								<FaCheckCircle
									className="h-5 w-5 text-primary-500"
									title="Utilizador verificado"
								/>
							)}
							{profile.subscriptionTier === 'KUSUMBA_PASS' && (
								<Badge tone="accent">Kusumba Pass</Badge>
							)}
						</div>
						<p className="mt-1 text-sm text-muted">
							Membro desde {formatDate(profile.createdAt)}
						</p>
						{profile.neighborhood && (
							<p className="mt-2 inline-flex items-center gap-1 text-sm text-muted">
								<FaMapMarkerAlt className="h-3.5 w-3.5" />
								{profile.neighborhood}, {profile.city}
							</p>
						)}
						<div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:justify-start">
							<span className="inline-flex items-center gap-1.5">
								<FaStar className="h-3.5 w-3.5 text-amber-400" />
								Confiança: {profile.trustScore.toFixed(1)}
							</span>
							<span>{adsData?.total ?? 0} anúncio(s)</span>
						</div>
					</div>
					{currentUser?.id !== profile.id && (
						<Button
							onClick={handleContact}
							disabled={createConversation.isPending}
						>
							<FaUserPlus className="h-4 w-4" />
							{createConversation.isPending
								? 'A abrir…'
								: 'Mensagem'}
						</Button>
					)}
				</div>
			</Card>

			<section className="space-y-4">
				<h2 className="font-display text-xl">Anúncios</h2>
				{adsLoading ? (
					<Spinner className="mx-auto" />
				) : ads.length === 0 ? (
					<EmptyState
						icon={<FaBoxOpen />}
						title="Nenhum anúncio"
						description="Este utilizador ainda não tem anúncios visíveis."
					/>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{ads.map((ad) => (
							<AdCard key={ad.id} ad={ad} showFavorite={false} />
						))}
					</div>
				)}
			</section>

			<section className="space-y-4">
				<h2 className="font-display text-xl">
					Avaliações ({reviewsData?.total ?? 0})
				</h2>
				{reviewsLoading ? (
					<Spinner className="mx-auto" />
				) : reviews.length === 0 ? (
					<p className="text-sm text-muted">
						Ainda não há avaliações para este utilizador.
					</p>
				) : (
					<div className="space-y-4">
						{reviews.map((review) => (
							<div
								key={review.id}
								className="rounded-2xl border border-slate-200 bg-white p-4"
							>
								<div className="flex items-center gap-3">
									<Avatar
										image={review.reviewer?.image}
										name={review.reviewer?.name ?? 'U'}
										size="sm"
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-slate-800">
											{review.reviewer
												? fullName(review.reviewer)
												: 'Utilizador'}
										</p>
										<p className="text-xs text-muted">
											{formatDate(review.createdAt)} ·{' '}
											{timeAgo(review.createdAt)}
										</p>
									</div>
									<RatingStars
										rating={review.rating}
										size="sm"
									/>
								</div>
								{review.comment && (
									<p className="mt-3 text-sm text-slate-700">
										{review.comment}
									</p>
								)}
								{review.response && (
									<div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
										<span className="font-medium text-slate-800">
											Resposta:
										</span>{' '}
										{review.response}
									</div>
								)}
								{review.ad && (
									<Link
										to={`/anuncios/${review.ad.slug}`}
										className="mt-3 inline-block text-sm text-primary-600 hover:text-primary-700"
									>
										Sobre: {review.ad.title}
									</Link>
								)}
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
