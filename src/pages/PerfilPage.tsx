import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaPhone, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useMe } from '../hooks/useUsers';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../api/users';
import { getApiError } from '../lib/axios';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LoadingScreen } from '../components/ui/Spinner';
import { formatKz } from '../lib/format';

export function PerfilPage() {
	const user = useAuthStore((s) => s.user);
	const { data: me, isLoading } = useMe();
	const [editing, setEditing] = useState(false);

	const [name, setName] = useState(me?.name ?? user?.name ?? '');
	const [surname, setSurname] = useState(me?.surname ?? '');
	const [phone, setPhone] = useState(me?.phone ?? '');
	const [neighborhood, setNeighborhood] = useState(me?.neighborhood ?? '');
	const [city, setCity] = useState(me?.city ?? 'Luanda');
	const [saving, setSaving] = useState(false);

	if (isLoading) {
		return <LoadingScreen label="A carregar o perfil…" />;
	}

	const profile = me ?? user;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await updateProfile({
				name,
				surname,
				phone: phone || undefined,
				neighborhood: neighborhood || undefined,
				city: city || undefined,
			});
			toast.success('Perfil atualizado!');
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
								<FaPhone className="h-3.5 w-3.5" />
								{profile.phone}
							</span>
						)}
						{typeof profile?.trustScore === 'number' && (
							<span className="inline-flex items-center gap-1.5 text-muted">
								<FaStar className="h-3.5 w-3.5 text-amber-400" />
								Confiança{' '}
								{formatKz(Math.round(profile.trustScore))}
							</span>
						)}
					</div>
				</div>
				{!editing && (
					<Button variant="outline" onClick={() => setEditing(true)}>
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
								label="Apelido"
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
		</div>
	);
}
