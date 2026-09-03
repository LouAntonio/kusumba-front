const SECTIONS = [
	{
		n: 'I',
		title: 'Objeto e aceitação',
		paragraphs: [
			'Estes Termos e Condições regem a utilização da plataforma Kusumba ("Plataforma"), operada pela Kusumba, Lda., com sede em Luanda, Angola.',
			'Ao criar uma conta, publicar um anúncio ou utilizar qualquer funcionalidade do Kusumba, o utilizador declara ter lido, compreendido e aceite estes Termos na sua totalidade. Se não concordar com qualquer disposição, deve abster-se de utilizar a Plataforma.',
		],
	},
	{
		n: 'II',
		title: 'Elegibilidade e conta',
		paragraphs: [
			'O Kusumba está disponível para pessoas singulares com idade igual ou superior a 18 anos, residentes em Luanda e áreas metropolitanas.',
			'O utilizador é responsável por manter a confidencialidade das suas credenciais de acesso e por toda a atividade realizada na sua conta. Notifique-nos imediatamente em caso de uso não autorizado.',
		],
	},
	{
		n: 'III',
		title: 'Anúncios e transações',
		paragraphs: [
			'O Kusumba funciona como ponto de encontro entre vizinhos. Não intermedia pagamentos, não recolhe comissões sobre transações e não garante a conclusão de qualquer negócio.',
			'O vendedor é integralmente responsável pela veracidade das descrições, pela titularidade dos bens anunciados e pelo cumprimento de obrigações fiscais aplicáveis.',
			'O comprador é responsável por examinar o bem antes da transação e por negociar diretamente os termos com o vendedor.',
		],
	},
	{
		n: 'IV',
		title: 'Conduta do utilizador',
		paragraphs: [
			'É expressamente proibido publicar conteúdo ilegal, ofensivo, enganador, que viole direitos de terceiros ou que infrinja qualquer legislação angolana ou internacional aplicável.',
			'A equipa do Kusumba pode suspender ou encerrar contas que violem estes Termos, a Política de Privacidade ou o Código de Conduta, sem prejuízo das ações legais cabíveis.',
		],
	},
	{
		n: 'V',
		title: 'Kusumba Pass e assinaturas',
		paragraphs: [
			'O Kusumba Pass é uma assinatura opcional que concede benefícios adicionais, como anúncios em destaque e maior visibilidade. Os termos comerciais de cada plano são apresentados no momento da compra.',
			'Os valores cobrados pelo Kusumba Pass não são reembolsáveis após o período de arrependimento previsto na Política de Reembolso, salvo defeito do serviço.',
		],
	},
	{
		n: 'VI',
		title: 'Propriedade intelectual',
		paragraphs: [
			'Todo o conteúdo da Plataforma — código, design, marca, textos e gráficos — é propriedade do Kusumba, Lda. ou dos seus licenciadores, protegido pela legislação aplicável.',
			'O utilizador mantém a propriedade do conteúdo que publica (fotos, descrições), concedendo ao Kusumba uma licença não exclusiva, mundial e gratuita para exibir, distribuir e promover esse conteúdo no âmbito da operação da Plataforma.',
		],
	},
	{
		n: 'VII',
		title: 'Limitação de responsabilidade',
		paragraphs: [
			'O Kusumba não se responsabiliza por perdas, danos ou prejuízos decorrentes de transações realizadas entre utilizadores, nem pela conduta de terceiros na Plataforma.',
			'A Plataforma é fornecida "tal como está", sem garantias de disponibilidade ininterrupta ou ausência de erros. Empreendemos esforços razoáveis para manter a segurança e o bom funcionamento do serviço.',
		],
	},
	{
		n: 'VIII',
		title: 'Suspensão e encerramento',
		paragraphs: [
			'Podemos suspender ou encerrar o acesso do utilizador à Plataforma a qualquer momento, com aviso prévio de 30 dias, salvo em casos de violação grave, nos quais a suspensão pode ser imediata.',
			'O utilizador pode encerrar a sua conta a qualquer momento, acedendo a Perfil → Definições → Encerrar conta. Os dados serão tratados conforme a Política de Privacidade.',
		],
	},
	{
		n: 'IX',
		title: 'Alterações aos Termos',
		paragraphs: [
			'Estes Termos podem ser atualizados periodicamente. Alterações substanciais serão comunicadas com pelo menos 14 dias de antecedência, por email e/ou através de aviso visível na Plataforma.',
			'A continuação de uso da Plataforma após a entrada em vigor das alterações constitui aceitação dos novos Termos.',
		],
	},
	{
		n: 'X',
		title: 'Lei aplicável e foro',
		paragraphs: [
			'Estes Termos são regidos pela lei angolana. Quaisquer litígios serão resolvidos pelos tribunais competentes da comarca de Luanda, sem prejuízo do direito do consumidor a recorrer às entidades de resolução alternativa de conflitos.',
		],
	},
];

export function TermsPage() {
	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<span className="font-mono text-xs uppercase tracking-wider text-primary-700">
					Termos · v2026.01
				</span>
				<h1 className="font-display text-4xl text-slate-900 sm:text-5xl">
					Termos e Condições.
				</h1>
				<p className="max-w-2xl text-muted">
					O contrato entre si e o Kusumba. Estruturado em dez artigos,
					redigido em linguagem direta e pensado para ser lido — não
					apenas aceite.
				</p>
				<div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-slate-500">
					<span>
						Versão <span className="text-slate-700">2026.01</span>
					</span>
					<span className="h-1 w-1 rounded-full bg-slate-300" />
					<span>
						Em vigor desde{' '}
						<span className="text-slate-700">01 jan. 2026</span>
					</span>
					<span className="h-1 w-1 rounded-full bg-slate-300" />
					<span>
						Idiomas: <span className="text-slate-700">PT · EN</span>
					</span>
				</div>
			</header>

			<div className="rounded-3xl border border-slate-200 bg-white">
				{SECTIONS.map((s, i) => (
					<article
						key={s.n}
						id={`art-${s.n.toLowerCase()}`}
						className={
							i === SECTIONS.length - 1
								? 'p-6 sm:p-8'
								: 'border-b border-slate-100 p-6 sm:p-8'
						}
					>
						<header className="mb-3 flex items-baseline gap-4">
							<span className="font-mono text-2xl font-semibold text-primary-600">
								Art. {s.n}
							</span>
							<h2 className="font-display text-xl text-slate-900">
								{s.title}
							</h2>
						</header>
						<div className="space-y-3 text-sm leading-relaxed text-slate-700">
							{s.paragraphs.map((p, j) => (
								<p key={j}>{p}</p>
							))}
						</div>
					</article>
				))}
			</div>

			<aside className="rounded-2xl bg-sand p-6 text-sm text-slate-700 sm:p-8">
				<div className="font-display text-base font-semibold text-slate-900">
					Aceitação
				</div>
				<p className="mt-2 text-slate-600">
					Ao continuar a utilizar o Kusumba, o utilizador confirma a
					aceitação integral destes Termos. Recomendamos guardar uma
					cópia para referência futura. Para questões jurídicas,
					escreva para{' '}
					<a
						href="mailto:juridico@kusumba.ao"
						className="font-medium text-primary-700 underline"
					>
						juridico@kusumba.ao
					</a>
					.
				</p>
			</aside>
		</div>
	);
}
