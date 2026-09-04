import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { signUp, signInWithGoogleIdToken } from '../lib/auth';
import { getApiError } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Logo } from '../components/layout/Logo';
import { PROVINCES } from '../lib/provinces';

export function RegisterPage() {
	const navigate = useNavigate();
	const setUser = useAuthStore((s) => s.setUser);
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [province, setProvince] = useState('');
	const [accepted, setAccepted] = useState(false);

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
		if (!accepted) {
			toast.error(
				'Precisa de aceitar os Termos e a Política de Privacidade.',
			);
			return;
		}
		setSubmitting(true);
		try {
			const session = await signUp(
				name.trim(),
				surname.trim(),
				email.trim(),
				password,
				province,
			);
			setUser(session?.user ?? null);
			toast.success('Conta criada com sucesso!');
			navigate('/anuncios');
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSubmitting(false);
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
					Criar conta na Kusumba
				</h1>
				<p className="text-center text-sm text-muted">
					Compre, venda, troque e doe entre vizinhos.
				</p>
			</div>

			<div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="mb-4 flex w-full justify-center">
					<GoogleLogin
						onSuccess={(res) => handleGoogleSuccess(res.credential)}
						onError={() =>
							toast.error(
								'Não foi possível criar conta com o Google.',
							)
						}
						shape="pill"
						text="signup_with"
						theme="outline"
						width={340}
					/>
				</div>

				<div className="my-5 flex items-center gap-3 text-xs text-muted">
					<span className="h-px flex-1 bg-slate-200" />
					ou criar conta com email
					<span className="h-px flex-1 bg-slate-200" />
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<Input
						label="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="O seu nome"
						autoComplete="given-name"
						required
					/>
					<Input
						label="Sobrenome"
						value={surname}
						onChange={(e) => setSurname(e.target.value)}
						placeholder="O seu sobrenome"
						autoComplete="family-name"
						required
					/>
					<Input
						type="email"
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="voce@exemplo.com"
						autoComplete="email"
						required
					/>
					<Input
						type="password"
						label="Senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Mínimo 8 caracteres"
						autoComplete="new-password"
						minLength={8}
						required
					/>
					<Input
						type="password"
						label="Confirmar senha"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="Repita a senha"
						autoComplete="new-password"
						required
					/>
					<Select
						label="Província"
						value={province}
						onChange={(e) => setProvince(e.target.value)}
						options={[
							{ value: '', label: 'Selecione a sua província' },
							...PROVINCES.map((p) => ({
								value: p,
								label: p,
							})),
						]}
						required
					/>
					<div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm">
						<label className="flex cursor-pointer items-start gap-2.5">
							<input
								type="checkbox"
								checked={accepted}
								onChange={(e) => setAccepted(e.target.checked)}
								className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
								required
							/>
							<span className="text-slate-700">
								Aceito os{' '}
								<Link
									to="/termos"
									target="_blank"
									className="font-medium text-primary-600 hover:underline"
								>
									Termos e Condições
								</Link>{' '}
								e a{' '}
								<Link
									to="/politicas"
									target="_blank"
									className="font-medium text-primary-600 hover:underline"
								>
									Política de Privacidade
								</Link>
								.
							</span>
						</label>
					</div>
					<Button
						type="submit"
						variant="primary"
						disabled={
							submitting ||
							!name ||
							!surname ||
							!email ||
							!password ||
							!accepted
						}
						fullWidth
					>
						{submitting ? 'A criar conta…' : 'Criar conta'}
					</Button>
				</form>
			</div>

			<p className="text-center text-sm text-muted">
				Já tem uma conta?{' '}
				<Link
					to="/entrar"
					className="font-medium text-primary-600 hover:underline"
				>
					Entrar
				</Link>
			</p>

			<p className="text-center text-xs text-muted">
				Ao criar a conta, concorda com os termos de uso e a política de
				comunidade da Kusumba.
			</p>
		</div>
	);
}
