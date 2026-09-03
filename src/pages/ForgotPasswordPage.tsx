import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { forgotPassword } from '../lib/auth';
import { getApiError } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/layout/Logo';

export function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSending(true);
		try {
			await forgotPassword(email);
			setSent(true);
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10">
			<div className="flex flex-col items-center gap-3">
				<Logo className="h-10" />
				<h1 className="text-center font-display text-2xl">
					Recuperar a sua conta
				</h1>
				<p className="text-center text-sm text-muted">
					Indique o email associado à sua conta e enviaremos um link
					para redefinir a senha.
				</p>
			</div>

			<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				{!sent ? (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<Input
							type="email"
							label="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="voce@exemplo.com"
							autoComplete="email"
							required
						/>
						<Button
							type="submit"
							variant="primary"
							disabled={sending || !email}
							fullWidth
						>
							<FaLock className="h-4 w-4" />
							{sending
								? 'A enviar…'
								: 'Enviar link de redefinição'}
						</Button>
					</form>
				) : (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<FaLock className="h-8 w-8 text-primary-500" />
						<h2 className="font-display text-lg">
							Verifique o seu email
						</h2>
						<p className="text-sm text-muted">
							Se existir uma conta com{' '}
							<span className="font-medium text-slate-800">
								{email}
							</span>
							, enviámos um link para redefinir a senha.
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

			<Link
				to="/entrar"
				className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline"
			>
				<FaArrowLeft className="h-3 w-3" />
				Voltar para o início de sessão
			</Link>
		</div>
	);
}
