import {
	FaUserPlus,
	FaCamera,
	FaCommentDots,
	FaHandshake,
	FaShieldAlt,
	FaCheck,
	FaMapMarkerAlt,
} from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const STEPS = [
	{
		n: '01',
		title: 'Crie a sua conta',
		desc: 'Registe-se com email ou Google em menos de um minuto. A verificação de identidade (KYC) aumenta a confiança do bairro.',
		icon: FaUserPlus,
	},
	{
		n: '02',
		title: 'Publique um anúncio',
		desc: 'Fotografe o item com o telemóvel, escreva uma descrição honesta e defina o preço em Kwanzas. O anúncio fica visível para os vizinhos do raio.',
		icon: FaCamera,
	},
	{
		n: '03',
		title: 'Converse com o vizinho',
		desc: 'Combine tudo nas mensagens da plataforma: preço, condições e horário. Só partilha dados pessoais quando quiser.',
		icon: FaCommentDots,
	},
	{
		n: '04',
		title: 'Encontre-se e negocie',
		desc: 'Combinam um ponto próximo, vêem o item ao vivo e fecham o negócio à porta de casa — sem frete, sem comissões.',
		icon: FaHandshake,
	},
];

const SAFETY = [
	{
		title: 'Verificação de identidade',
		desc: 'KYC opcional que aumenta o seu score de confiança entre vizinhos.',
	},
	{
		title: 'Avaliações públicas',
		desc: 'Cada negócio gera uma avaliação visível no perfil do utilizador.',
	},
	{
		title: 'Denúncias com revisão',
		desc: 'Qualquer problema pode ser reportado e é revisto pela moderação em até 24h.',
	},
];

export function ComoFuncionaPage() {
	return (
		<div className="space-y-14">
			<section className="relative overflow-hidden rounded-3xl bg-sand">
				<div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
					<div className="space-y-5 lg:col-span-8">
						<span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
							<FaMapMarkerAlt className="h-3 w-3" />
							Como funciona
						</span>
						<h1 className="font-display text-4xl leading-[1.05] text-slate-900 sm:text-5xl">
							Do seu quintal ao mercado local
							<span className="text-primary-600">
								{' '}
								em quatro passos.
							</span>
						</h1>
						<p className="max-w-xl text-lg text-slate-600">
							Sem plataformas de envio, sem comissões, sem
							intermediários. O Kusumba junta quem mora perto — o
							resto acontece à porta de casa.
						</p>
					</div>
					<div className="lg:col-span-4">
						<Card className="p-6">
							<div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
								<FaShieldAlt className="h-3.5 w-3.5" />A nossa
								promessa
							</div>
							<p className="font-display text-xl leading-snug text-slate-900">
								“Se não mora perto, não está no Kusumba.”
							</p>
							<div className="mt-4 flex items-center gap-2 text-sm text-muted">
								<FaCheck className="h-3.5 w-3.5 text-emerald-500" />
								Raio de 5–10 km
							</div>
							<div className="mt-1.5 flex items-center gap-2 text-sm text-muted">
								<FaCheck className="h-3.5 w-3.5 text-emerald-500" />
								0% de comissão
							</div>
						</Card>
					</div>
				</div>
			</section>

			<section className="space-y-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="font-display text-2xl">
							O caminho do anúncio
						</h2>
						<p className="text-sm text-muted">
							De começar a fechar negócio, passo a passo.
						</p>
					</div>
					<span className="hidden font-mono text-xs uppercase tracking-wider text-slate-400 sm:block">
						01 → 04
					</span>
				</div>

				<ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{STEPS.map((step) => {
						const Icon = step.icon;
						return (
							<li
								key={step.n}
								className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
							>
								<div className="flex items-center justify-between">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
										<Icon className="h-5 w-5" />
									</div>
									<span className="font-mono text-xs font-semibold text-slate-300">
										{step.n}
									</span>
								</div>
								<h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
									{step.title}
								</h3>
								<p className="mt-1.5 text-sm text-muted">
									{step.desc}
								</p>
							</li>
						);
					})}
				</ol>
			</section>

			<section className="space-y-6">
				<h2 className="font-display text-2xl">
					Segurança entre desconhecidos
				</h2>
				<p className="-mt-4 text-sm text-muted">
					O que faz com que vender a um estranho seja seguro.
				</p>
				<div className="grid gap-4 sm:grid-cols-3">
					{SAFETY.map((item) => (
						<Card key={item.title} className="p-6">
							<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
								<FaShieldAlt className="h-4 w-4" />
							</div>
							<h3 className="font-display text-base font-semibold text-slate-900">
								{item.title}
							</h3>
							<p className="mt-1 text-sm text-muted">
								{item.desc}
							</p>
						</Card>
					))}
				</div>
			</section>

			<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-6 py-10 text-white sm:px-10">
				<div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
				<div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
					<div className="space-y-2">
						<h2 className="font-display text-2xl sm:text-3xl">
							Pronto para o primeiro negócio?
						</h2>
						<p className="max-w-lg text-sm text-white/80">
							Crie o seu primeiro anúncio hoje — ou explore o que
							os vizinhos já estão a vender.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button to="/anuncios/novo" variant="accent" size="lg">
							Publicar o meu primeiro anúncio
						</Button>
						<Button
							to="/anuncios"
							variant="outline"
							size="lg"
							className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 hover:text-white"
						>
							Ver ofertas de vizinhos
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
