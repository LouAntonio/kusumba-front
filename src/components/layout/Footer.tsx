import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
	return (
		<footer className="mt-16 border-t border-slate-200 bg-sand/60">
			<div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
				<div className="space-y-3">
					<Logo />
					<p className="max-w-xs text-sm text-muted">
						Comprar. Vender. Trocar. Doar. MarketPlace P2P
						hiperlocal - entre vizinhos, sem frete e com confiança.
					</p>
				</div>
				<div>
					<h4 className="mb-3 text-sm font-semibold text-slate-800">
						MarketPlace
					</h4>
					<ul className="space-y-2 text-sm text-muted">
						<li>
							<Link
								to="/anuncios"
								className="hover:text-slate-900"
							>
								Explorar anúncios
							</Link>
						</li>
						<li>
							<Link
								to="/anuncios/novo"
								className="hover:text-slate-900"
							>
								Criar anúncio
							</Link>
						</li>
						<li>
							<Link to="/planos" className="hover:text-slate-900">
								Kusumba Pass
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="mb-3 text-sm font-semibold text-slate-800">
						Conta
					</h4>
					<ul className="space-y-2 text-sm text-muted">
						<li>
							<Link to="/perfil" className="hover:text-slate-900">
								Meu perfil
							</Link>
						</li>
						<li>
							<Link
								to="/perfil/favoritos"
								className="hover:text-slate-900"
							>
								Favoritos
							</Link>
						</li>
						<li>
							<Link
								to="/mensagens"
								className="hover:text-slate-900"
							>
								Mensagens
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="mb-3 text-sm font-semibold text-slate-800">
						Sobre
					</h4>
					<ul className="space-y-2 text-sm text-muted">
						<li>
							<Link to="/sobre" className="hover:text-slate-900">
								Quem somos
							</Link>
						</li>
						<li>
							<Link
								to="/contacto"
								className="hover:text-slate-900"
							>
								Contacto
							</Link>
						</li>
						<li>
							<Link
								to="/politicas"
								className="hover:text-slate-900"
							>
								Políticas
							</Link>
						</li>
						<li>
							<Link to="/termos" className="hover:text-slate-900">
								Termos e Condições
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="border-t border-slate-200 py-4">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-4 text-center text-xs text-muted sm:flex-row sm:px-6">
					<p>© {new Date().getFullYear()} Kusumba. Luanda, Angola.</p>
					<p>
						Desenvolvido por{' '}
						<a
							href="https://louantonio-me.vercel.app"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-primary-600 hover:underline"
						>
							Lourenço António
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
