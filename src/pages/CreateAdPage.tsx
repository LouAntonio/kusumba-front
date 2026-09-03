import { useAuthStore } from '../store/authStore';
import { AdForm } from '../components/ads/AdForm';
import { Navigate } from 'react-router-dom';

export function CreateAdPage() {
	const user = useAuthStore((s) => s.user);
	if (!user) {
		return <Navigate to="/entrar" replace />;
	}
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="font-display text-2xl">Criar anúncio</h1>
				<p className="text-sm text-muted">
					Publique o que quer vender, trocar ou doar entre vizinhos.
				</p>
			</div>
			<AdForm />
		</div>
	);
}
