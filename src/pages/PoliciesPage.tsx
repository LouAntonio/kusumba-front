import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { cn } from '../lib/cn';

const SECTIONS = [
	{
		id: 'privacidade',
		label: 'Privacidade',
		title: 'Política de privacidade',
		updated: 'Atualizado em janeiro de 2026',
		intro: 'O Kusumba é uma plataforma entre vizinhos. Recolhemos apenas o necessário para a transação acontecer com confiança.',
		items: [
			{
				h: 'Dados que recolhemos',
				p: 'Conta (nome, email, telefone), localização aproximada para o hiperlocal funcionar, conteúdo dos anúncios que publica e mensagens trocadas com outros vizinhos. Nada disto é vendido a terceiros.',
			},
			{
				h: 'Localização',
				p: 'Usamos a sua localização apenas para mostrar anúncios próximos num raio de 5–10 km. Não partilhamos a sua posição exata com outros utilizadores.',
			},
			{
				h: 'Verificação de identidade (KYC)',
				p: 'Os documentos enviados na verificação KYC são cifrados em repouso, acedidos apenas por equipa autorizada e eliminados quando deixa de haver necessidade legal ou operacional.',
			},
			{
				h: 'Cookies',
				p: 'Usamos cookies essenciais (sessão) e cookies de medição agregada. Pode desativar os de medição nas definições do navegador sem perder funcionalidade.',
			},
			{
				h: 'Os seus direitos',
				p: 'Pode pedir acesso, correção ou eliminação dos seus dados a qualquer momento, enviando um email para privacidade@kusumba.ao.',
			},
		],
	},
	{
		id: 'conduta',
		label: 'Conduta',
		title: 'Código de conduta',
		updated: 'Aplicável a todos os utilizadores',
		intro: 'A confiança do quintal vive de pequenos gestos. Estas regras existem para que o bairro continue a ser o bairro.',
		rules: [
			'Ser verdadeiro nas descrições e fotos dos anúncios.',
			'Respeitar o tempo do vizinho: responder a mensagens em tempo razoável.',
			'Comparecer aos encontros combinados ou avisar com antecedência.',
			'Não publicar itens proibidos por lei ou que incentivem dano.',
			'Não usar a plataforma para spam, fraude ou assédio.',
		],
	},
	{
		id: 'conteudo',
		label: 'Conteúdo',
		title: 'Política de conteúdo e anúncios',
		updated: 'Critérios de remoção automática',
		intro: 'Removemos ou sinalizamos conteúdo que viole a lei angolana, que represente risco para a comunidade ou que fuja ao espírito local do Kusumba.',
		items: [
			{
				h: 'É proibido',
				p: 'Armas, medicamentos sujeitos a receita, produtos contrafeitos, conteúdo sexual, serviços de intermediação financeira, animais em risco e qualquer item cuja venda seja ilegal em Angola.',
			},
			{
				h: 'Propriedade intelectual',
				p: 'Só publique fotos e descrições que sejam suas. Anúncios com material protegido por direitos de autor são removidos após denúncia.',
			},
			{
				h: 'Preços e promoções',
				p: 'Indicamos sempre o preço em Kwanzas. Anúncios com preços falsos ou inflacionados podem ser suspensos.',
			},
		],
	},
	{
		id: 'denuncias',
		label: 'Denúncias',
		title: 'Como reportar um problema',
		updated: 'Processo em três passos',
		steps: [
			{
				n: '01',
				t: 'Reporte',
				p: 'Use o botão de denúncia em qualquer anúncio, mensagem ou perfil. Pode escolher o motivo e adicionar contexto.',
			},
			{
				n: '02',
				t: 'Triagem',
				p: 'A nossa equipa de moderação analisa em até 24 horas. Casos urgentes (segurança, fraude) têm prioridade.',
			},
			{
				n: '03',
				t: 'Resolução',
				p: 'Tomamos uma das três ações: manter, sinalizar ou remover. Notificamos sempre o denunciante e, quando aplicável, o autor.',
			},
		],
	},
	{
		id: 'reembolso',
		label: 'Reembolso',
		title: 'Política de reembolso',
		updated: 'Para assinaturas Kusumba Pass',
		intro: 'O Kusumba não cobra em transações P2P. Esta política aplica-se apenas à assinatura Kusumba Pass.',
		items: [
			{
				h: 'Arrependimento',
				p: 'Tem 7 dias após a compra para pedir reembolso integral, desde que não tenha usado benefícios da assinatura (anúncios em destaque, etc.).',
			},
			{
				h: 'Proporcional',
				p: 'Após 7 dias, devolvemos o valor proporcional aos dias não utilizados, descontando uma taxa administrativa de 10%.',
			},
			{
				h: 'Como pedir',
				p: 'Envie o pedido para financas@kusumba.ao com o ID da assinatura. Processamos em até 5 dias úteis.',
			},
		],
	},
];

export function PoliciesPage() {
	const [active, setActive] = useState(SECTIONS[0].id);

	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<span className="font-mono text-xs uppercase tracking-wider text-primary-700">
					Políticas · v2026.01
				</span>
				<h1 className="font-display text-4xl text-slate-900 sm:text-5xl">
					As regras do quintal.
				</h1>
				<p className="max-w-2xl text-muted">
					Tudo o que precisa de saber para usar o Kusumba com
					segurança — privacidade, conduta, conteúdo, denúncias e
					reembolsos.
				</p>
			</header>

			<div className="grid gap-8 lg:grid-cols-12">
				<nav className="lg:col-span-3">
					<div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-2">
						<ul className="flex flex-col">
							{SECTIONS.map((s, i) => {
								const isActive = active === s.id;
								return (
									<li key={s.id}>
										<a
											href={`#${s.id}`}
											onClick={() => setActive(s.id)}
											className={cn(
												'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
												isActive
													? 'bg-primary-50 text-primary-800'
													: 'text-slate-600 hover:bg-slate-50',
											)}
										>
											<span className="font-mono text-xs text-slate-400">
												{String(i + 1).padStart(2, '0')}
											</span>
											<span className="font-medium">
												{s.label}
											</span>
											{isActive && (
												<FaCheck className="ml-auto h-3 w-3 text-primary-600" />
											)}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</nav>

				<div className="space-y-10 lg:col-span-9">
					{SECTIONS.map((s) => (
						<article
							key={s.id}
							id={s.id}
							className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
						>
							<header className="mb-5 border-b border-slate-100 pb-4">
								<div className="font-mono text-xs uppercase tracking-wider text-slate-400">
									{s.updated}
								</div>
								<h2 className="mt-1 font-display text-2xl text-slate-900">
									{s.title}
								</h2>
								{s.intro && (
									<p className="mt-2 text-muted">{s.intro}</p>
								)}
							</header>

							{s.items && (
								<dl className="space-y-5">
									{s.items.map((it) => (
										<div
											key={it.h}
											className="grid gap-2 sm:grid-cols-4"
										>
											<dt className="font-display text-sm font-semibold text-slate-800 sm:col-span-1">
												{it.h}
											</dt>
											<dd className="text-sm text-slate-600 sm:col-span-3">
												{it.p}
											</dd>
										</div>
									))}
								</dl>
							)}

							{s.rules && (
								<ul className="space-y-3">
									{s.rules.map((r, i) => (
										<li
											key={i}
											className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700"
										>
											<span className="mt-0.5 font-mono text-xs text-slate-400">
												{String(i + 1).padStart(2, '0')}
											</span>
											{r}
										</li>
									))}
								</ul>
							)}

							{s.steps && (
								<ol className="grid gap-4 sm:grid-cols-3">
									{s.steps.map((st) => (
										<li
											key={st.n}
											className="rounded-xl border border-slate-200 p-4"
										>
											<div className="font-mono text-xs text-slate-400">
												{st.n}
											</div>
											<div className="mt-1 font-display text-base font-semibold text-slate-900">
												{st.t}
											</div>
											<p className="mt-1 text-sm text-slate-600">
												{st.p}
											</p>
										</li>
									))}
								</ol>
							)}
						</article>
					))}

					<aside className="rounded-2xl bg-primary-50 p-6 text-sm text-primary-900 sm:p-8">
						<strong className="font-display text-base">
							Tem dúvidas sobre uma política?
						</strong>
						<p className="mt-1 text-primary-900/80">
							Escreva para{' '}
							<a
								href="mailto:privacidade@kusumba.ao"
								className="font-medium underline"
							>
								privacidade@kusumba.ao
							</a>{' '}
							ou use o formulário de contacto. Respondemos em até
							24 horas úteis.
						</p>
					</aside>
				</div>
			</div>
		</div>
	);
}
