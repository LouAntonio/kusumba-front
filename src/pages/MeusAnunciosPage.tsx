import { useState } from 'react';
import toast from 'react-hot-toast';
import {
	FaPlus,
	FaEye,
	FaEyeSlash,
	FaStar,
	FaTrash,
	FaPencilAlt,
} from 'react-icons/fa';
import {
	useAds,
	useDeleteAd,
	useFeatureAd,
	useUnfeatureAd,
} from '../hooks/useAds';
import { useAuthStore } from '../store/authStore';
import { setAdVisibility } from '../api/ads';
import type { Ad } from '../lib/types';
import { getApiError } from '../lib/axios';
import { AD_STATUS_LABELS, AD_TYPE_LABELS } from '../lib/types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { formatKz } from '../lib/format';

export function MeusAnunciosPage() {
	const user = useAuthStore((s) => s.user);
	const myId = user?.id;
	const { data, isLoading } = useAds({ limit: 50, includeInactive: true });
	const deleteAd = useDeleteAd();
	const featureAd = useFeatureAd();
	const unfeatureAd = useUnfeatureAd();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	if (!myId) {
		return null;
	}

	const myAds = (data?.items ?? []).filter((ad) => ad.user?.id === myId);

	const handleDelete = (ad: Ad) => {
		if (!window.confirm(`Deseja remover o anúncio "${ad.title}"?`)) {
			return;
		}
		setDeletingId(ad.id);
		deleteAd.mutate(ad.id, {
			onSuccess: () => toast.success('Anúncio removido.'),
			onError: (error) => toast.error(getApiError(error)),
			onSettled: () => setDeletingId(null),
		});
	};

	const handleToggleVisibility = async (ad: Ad) => {
		const next = ad.visibility === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
		try {
			await setAdVisibility(ad.id, next);
			toast.success(
				next === 'HIDDEN' ? 'Anúncio oculto.' : 'Anúncio visível.',
			);
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	const handleToggleFeature = (ad: Ad) => {
		if (ad.featured) {
			unfeatureAd.mutate(ad.id, {
				onSuccess: () => toast.success('Destaque removido.'),
				onError: (error) => toast.error(getApiError(error)),
			});
		} else {
			featureAd.mutate(ad.id, {
				onSuccess: () => toast.success('Anúncio em destaque!'),
				onError: (error) => toast.error(getApiError(error)),
			});
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-display text-2xl">Meus anúncios</h1>
					<p className="text-sm text-muted">
						Gira os seus anúncios publicados.
					</p>
				</div>
				<Button to="/anuncios/novo" variant="accent">
					<FaPlus className="h-4 w-4" /> Criar anúncio
				</Button>
			</div>

			{isLoading ? (
				<Spinner className="mx-auto" />
			) : myAds.length === 0 ? (
				<EmptyState
					title="Ainda não publicou anúncios"
					description="Crie o seu primeiro anúncio e comece a vender, trocar ou doar entre vizinhos."
					action={<Button to="/anuncios/novo">Criar anúncio</Button>}
				/>
			) : (
				<div className="space-y-3">
					{myAds.map((ad) => (
						<Card
							key={ad.id}
							className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
						>
							<div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
								{ad.image ? (
									<img
										src={ad.image}
										alt=""
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-xs text-slate-300">
										Sem imagem
									</div>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<h3 className="truncate font-medium text-slate-800">
										{ad.title}
									</h3>
									<Badge tone="neutral">
										{AD_TYPE_LABELS[ad.type]}
									</Badge>
									<Badge
										tone={
											ad.status === 'ACTIVE'
												? 'success'
												: 'warning'
										}
									>
										{AD_STATUS_LABELS[ad.status]}
									</Badge>
									{ad.featured && (
										<Badge tone="accent">Destaque</Badge>
									)}
									{ad.visibility === 'HIDDEN' && (
										<Badge tone="neutral">Oculto</Badge>
									)}
								</div>
								<p className="mt-1 font-mono text-sm font-semibold text-slate-900">
									{ad.type === 'DONATION'
										? 'Doação'
										: ad.price != null
											? formatKz(ad.price)
											: '—'}
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button
									to={`/anuncios/${ad.slug}`}
									size="sm"
									variant="outline"
								>
									Ver
								</Button>
								<Button
									to={`/anuncios/${ad.slug}/editar`}
									size="sm"
									variant="outline"
								>
									<FaPencilAlt className="h-3 w-3" /> Editar
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleToggleVisibility(ad)}
									title={
										ad.visibility === 'VISIBLE'
											? 'Ocultar'
											: 'Tornar visível'
									}
								>
									{ad.visibility === 'VISIBLE' ? (
										<FaEye className="h-3 w-3" />
									) : (
										<FaEyeSlash className="h-3 w-3" />
									)}
								</Button>
								<Button
									size="sm"
									variant={ad.featured ? 'outline' : 'ghost'}
									onClick={() => handleToggleFeature(ad)}
									title={
										ad.featured
											? 'Remover destaque'
											: 'Destacar'
									}
								>
									<FaStar
										className={
											ad.featured
												? 'h-3 w-3 text-amber-400'
												: 'h-3 w-3'
										}
									/>
								</Button>
								<Button
									size="sm"
									variant="danger"
									onClick={() => handleDelete(ad)}
									disabled={deletingId === ad.id}
								>
									<FaTrash className="h-3 w-3" />
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
