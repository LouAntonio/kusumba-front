import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	FaHeart,
	FaCommentDots,
	FaPlus,
	FaUser,
	FaBars,
	FaSearch,
	FaSignOutAlt,
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { signOut } from '../../lib/auth';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
	const user = useAuthStore((s) => s.user);
	const [menuOpen, setMenuOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
				<Link to="/" className="shrink-0">
					<Logo />
				</Link>

				<form
					className="hidden flex-1 sm:flex"
					onSubmit={(e) => {
						e.preventDefault();
						const q = (
							e.currentTarget.elements.namedItem(
								'q',
							) as HTMLInputElement
						)?.value;
						navigate(q ? `/procurar?q=${q}` : '/anuncios');
					}}
				>
					<div className="relative w-full max-w-md">
						<FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted" />
						<input
							name="q"
							placeholder="Procurar entre vizinhos…"
							className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm"
						/>
					</div>
				</form>

				<nav className="ml-auto hidden items-center gap-1 md:flex">
					<Link
						to="/anuncios"
						className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					>
						Explorar
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
					<MobileMenuItems user={user} />
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
			// ignore — clear local session regardless
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
}: {
	user: ReturnType<typeof useAuthStore.getState>['user'];
}) {
	const clear = useAuthStore((s) => s.clear);
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);

	const handleSignOut = async () => {
		setSigningOut(true);
		try {
			await signOut();
		} catch {
			// ignore — clear local session regardless
		}
		clear();
		navigate('/');
	};

	return (
		<nav className="flex flex-col gap-1">
			<Link
				to="/anuncios"
				className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
			>
				Explorar
			</Link>
			{user ? (
				<>
					<Link
						to="/anuncios/novo"
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaPlus className="h-4 w-4" /> Criar anúncio
					</Link>
					<Link
						to="/mensagens"
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaCommentDots className="h-4 w-4" /> Mensagens
					</Link>
					<Link
						to="/perfil"
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						<FaUser className="h-4 w-4" /> Meu perfil
					</Link>
					<button
						onClick={handleSignOut}
						disabled={signingOut}
						className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
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
