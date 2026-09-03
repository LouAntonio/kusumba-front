import { useParams, useNavigate } from 'react-router-dom';
import { useAd } from '../hooks/useAds';
import { useAuthStore } from '../store/authStore';
import { AdForm } from '../components/ads/AdForm';
import { Card } from '../components/ui/Card';
import { LoadingScreen } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function EditAdPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const { data: ad, isLoading } = useAd(slug);

	if (isLoading) {
		return <LoadingScreen label="A carregar anúncio…" />;
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
		<div className="mx-auto max-w-2xl space-y-6">
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
