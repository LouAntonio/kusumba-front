import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import {
	FaCheckCircle,
	FaPhone,
	FaMapMarkerAlt,
	FaEnvelope,
	FaLock,
	FaGoogle,
} from 'react-icons/fa';
import { useMe } from '../hooks/useUsers';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../api/users';
import {
	changePassword,
	setPassword,
	changeEmail,
	linkGoogleWithIdToken,
	unlinkGoogle,
} from '../lib/auth';
import { getApiError } from '../lib/axios';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LoadingScreen } from '../components/ui/Spinner';
import { SessionsSection } from '../components/auth/SessionsSection';

export function PerfilPage() {
	const qc = useQueryClient();
	const user = useAuthStore((s) => s.user);
	const setUser = useAuthStore((s) => s.setUser);
	const { data: me, isLoading } = useMe();
	const [editing, setEditing] = useState(false);

	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [phone, setPhone] = useState('');
	const [neighborhood, setNeighborhood] = useState('');
	const [city, setCity] = useState('Luanda');
	const [saving, setSaving] = useState(false);

	const linkedGoogle = me?.accounts?.find(
		(acc) => acc.providerId === 'google',
	);
	const hasPassword = me?.hasPassword === true;
	const passwordMode: 'set' | 'change' = hasPassword ? 'change' : 'set';

	const [newEmail, setNewEmail] = useState('');
	const [sendingEmail, setSendingEmail] = useState(false);

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [sendingPassword, setSendingPassword] = useState(false);

	const [unlinkingGoogle, setUnlinkingGoogle] = useState(false);

	useEffect(() => {
		if (me) {
			setUser(me);
		}
	}, [me, setUser]);

	const openEditing = () => {
		setName(me?.name ?? user?.name ?? '');
		setSurname(me?.surname ?? '');
		setPhone(me?.phone ?? '');
		setNeighborhood(me?.neighborhood ?? '');
		setCity(me?.city ?? 'Luanda');
		setEditing(true);
	};

	const refreshMe = () => {
		void qc.invalidateQueries({ queryKey: ['me'] });
	};

	const handleChangeEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newEmail.trim()) return;
		setSendingEmail(true);
		try {
			await changeEmail(newEmail.trim());
			toast.success('Enviámos um link de confirmação para o novo email.');
			setNewEmail('');
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSendingEmail(false);
		}
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword.length < 8) {
			toast.error('A nova senha deve ter pelo menos 8 caracteres.');
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error('As senhas não coincidem.');
			return;
		}
		setSendingPassword(true);
		try {
			if (hasPassword) {
				await changePassword(currentPassword, newPassword);
			} else {
				await setPassword(newPassword);
			}
			toast.success('Senha atualizada com sucesso!');
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
			refreshMe();
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSendingPassword(false);
		}
	};

	const handleGoogleSuccess = async (credential?: string) => {
		if (!credential) {
			toast.error('Não foi possível obter a credencial do Google.');
			return;
		}
		try {
			await linkGoogleWithIdToken(credential);
			toast.success('Conta Google vinculada com sucesso!');
			refreshMe();
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	const handleUnlinkGoogle = async () => {
		if (!linkedGoogle) return;
		if (!window.confirm('Deseja desvincular a sua conta Google?')) return;
		setUnlinkingGoogle(true);
		try {
			await unlinkGoogle(linkedGoogle.id);
			toast.success('Conta Google desvinculada.');
			refreshMe();
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setUnlinkingGoogle(false);
		}
	};

	if (isLoading) {
		return <LoadingScreen label="A carregar o perfil…" />;
	}

	const profile = me ?? user;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const updated = await updateProfile({
				name,
				surname,
				phone: phone || undefined,
				neighborhood: neighborhood || undefined,
				city: city || undefined,
			});
			toast.success('Perfil atualizado!');
			setUser(updated);
			refreshMe();
			setEditing(false);
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
				<Avatar
					image={profile?.image}
					name={profile?.name ?? 'U'}
					size="xl"
				/>
				<div className="flex-1 text-center sm:text-left">
					<div className="flex items-center justify-center gap-2 sm:justify-start">
						<h1 className="font-display text-2xl">
							{profile?.name} {profile?.surname}
						</h1>
						{profile?.isVerified && (
							<FaCheckCircle
								className="h-5 w-5 text-primary-500"
								title="Utilizador verificado"
							/>
						)}
					</div>
					<p className="text-muted">{profile?.email}</p>
					<div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
						{profile?.subscriptionTier === 'KUSUMBA_PASS' && (
							<Badge tone="accent">Kusumba Pass</Badge>
						)}
						{profile?.neighborhood && (
							<span className="inline-flex items-center gap-1 text-sm text-muted">
								<FaMapMarkerAlt className="h-3.5 w-3.5" />
								{profile.neighborhood}, {profile.city}
							</span>
						)}
					</div>
					<div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
						{profile?.phone && (
							<span className="inline-flex items-center gap-1.5 text-muted">
								<FaPhone
									className="h-3.5 w-3.5"
									style={{ transform: 'rotate(100deg)' }}
								/>
								{profile.phone}
							</span>
						)}
					</div>
				</div>
				{!editing && (
					<Button variant="outline" onClick={openEditing}>
						Editar perfil
					</Button>
				)}
			</div>

			{editing && (
				<Card className="p-6">
					<h2 className="mb-4 font-display text-lg">Editar perfil</h2>
					<form onSubmit={handleSave} className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								label="Nome"
								value={name}
								onChange={(e) =>
									setName(e.target.value.slice(0, 120))
								}
								required
							/>
							<Input
								label="Sobrenome"
								value={surname}
								onChange={(e) =>
									setSurname(e.target.value.slice(0, 120))
								}
								required
							/>
							<Input
								label="Telefone"
								value={phone ?? ''}
								onChange={(e) =>
									setPhone(e.target.value.slice(0, 40))
								}
								placeholder="+244…"
							/>
							<Input
								label="Bairro"
								value={neighborhood ?? ''}
								onChange={(e) =>
									setNeighborhood(
										e.target.value.slice(0, 120),
									)
								}
								placeholder="Ex.: Maianga"
							/>
							<Input
								label="Cidade"
								value={city ?? 'Luanda'}
								onChange={(e) =>
									setCity(e.target.value.slice(0, 120))
								}
							/>
						</div>
						<div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? 'A guardar…' : 'Guardar'}
							</Button>
						</div>
					</form>
				</Card>
			)}

			<Card className="p-6">
				<h2 className="mb-5 flex items-center gap-2 font-display text-lg">
					<FaLock className="h-4 w-4 text-primary-500" />
					Conta e Segurança
				</h2>

				<div className="space-y-6">
					<div className="space-y-3 border-b border-slate-200 pb-6">
						<h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
							<FaEnvelope className="h-4 w-4 text-primary-500" />
							Email
						</h3>
						<p className="text-sm text-muted">
							Email atual:{' '}
							<span className="font-medium text-slate-800">
								{profile?.email}
							</span>
						</p>
						<form
							onSubmit={handleChangeEmail}
							className="flex flex-col gap-3 sm:flex-row"
						>
							<Input
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								placeholder="novo@email.com"
								autoComplete="email"
								className="sm:max-w-xs"
							/>
							<Button
								type="submit"
								variant="outline"
								disabled={sendingEmail || !newEmail.trim()}
							>
								{sendingEmail ? 'A enviar…' : 'Alterar email'}
							</Button>
						</form>
						<p className="text-xs text-muted">
							Enviaremos um link de confirmação para o novo
							endereço.
						</p>
					</div>

					<div className="border-b border-slate-200 pb-6">
						<h3 className="mb-3 text-sm font-semibold text-slate-800">
							Senha
						</h3>
						<p className="mb-3 text-sm text-muted">
							{hasPassword
								? 'Atualize a senha da sua conta.'
								: 'Ainda não definiu uma senha. Crie uma para entrar com email e senha.'}
						</p>
						<form
							onSubmit={handlePasswordSubmit}
							className="grid gap-3 sm:grid-cols-2"
						>
							{passwordMode === 'change' && (
								<Input
									type="password"
									label="Senha atual"
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									autoComplete="current-password"
									required
								/>
							)}
							<Input
								type="password"
								label="Nova senha"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								autoComplete="new-password"
								required
							/>
							<Input
								type="password"
								label="Confirmar nova senha"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								autoComplete="new-password"
								required
							/>
							<div className="sm:col-span-2">
								<Button
									type="submit"
									variant="primary"
									disabled={
										sendingPassword ||
										!newPassword ||
										!confirmPassword
									}
								>
									{sendingPassword
										? 'A guardar…'
										: hasPassword
											? 'Alterar senha'
											: 'Definir senha'}
								</Button>
							</div>
						</form>
					</div>

					<div>
						<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
							<FaGoogle className="h-4 w-4 text-primary-500" />
							Conta Google
						</h3>
						{linkedGoogle ? (
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm text-muted">
									A sua conta Google está vinculada.
								</p>
								<Button
									variant="outline"
									onClick={handleUnlinkGoogle}
									disabled={unlinkingGoogle}
								>
									{unlinkingGoogle
										? 'A desvincular…'
										: 'Desvincular'}
								</Button>
							</div>
						) : (
							<div>
								<p className="mb-3 text-sm text-muted">
									Vincule a sua conta Google para entrar mais
									rapidamente.
								</p>
								<GoogleLogin
									onSuccess={(res) =>
										handleGoogleSuccess(res.credential)
									}
									onError={() =>
										toast.error(
											'Não foi possível vincular o Google.',
										)
									}
									shape="pill"
									text="continue_with"
									theme="outline"
								/>
								{!hasPassword && !linkedGoogle && (
									<p className="mt-2 text-xs text-muted">
										Sem senha ativa, vincular o Google ajuda
										a não perder o acesso à conta.
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</Card>

			<SessionsSection />
		</div>
	);
}
