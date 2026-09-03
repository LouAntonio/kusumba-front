import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLink, FaExclamationTriangle } from 'react-icons/fa';
import { verifyMagicLink, getSession } from '../lib/auth';
import { getApiError } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/layout/Logo';
import { Spinner } from '../components/ui/Spinner';

export function MagicCallbackPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const setUser = useAuthStore((s) => s.setUser);
	const token = searchParams.get('token');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			return;
		}

		let active = true;
		verifyMagicLink(token)
			.then(() => getSession())
			.then((session) => {
				if (!active) {
					return;
				}
				setUser(session?.user ?? null);
				navigate('/anuncios', { replace: true });
			})
			.catch((err) => {
				if (active) {
					setError(getApiError(err));
				}
			});

		return () => {
			active = false;
		};
	}, [token, setUser, navigate]);

	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10">
			<div className="flex flex-col items-center gap-3">
				<Logo className="h-10" />
				<h1 className="text-center font-display text-2xl">A entrar…</h1>
			</div>

			<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				{!token ? (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<FaExclamationTriangle className="h-8 w-8 text-red-500" />
						<h2 className="font-display text-lg">
							Link inválido ou expirado
						</h2>
						<p className="text-sm text-muted">
							O link de acesso é inválido ou está incompleto.
						</p>
						<Button to="/entrar" variant="primary" size="md">
							<FaLink className="h-4 w-4" />
							Pedir novo link
						</Button>
					</div>
				) : !error ? (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<Spinner size="lg" />
						<p className="text-sm text-muted">
							A confirmar o seu link de acesso…
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<FaExclamationTriangle className="h-8 w-8 text-red-500" />
						<h2 className="font-display text-lg">
							Link inválido ou expirado
						</h2>
						<p className="text-sm text-muted">{error}</p>
						<Button to="/entrar" variant="primary" size="md">
							<FaLink className="h-4 w-4" />
							Pedir novo link
						</Button>
					</div>
				)}
			</div>

			<Link
				to="/entrar"
				className="text-sm font-medium text-primary-600 hover:underline"
			>
				Voltar para o início de sessão
			</Link>
		</div>
	);
}
