import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { FaEnvelope } from 'react-icons/fa';
import { requestMagicLink, signInWithGoogleIdToken } from '../lib/auth';
import { getApiError } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/layout/Logo';

export function LoginPage() {
	const navigate = useNavigate();
	const setUser = useAuthStore((s) => s.setUser);
	const [email, setEmail] = useState('');
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);

	const handleMagicLink = async (e: React.FormEvent) => {
		e.preventDefault();
		setSending(true);
		try {
			await requestMagicLink(email);
			setSent(true);
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSending(false);
		}
	};

	const handleGoogleSuccess = async (credential?: string) => {
		if (!credential) {
			toast.error('Não foi possível obter a credencial do Google.');
			return;
		}
		try {
			const session = await signInWithGoogleIdToken(credential);
			setUser(session.user);
			toast.success(`Bem-vindo, ${session.user.name}!`);
			navigate('/anuncios');
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10">
			<div className="flex flex-col items-center gap-3">
				<Logo className="h-10" />
				<h1 className="text-center font-display text-2xl">
					Entrar na Kusumba
				</h1>
				<p className="text-center text-sm text-muted">
					A comunidade de compra, venda, troca e doação entre
					vizinhos.
				</p>
			</div>

			<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				{!sent ? (
					<>
						<div className="mb-4 w-full">
							<GoogleLogin
								onSuccess={(res) =>
									handleGoogleSuccess(res.credential)
								}
								onError={() =>
									toast.error(
										'Não foi possível entrar com o Google.',
									)
								}
								shape="pill"
								text="continue_with"
								theme="outline"
								width={340}
							/>
						</div>

						<div className="my-5 flex items-center gap-3 text-xs text-muted">
							<span className="h-px flex-1 bg-slate-200" />
							ou continuar com email
							<span className="h-px flex-1 bg-slate-200" />
						</div>

						<form
							onSubmit={handleMagicLink}
							className="flex flex-col gap-4"
						>
							<Input
								type="email"
								label="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="voce@exemplo.com"
								required
							/>
							<Button
								type="submit"
								variant="primary"
								disabled={sending || !email}
								fullWidth
							>
								<FaEnvelope className="h-4 w-4" />
								{sending
									? 'A enviar…'
									: 'Enviar link de acesso'}
							</Button>
						</form>
					</>
				) : (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<FaEnvelope className="h-8 w-8 text-primary-500" />
						<h2 className="font-display text-lg">
							Verifique o seu email
						</h2>
						<p className="text-sm text-muted">
							Enviámos um link de acesso para{' '}
							<span className="font-medium text-slate-800">
								{email}
							</span>
							. Abra-o para entrar.
						</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSent(false)}
						>
							Usar outro email
						</Button>
					</div>
				)}
			</div>

			<p className="text-center text-xs text-muted">
				Ao entrar, concorda com os termos de uso e a política de
				comunidade da Kusumba.
			</p>
		</div>
	);
}
