import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
	FaHeart,
	FaCommentDots,
	FaPlus,
	FaUser,
	FaBars,
	FaSearch,
	FaSignOutAlt,
	FaTimes,
	FaChevronDown,
	FaCheck,
	FaBoxOpen,
	FaShieldAlt,
	FaCrown,
	FaCreditCard,
	FaFlag,
	FaGavel,
	FaMoneyBillAlt,
	FaCompass,
	FaEnvelope,
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { signOut } from '../../lib/auth';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { type AdType } from '../../lib/types';

const AD_TYPE_OPTIONS: Array<{ value: '' | AdType; label: string }> = [
	{ value: '', label: 'Todos' },
	{ value: 'SALE', label: 'Venda' },
	{ value: 'TRADE', label: 'Troca' },
	{ value: 'DONATION', label: 'Doação' },
];

export function Navbar() {
	const user = useAuthStore((s) => s.user);
	const [menuOpen, setMenuOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const initialQuery = params.get('q') ?? '';
	const initialType = params.get('type') ?? '';
	const [query, setQuery] = useState(initialQuery);
	const [adType, setAdType] = useState(initialType);

	const submitSearch = (q: string, type: string) => {
		const trimmed = q.trim();
		if (!trimmed && !type) {
			navigate('/anuncios');
			return;
		}
		const searchParams = new URLSearchParams();
		if (trimmed) {
			searchParams.set('q', trimmed);
		}
		if (type) {
			searchParams.set('type', type);
		}
		navigate(
			trimmed
				? `/procurar?${searchParams.toString()}`
				: `/anuncios?${searchParams.toString()}`,
		);
	};

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
				<Link to="/" className="shrink-0">
					<Logo />
				</Link>

				<div className="hidden flex-1 sm:flex">
					<SearchField
						value={query}
						type={adType}
						onChange={setQuery}
						onTypeChange={setAdType}
						onSubmit={submitSearch}
					/>
				</div>

				<nav className="ml-auto hidden items-center gap-1 md:flex">
					<Link
						to="/anuncios"
						className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					>
						Explorar
					</Link>
					<Link
						to="/como-funciona"
						className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					>
						Como funciona
					</Link>
					<Link
						to="/contacto"
						className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					>
						Contacto
					</Link>
					{user && (
						<>
							<Link
								to="/anuncios/novo"
								className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
							>
								Criar
							</Link>
							<Link
								to="/perfil/favoritos"
								className="inline-flex items-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
								title="Favoritos"
							>
								<FaHeart className="h-4 w-4" />
							</Link>
							<Link
								to="/mensagens"
								className="inline-flex items-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
								title="Mensagens"
							>
								<FaCommentDots className="h-4 w-4" />
							</Link>
							<div className="relative">
								<button
									onClick={() => setMenuOpen((v) => !v)}
									className="ml-1 rounded-full"
									aria-label="Menu do perfil"
								>
									<Avatar
										image={user.image}
										name={user.name}
										size="sm"
									/>
								</button>
								{menuOpen && (
									<div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
										<ProfileMenuItems
											onClose={() => setMenuOpen(false)}
										/>
									</div>
								)}
							</div>
						</>
					)}
					{!user && (
						<Button to="/entrar" variant="accent" size="sm">
							Entrar
						</Button>
					)}
				</nav>

				<button
					className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
					onClick={() => setMobileOpen((v) => !v)}
					aria-label="Abrir menu"
				>
					<FaBars className="h-5 w-5" />
				</button>
			</div>

			{mobileOpen && (
				<div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
					<MobileMenuItems
						user={user}
						onClose={() => setMobileOpen(false)}
					/>
				</div>
			)}
		</header>
	);
}

function ProfileMenuItems({ onClose }: { onClose: () => void }) {
	const user = useAuthStore((s) => s.user);
	const clear = useAuthStore((s) => s.clear);
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);

	const handleSignOut = async () => {
		setSigningOut(true);
		onClose();
		try {
			await signOut();
		} catch {
			// ignore - clear local session regardless
		}
		clear();
		navigate('/');
	};
	if (!user) {
		return (
			<Link
				to="/entrar"
				onClick={onClose}
				className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				<FaUser className="h-4 w-4" /> Entrar
			</Link>
		);
	}

	return (
		<>
			<div className="border-b border-slate-100 px-4 py-2">
				<p className="truncate text-sm font-semibold text-slate-800">
					{user.name} {user.surname}
				</p>
				<p className="truncate text-xs text-muted">{user.email}</p>
			</div>
			<Link
				to="/perfil"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Meu perfil
			</Link>
			<Link
				to="/perfil/anuncios"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Meus anúncios
			</Link>
			<Link
				to="/perfil/favoritos"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Favoritos
			</Link>
			<Link
				to="/perfil/compras"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Minhas compras
			</Link>
			<Link
				to="/perfil/kyc"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Verificação
			</Link>
			<Link
				to="/planos"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Kusumba Pass
			</Link>
			<Link
				to="/assinatura"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Minha assinatura
			</Link>
			<Link
				to="/perfil/denuncias"
				onClick={onClose}
				className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
			>
				Minhas denúncias
			</Link>
			{(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
				<Link
					to="/denuncias"
					onClick={onClose}
					className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
				>
					Moderação
				</Link>
			)}
			<div className="border-t border-slate-100 py-1">
				<button
					onClick={handleSignOut}
					disabled={signingOut}
					className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
				>
					<FaSignOutAlt className="h-4 w-4" />
					{signingOut ? 'A sair…' : 'Sair'}
				</button>
			</div>
		</>
	);
}

function MobileMenuItems({
	user,
	onClose,
}: {
	user: ReturnType<typeof useAuthStore.getState>['user'];
	onClose: () => void;
}) {
	const clear = useAuthStore((s) => s.clear);
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);
	const [mobileQuery, setMobileQuery] = useState('');
	const [mobileType, setMobileType] = useState('');

	const handleSignOut = async () => {
		setSigningOut(true);
		try {
			await signOut();
		} catch {
			// ignore - clear local session regardless
		}
		clear();
		onClose();
		navigate('/');
	};

	const submitMobileSearch = (q: string, type: string) => {
		const trimmed = q.trim();
		if (!trimmed && !type) {
			navigate('/anuncios');
			return;
		}
		const searchParams = new URLSearchParams();
		if (trimmed) {
			searchParams.set('q', trimmed);
		}
		if (type) {
			searchParams.set('type', type);
		}
		navigate(
			trimmed
				? `/procurar?${searchParams.toString()}`
				: `/anuncios?${searchParams.toString()}`,
		);
		onClose();
	};

	return (
		<nav className="flex flex-col gap-1">
			<SearchField
				value={mobileQuery}
				type={mobileType}
				onChange={setMobileQuery}
				onTypeChange={setMobileType}
				onSubmit={submitMobileSearch}
			/>
			<Link
				to="/anuncios"
				className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
			>
				Explorar
			</Link>
			<Link
				to="/como-funciona"
				onClick={onClose}
				className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
			>
				<FaCompass className="h-4 w-4" /> Como funciona
			</Link>
			<Link
				to="/contacto"
				onClick={onClose}
				className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
			>
				<FaEnvelope className="h-4 w-4" /> Contacto
			</Link>
			{user ? (
				<>
					<Link
						to="/anuncios/novo"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaPlus className="h-4 w-4" /> Criar anúncio
					</Link>
					<Link
						to="/mensagens"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaCommentDots className="h-4 w-4" /> Mensagens
					</Link>
					<Link
						to="/perfil"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaUser className="h-4 w-4" /> Meu perfil
					</Link>
					<Link
						to="/perfil/anuncios"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaBoxOpen className="h-4 w-4" /> Meus anúncios
					</Link>
					<Link
						to="/perfil/favoritos"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaHeart className="h-4 w-4" /> Favoritos
					</Link>
					<Link
						to="/perfil/compras"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaMoneyBillAlt className="h-4 w-4" /> Minhas compras
					</Link>
					<Link
						to="/perfil/kyc"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaShieldAlt className="h-4 w-4" /> Verificação
					</Link>
					<Link
						to="/planos"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaCrown className="h-4 w-4" /> Kusumba Pass
					</Link>
					<Link
						to="/assinatura"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaCreditCard className="h-4 w-4" /> Minha assinatura
					</Link>
					<Link
						to="/perfil/denuncias"
						onClick={onClose}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaFlag className="h-4 w-4" /> Minhas denúncias
					</Link>
					{(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
						<Link
							to="/denuncias"
							onClick={onClose}
							className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
						>
							<FaGavel className="h-4 w-4" /> Moderação
						</Link>
					)}
					<button
						onClick={handleSignOut}
						disabled={signingOut}
						className="mt-1 flex items-center gap-2 rounded-lg border-t border-slate-100 px-3 py-2 pt-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
					>
						<FaSignOutAlt className="h-4 w-4" />{' '}
						{signingOut ? 'A sair…' : 'Sair'}
					</button>
				</>
			) : (
				<Link
					to="/entrar"
					className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-white hover:bg-accent-dark"
				>
					Entrar
				</Link>
			)}
		</nav>
	);
}

function SearchField({
	value,
	type,
	onChange,
	onTypeChange,
	onSubmit,
}: {
	value: string;
	type: string;
	onChange: (value: string) => void;
	onTypeChange: (value: string) => void;
	onSubmit: (value: string, type: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const activeLabel =
		AD_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
		'Todos';

	return (
		<form
			className="relative w-full"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(value, type);
			}}
			role="search"
		>
			<div className="flex h-10 w-full items-center rounded-full border border-slate-200 bg-white pr-9">
				<div className="relative shrink-0">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-haspopup="listbox"
						aria-expanded={open}
						aria-label="Filtrar por tipo de anúncio"
						className="flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
					>
						{activeLabel}
						<FaChevronDown
							className={`h-3 w-3 text-slate-400 transition-transform ${
								open ? 'rotate-180' : ''
							}`}
						/>
					</button>

					{open && (
						<>
							<div
								className="fixed inset-0 z-10"
								aria-hidden
								onClick={() => setOpen(false)}
							/>
							<div
								role="listbox"
								aria-label="Tipo de anúncio"
								className="absolute left-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
							>
								{AD_TYPE_OPTIONS.map((option) => {
									const selected = option.value === type;
									return (
										<button
											key={option.value}
											type="button"
											role="option"
											aria-selected={selected}
											onClick={() => {
												onTypeChange(option.value);
												setOpen(false);
											}}
											className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
										>
											{option.label}
											{selected && (
												<FaCheck className="h-3 w-3 text-primary-600" />
											)}
										</button>
									);
								})}
							</div>
						</>
					)}
				</div>

				<FaSearch className="pointer-events-none h-4 w-4 shrink-0 text-muted" />
				<input
					name="q"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Procurar entre vizinhos…"
					aria-label="Procurar anúncios"
					className="h-full min-w-0 flex-1 border-none bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
				/>
			</div>

			{value && (
				<button
					type="button"
					onClick={() => onChange('')}
					aria-label="Limpar pesquisa"
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
				>
					<FaTimes className="h-3.5 w-3.5" />
				</button>
			)}
		</form>
	);
}
