import { useParams, useNavigate } from 'react-router-dom';
import { useAd } from '../hooks/useAds';
import { useAuthStore } from '../store/authStore';
import { AdForm } from '../components/ads/AdForm';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function EditAdPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const { data: ad, isLoading } = useAd(slug);

	if (isLoading) {
		return (
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-7 w-52" />
					<Skeleton className="h-4 w-72" />
				</div>
				<div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
					<div className="space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div className="space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div className="space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<Skeleton className="h-10 w-32 rounded-lg" />
				</div>
			</div>
		);
	}

	if (!ad) {
		return (
			<div className="mx-auto max-w-xl py-16 text-center">
				<h1 className="font-display text-xl">Anúncio não encontrado</h1>
				<p className="mt-2 text-muted">
					Não conseguimos encontrar este anúncio.
				</p>
			</div>
		);
	}

	if (user?.id !== ad.user?.id) {
		return (
			<div className="mx-auto max-w-xl py-16 text-center">
				<h1 className="font-display text-xl">Sem permissão</h1>
				<p className="mt-2 text-muted">
					Só o dono do anúncio pode editá-lo.
				</p>
				<div className="mt-4">
					<Button to={`/anuncios/${ad.slug}`}>Ver anúncio</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<div>
				<h1 className="font-display text-2xl">Editar anúncio</h1>
				<p className="text-sm text-muted">
					Atualize as informações do seu anúncio.
				</p>
			</div>
			<Card className="p-6">
				<AdForm
					initial={ad}
					onSave={() => navigate(`/perfil/anuncios`)}
				/>
			</Card>
		</div>
	);
}
