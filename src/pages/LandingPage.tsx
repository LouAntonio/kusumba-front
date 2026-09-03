import { Link } from 'react-router-dom';
import {
	FaShoppingCart,
	FaTags,
	FaHandshake,
	FaHeart,
	FaShieldAlt,
	FaMapMarkerAlt,
	FaUserPlus,
} from 'react-icons/fa';
import { useCategories } from '../hooks/useCategories';
import { useAds } from '../hooks/useAds';
import { AdCard } from '../components/ads/AdCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const MODES = [
	{
		key: 'SALE',
		title: 'Comprar',
		desc: 'Itens vizinhos, preços 20–30% mais baixos que em lojas.',
		icon: FaShoppingCart,
		to: '/anuncios?type=SALE',
	},
	{
		key: 'TRADE',
		title: 'Vender',
		desc: 'Renda extra e venda em horas, sem custos de frete.',
		icon: FaTags,
		to: '/anuncios?type=SALE',
	},
	{
		key: 'DONATION',
		title: 'Trocar',
		desc: 'Dê nova vida aos produtos que já não usa.',
		icon: FaHandshake,
		to: '/anuncios?type=TRADE',
	},
	{
		key: 'DOAR',
		title: 'Doar',
		desc: 'Reutilizar em vez de descartar, por uma economia circular.',
		icon: FaHeart,
		to: '/anuncios?type=DONATION',
	},
];

const PILLARS = [
	{
		icon: FaUserPlus,
		title: 'Rede comunitária',
		desc: 'Vizinhos conectados por proximidade geográfica em Luanda.',
	},
	{
		icon: FaShieldAlt,
		title: 'Confiança',
		desc: 'Ratings, verificação de identidade e reviews entre vizinhos.',
	},
	{
		icon: FaMapMarkerAlt,
		title: 'Sem frete',
		desc: 'Transações num raio de 5–10 km, sem intermediários.',
	},
];

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
		<div className="space-y-16">
			<section className="relative overflow-hidden rounded-3xl bg-sand">
				<div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
					<div className="space-y-6">
						<span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
							<FaMapMarkerAlt className="h-3 w-3" />
							Hiperlocal · Luanda
						</span>
						<h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
							Comprar. Vender. Trocar. Doar.
							<span className="text-primary-600">
								{' '}
								Entre vizinhos.
							</span>
						</h1>
						<p className="max-w-md text-lg text-slate-600">
							O marketPlace P2P hiperlocal de Luanda — sem frete,
							com confiança comunitária e transações em horas.
						</p>
						<div className="flex flex-wrap gap-3">
							<Button to="/anuncios" variant="accent" size="lg">
								Explorar anúncios
							</Button>
							<Button
								to="/anuncios/novo"
								variant="outline"
								size="lg"
							>
								Criar anúncio
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{MODES.map((mode) => {
							const Icon = mode.icon;
							return (
								<Link
									key={mode.key}
									to={mode.to}
									className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
								>
									<div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
										<Icon className="h-5 w-5" />
									</div>
									<p className="font-display text-lg font-semibold text-slate-900">
										{mode.title}
									</p>
									<p className="mt-1 text-sm text-muted">
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
						Ver tudo →
					</Link>
				</div>
				{catsLoading ? (
					<Spinner />
				) : (
					<div className="flex flex-wrap gap-3">
						{(categories ?? []).map((cat) => (
							<Card key={cat.id} hover className="px-4 py-3">
								<Link
									to={`/anuncios?categoryIds=${cat.id}`}
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
					<Spinner />
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
					<Spinner />
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{(recent?.items ?? []).map((ad) => (
							<AdCard key={ad.id} ad={ad} />
						))}
					</div>
				)}
			</section>

			<section className="rounded-3xl bg-primary-900 p-8 text-white sm:p-12">
				<h2 className="text-center font-display text-2xl sm:text-3xl">
					Feito para a confiança entre vizinhos
				</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-3">
					{PILLARS.map((pillar) => {
						const Icon = pillar.icon;
						return (
							<div key={pillar.title} className="text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-primary-100">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="font-display text-lg">
									{pillar.title}
								</h3>
								<p className="mt-1 text-sm text-primary-100/80">
									{pillar.desc}
								</p>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}
