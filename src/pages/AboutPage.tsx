import { Link } from 'react-router-dom';
import {
	FaShoppingCart,
	FaTags,
	FaHandshake,
	FaHeart,
	FaShieldAlt,
	FaMapMarkerAlt,
	FaUserPlus,
	FaBullseye,
} from 'react-icons/fa';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const MODES = [
	{
		n: '01',
		key: 'SALE',
		title: 'Comprar',
		desc: 'Itens vizinhos, preços 20–30% mais baixos que em lojas.',
		icon: FaShoppingCart,
		to: '/anuncios?type=SALE',
	},
	{
		n: '02',
		key: 'SELL',
		title: 'Vender',
		desc: 'Renda extra e venda em horas, sem custos de frete.',
		icon: FaTags,
		to: '/anuncios/novo',
	},
	{
		n: '03',
		key: 'TRADE',
		title: 'Trocar',
		desc: 'Dê nova vida aos produtos que já não usa.',
		icon: FaHandshake,
		to: '/anuncios?type=TRADE',
	},
	{
		n: '04',
		key: 'DONATION',
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

export function AboutPage() {
	return (
		<div className="space-y-16">
			<section className="relative overflow-hidden rounded-3xl bg-sand">
				<div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
					<div className="space-y-6 lg:col-span-7">
						<span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
							<FaMapMarkerAlt className="h-3 w-3" />
							Hiperlocal · Luanda
						</span>
						<h1 className="font-display text-4xl leading-[1.05] text-slate-900 sm:text-5xl">
							O quintal dos vizinhos
							<span className="text-primary-600">
								{' '}
								virou mercado.
							</span>
						</h1>
						<p className="max-w-xl text-lg text-slate-600">
							Kusumba é um marketPlace P2P hiperlocal de Luanda.
							Sem frete, com confiança comunitária e transações
							que acontecem em horas — entre quem mora a poucos
							quarteirões de distância.
						</p>
						<div className="flex flex-wrap gap-3 pt-2">
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

					<div className="lg:col-span-5">
						<Card className="p-6">
							<div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
								<FaBullseye className="h-3.5 w-3.5" />
								Missão
							</div>
							<p className="font-display text-xl leading-snug text-slate-900">
								“Reduzir a distância entre o que sobra num
								quintal e o que falta na casa do vizinho.”
							</p>
							<div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 text-sm text-muted">
								<span className="font-mono text-xs uppercase tracking-wider text-slate-400">
									Raio
								</span>
								<span>5–10 km</span>
								<span className="h-1 w-1 rounded-full bg-slate-300" />
								<span>Sem intermediários</span>
							</div>
						</Card>
					</div>
				</div>
			</section>

			<section className="space-y-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="font-display text-2xl">
							Quatro verbos, um só quintal
						</h2>
						<p className="text-sm text-muted">
							Os modos que sustentam a economia local no Kusumba.
						</p>
					</div>
					<span className="hidden font-mono text-xs uppercase tracking-wider text-slate-400 sm:block">
						01 → 04
					</span>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					{MODES.map((m) => {
						const Icon = m.icon;
						return (
							<Link
								key={m.key}
								to={m.to}
								className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
							>
								<div className="font-mono text-xs font-semibold text-slate-300 transition group-hover:text-primary-500">
									{m.n}
								</div>
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
									<Icon className="h-5 w-5" />
								</div>
								<div>
									<p className="font-display text-lg font-semibold text-slate-900">
										{m.title}
									</p>
									<p className="mt-1 text-sm text-muted">
										{m.desc}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			</section>

			<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8 text-white sm:p-12">
				<div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
				<div className="relative mb-10 flex items-end justify-between gap-4">
					<h2 className="font-display text-2xl sm:text-3xl">
						Os três pilares da confiança
					</h2>
					<span className="hidden font-mono text-xs uppercase tracking-wider text-white/50 sm:block">
						Porquê
					</span>
				</div>
				<div className="relative grid gap-5 sm:grid-cols-3">
					{PILLARS.map((p, i) => {
						const Icon = p.icon;
						return (
							<div
								key={p.title}
								className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10"
							>
								<div className="mb-5 flex items-center justify-between">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300 ring-1 ring-white/20">
										<Icon className="h-5 w-5" />
									</div>
									<span className="font-mono text-xs text-white/40">
										0{i + 1}
									</span>
								</div>
								<h3 className="font-display text-lg">
									{p.title}
								</h3>
								<p className="mt-1 text-sm text-white/70">
									{p.desc}
								</p>
							</div>
						);
					})}
				</div>
			</section>

			<section className="grid items-start gap-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 md:grid-cols-2">
				<div>
					<h2 className="font-display text-2xl">Como nasceu</h2>
					<p className="mt-3 text-muted">
						O Kusumba começou como uma conversa no prédio: “alguém
						quer isto?”, “isto ainda serve para alguém?”.
						Formalizámos essa conversa numa plataforma que devolve
						ao bairro o que já não usa.
					</p>
				</div>
				<dl className="grid grid-cols-2 gap-6 border-l border-slate-200 pl-8 font-mono text-sm">
					<div>
						<dt className="text-xs uppercase tracking-wider text-slate-400">
							Comunidade
						</dt>
						<dd className="mt-1 text-2xl font-semibold text-slate-900">
							Luanda
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-wider text-slate-400">
							Modelo
						</dt>
						<dd className="mt-1 text-2xl font-semibold text-slate-900">
							P2P
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-wider text-slate-400">
							Frete
						</dt>
						<dd className="mt-1 text-2xl font-semibold text-slate-900">
							Zero
						</dd>
					</div>
					<div>
						<dt className="text-xs uppercase tracking-wider text-slate-400">
							Tempo médio
						</dt>
						<dd className="mt-1 text-2xl font-semibold text-slate-900">
							Horas
						</dd>
					</div>
				</dl>
			</section>
		</div>
	);
}
