import { useAuthStore } from '../store/authStore';
import { useMe } from '../hooks/useUsers';
import { AdForm } from '../components/ads/AdForm';
import { Navigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FaShieldAlt } from 'react-icons/fa';

export function CreateAdPage() {
	const user = useAuthStore((s) => s.user);
	const { data: me, isLoading } = useMe();

	if (!user) {
		return <Navigate to="/entrar" replace />;
	}

	if (isLoading) {
		return (
			<div className="mx-auto max-w-2xl text-center text-muted">
				A verificar a identidade…
			</div>
		);
	}

	const verified = me?.kyc?.status === 'APPROVED';

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="font-display text-2xl">Criar anúncio</h1>
				<p className="text-sm text-muted">
					Publique o que quer vender, trocar ou doar entre vizinhos.
				</p>
			</div>
			{verified ? (
				<AdForm />
			) : (
				<Card className="flex flex-col items-center gap-4 p-8 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
						<FaShieldAlt className="h-6 w-6" />
					</div>
					<h2 className="font-display text-xl">
						Verifique a sua identidade primeiro
					</h2>
					<p className="max-w-md text-sm text-muted">
						Para garantir a confiança na comunidade, é necessário
						comprovar a sua identidade (KYC) antes de publicar um
						anúncio.
					</p>
					<Button to="/perfil/kyc">Concluir verificação</Button>
					<Link
						to="/anuncios"
						className="text-sm font-medium text-primary-600 hover:underline"
					>
						Voltar a explorar
					</Link>
				</Card>
			)}
		</div>
	);
}
