import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { resetPassword } from '../lib/auth';
import { getApiError } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/layout/Logo';

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [submitting, setSubmitting] = useState(false);

	if (!token) {
		return (
			<div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10">
				<div className="flex flex-col items-center gap-3">
					<Logo className="h-10" />
					<h1 className="text-center font-display text-2xl">
						Link inválido
					</h1>
				</div>
				<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
					<FaExclamationTriangle className="mx-auto h-8 w-8 text-red-500" />
					<p className="mt-3 text-sm text-muted">
						O link de redefinição está incompleto ou expirou. Peça
						um novo link para redefinir a sua senha.
					</p>
					<Button
						to="/esqueci-a-senha"
						variant="primary"
						fullWidth
						className="mt-4"
					>
						Pedir novo link
					</Button>
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password.length < 8) {
			toast.error('A senha deve ter pelo menos 8 caracteres.');
			return;
		}
		if (password !== confirm) {
			toast.error('As senhas não coincidem.');
			return;
		}
		setSubmitting(true);
		try {
			await resetPassword(token, password);
			toast.success('Senha redefinida com sucesso!');
			navigate('/entrar');
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10">
			<div className="flex flex-col items-center gap-3">
				<Logo className="h-10" />
				<h1 className="text-center font-display text-2xl">
					Definir nova senha
				</h1>
				<p className="text-center text-sm text-muted">
					Escolha uma nova senha para a sua conta.
				</p>
			</div>

			<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Input
						type="password"
						label="Nova senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Mínimo 8 caracteres"
						autoComplete="new-password"
						minLength={8}
						required
					/>
					<Input
						type="password"
						label="Confirmar nova senha"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="Repita a nova senha"
						autoComplete="new-password"
						required
					/>
					<Button
						type="submit"
						variant="primary"
						disabled={submitting || !password}
						fullWidth
					>
						<FaLock className="h-4 w-4" />
						{submitting ? 'A guardar…' : 'Redefinir senha'}
					</Button>
				</form>
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
