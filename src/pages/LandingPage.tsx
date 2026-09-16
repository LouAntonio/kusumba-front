import { Link } from 'react-router-dom';
import {
	FaShoppingCart,
	FaTags,
	FaHandshake,
	FaHeart,
	FaMapMarkerAlt,
	FaArrowRight,
	FaShieldAlt,
	FaCheck,
} from 'react-icons/fa';
import { useCategories } from '../hooks/useCategories';
import { useAds } from '../hooks/useAds';
import { AdCard } from '../components/ads/AdCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AdCardSkeleton, Skeleton } from '../components/ui/Skeleton';

const MODES = [
	{
		key: 'SALE',
		title: 'Comprar',
		desc: 'Itens vizinhos a preços 20–30% mais baixos',
		icon: FaShoppingCart,
		to: '/anuncios?type=SALE',
	},
	{
		key: 'TRADE',
		title: 'Vender',
		desc: 'Renda extra sem custos de frete',
		icon: FaTags,
		to: '/anuncios?type=SALE',
	},
	{
		key: 'DONATION',
		title: 'Trocar',
		desc: 'Dê nova vida ao que já não usa',
		icon: FaHandshake,
		to: '/anuncios?type=TRADE',
	},
	{
		key: 'DOAR',
		title: 'Doar',
		desc: 'Economia circular no seu bairro',
		icon: FaHeart,
		to: '/anuncios?type=DONATION',
	},
];

const FACTS = [
	{ metric: '0%', label: 'comissão em transações P2P' },
	{ metric: '5–10 km', label: 'raio máximo da sua zona' },
	{ metric: '<24h', label: 'do anúncio ao negócio' },
];

const HERO_IMAGE =
	import.meta.env.VITE_HOME_HERO_IMAGE ??
	'https://images.unsplash.com/photo-1680801237121-13222ddd73ba?fm=jpg&q=80&w=2000&fit=crop';

export function LandingPage() {
	const { data: categories, isLoading: catsLoading } = useCategories();
	const { data: featured, isLoading: featuredLoading } = useAds({
		featured: true,
		limit: 4,
		sortBy: 'newest',
	});
	const { data: recent, isLoading: recentLoading } = useAds({
		limit: 8,
		sortBy: 'newest',
	});

	return (
		<div className="space-y-14">
			<section className="relative overflow-hidden rounded-3xl bg-sand">
				<div
					aria-hidden
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${HERO_IMAGE})` }}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/85 via-[#0B1220]/65 to-[#0B1220]/80" />
				<div className="relative px-6 py-8 sm:px-10 sm:py-10">
					<span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/20">
						<FaMapMarkerAlt className="h-3 w-3 text-amber-300" />
						Hiperlocal · Luanda
					</span>
					<h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
						Comprar, vender, trocar e doar.{' '}
						<span className="text-amber-300">Entre vizinhos.</span>
					</h1>
					<p className="mt-3 max-w-2xl text-base text-slate-200">
						O mercado local de Luanda: sem frete, com confiança da
						comunidade e negócios fechados em horas, numa distância
						de poucos quarteirões.
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<Button to="/anuncios" variant="accent" size="md">
							Explorar anúncios
						</Button>
						<Link
							to="/anuncios/novo"
							className="inline-flex h-10 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
						>
							Criar anúncio
						</Link>
					</div>

					<div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
						{MODES.map((mode) => {
							const Icon = mode.icon;
							return (
								<Link
									key={mode.key}
									to={mode.to}
									className="group rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
								>
									<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-amber-300 ring-1 ring-white/20 transition group-hover:bg-white/20 group-hover:text-amber-200">
										<Icon className="h-4 w-4" />
									</div>
									<p className="font-display text-base font-semibold text-white">
										{mode.title}
									</p>
									<p className="mt-0.5 text-xs leading-snug text-white/70">
										{mode.desc}
									</p>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			<section className="space-y-6">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="font-display text-2xl">
							Explorar por categoria
						</h2>
						<p className="text-sm text-muted">
							Encontre o que procura na sua vizinhança.
						</p>
					</div>
					<Link
						to="/anuncios"
						className="text-sm font-medium text-primary-600 hover:text-primary-700"
					>
						Ver todos os anúncios →
					</Link>
				</div>
				{catsLoading ? (
					<div className="flex flex-wrap gap-3">
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-10 w-28 rounded-xl"
							/>
						))}
					</div>
				) : (
					<div className="flex flex-wrap gap-3">
						{(categories ?? []).map((cat) => (
							<Card key={cat.id} hover className="px-4 py-3">
								<Link
									to={`/anuncios?categorySlugs=${cat.slug}`}
									className="text-sm font-medium text-slate-700 hover:text-primary-700"
								>
									{cat.name}
								</Link>
							</Card>
						))}
					</div>
				)}
			</section>

			<section className="space-y-6">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="font-display text-2xl">Em destaque</h2>
						<p className="text-sm text-muted">
							Anúncios em evidência na sua zona.
						</p>
					</div>
				</div>
				{featuredLoading ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<AdCardSkeleton key={i} />
						))}
					</div>
				) : (featured?.items?.length ?? 0) > 0 ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{featured!.items.map((ad) => (
							<AdCard key={ad.id} ad={ad} />
						))}
					</div>
				) : null}
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-2xl">
					Recentes na comunidade
				</h2>
				{recentLoading ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<AdCardSkeleton key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{(recent?.items ?? []).map((ad) => (
							<AdCard key={ad.id} ad={ad} />
						))}
					</div>
				)}
			</section>

			<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-6 py-10 text-white sm:px-10">
				<div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
				<div className="relative grid items-center gap-10 lg:grid-cols-2">
					<div className="space-y-4">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/20">
							<FaShieldAlt className="h-3 w-3 text-amber-300" />
							Sem comissões · Sem frete
						</span>
						<h2 className="font-display text-2xl leading-tight sm:text-3xl">
							O seu quintal já tem mercado. Publique e negocie à
							porta de casa.
						</h2>
						<p className="max-w-xl text-sm text-white/80">
							Criar um anúncio leva dois minutos com as fotos que
							já tem no telemóvel. Não cobramos comissões em
							transações P2P nem exigimos anúncios pagos — e a sua
							comunidade está a poucos quarteirões de distância.
						</p>
						<div className="flex flex-wrap items-center gap-3 pt-1">
							<Button
								to="/anuncios/novo"
								variant="accent"
								size="md"
							>
								Publicar grátis em 2 minutos
							</Button>
							<Button
								to="/anuncios"
								variant="outline"
								size="md"
								className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 hover:text-white"
							>
								Ver o que os vizinhos vendem
							</Button>
						</div>
						<Link
							to="/como-funciona"
							className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition-colors hover:text-amber-200"
						>
							Como funciona, em 4 passos
							<FaArrowRight className="h-3.5 w-3.5" />
						</Link>
					</div>

					<dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
						{FACTS.map((fact) => (
							<div
								key={fact.label}
								className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
							>
								<span className="font-display text-2xl font-semibold text-amber-300">
									{fact.metric}
								</span>
								<div className="flex items-center gap-2 text-sm text-white/75">
									<FaCheck className="h-3 w-3 shrink-0 text-emerald-400" />
									{fact.label}
								</div>
							</div>
						))}
					</dl>
				</div>
			</section>
		</div>
	);
}
