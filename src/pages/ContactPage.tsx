import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import {
	FaMapMarkerAlt,
	FaPhone,
	FaEnvelope,
	FaClock,
	FaPaperPlane,
	FaWhatsapp,
} from 'react-icons/fa';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

interface FormState {
	nome: string;
	email: string;
	assunto: string;
	mensagem: string;
}

const INITIAL: FormState = { nome: '', email: '', assunto: '', mensagem: '' };

const SUBJECTS = [
	'Dúvida sobre um anúncio',
	'Problema com a minha conta',
	'Sugestão para a plataforma',
	'Imprensa / Parcerias',
	'Outro',
];

export function ContactPage() {
	const [form, setForm] = useState<FormState>(INITIAL);
	const [sending, setSending] = useState(false);

	const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (sending) return;
		setSending(true);
		window.setTimeout(() => {
			setSending(false);
			setForm(INITIAL);
			toast.success('Mensagem enviada. Respondemos em até 24h úteis.');
		}, 700);
	};

	return (
		<div className="space-y-12">
			<section className="relative overflow-hidden rounded-3xl bg-sand">
				<div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
					<div className="space-y-5 lg:col-span-7">
						<span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
							<FaMapMarkerAlt className="h-3 w-3" />
							Fale connosco
						</span>
						<h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
							Estamos à conversa
							<span className="text-primary-600">
								{' '}
								com a vizinhança.
							</span>
						</h1>
						<p className="max-w-xl text-lg text-slate-600">
							Suporte, dúvidas, ideias ou problemas — escreva-nos
							ou passe pela nossa sede em Luanda. Respondemos
							sempre em menos de 24 horas úteis.
						</p>
					</div>

					<div className="lg:col-span-5">
						<Card className="p-6">
							<div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
								<span>Disponibilidade</span>
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
								</span>
								<span className="text-emerald-600">
									Online agora
								</span>
							</div>
							<div className="mt-4 grid grid-cols-2 gap-4 font-mono text-sm">
								<div>
									<div className="text-xs uppercase tracking-wider text-slate-400">
										Resposta
									</div>
									<div className="text-2xl font-semibold text-slate-900">
										&lt; 24h
									</div>
								</div>
								<div>
									<div className="text-xs uppercase tracking-wider text-slate-400">
										Idiomas
									</div>
									<div className="text-2xl font-semibold text-slate-900">
										PT · EN
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-5">
				<aside className="space-y-4 lg:col-span-2">
					<Card className="p-6">
						<h2 className="font-display text-lg">Contactos</h2>
						<dl className="mt-5 space-y-4 text-sm">
							<div className="flex items-start gap-3">
								<FaMapMarkerAlt className="mt-0.5 h-4 w-4 text-primary-600" />
								<div>
									<dt className="font-medium text-slate-800">
										Sede
									</dt>
									<dd className="text-muted">
										Luanda, Angola
									</dd>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<FaPhone className="mt-0.5 h-4 w-4 text-primary-600" />
								<div>
									<dt className="font-medium text-slate-800">
										Telefone
									</dt>
									<dd className="text-muted font-mono">
										+244 923 000 000
									</dd>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<FaEnvelope className="mt-0.5 h-4 w-4 text-primary-600" />
								<div>
									<dt className="font-medium text-slate-800">
										Email
									</dt>
									<dd className="text-muted">
										ola@kusumba.ao
									</dd>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<FaClock className="mt-0.5 h-4 w-4 text-primary-600" />
								<div>
									<dt className="font-medium text-slate-800">
										Horário
									</dt>
									<dd className="text-muted">
										Seg–Sex · 8h00–18h00
									</dd>
								</div>
							</div>
						</dl>
						<div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
							<Button
								to="https://wa.me/244923000000"
								variant="outline"
								size="sm"
							>
								<FaWhatsapp className="h-4 w-4" />
								WhatsApp
							</Button>
							<Button
								to="mailto:ola@kusumba.ao"
								variant="ghost"
								size="sm"
							>
								<FaEnvelope className="h-4 w-4" />
								Email direto
							</Button>
						</div>
					</Card>

					<Card className="p-6">
						<h3 className="font-display text-sm uppercase tracking-wider text-slate-400">
							Para questões específicas
						</h3>
						<ul className="mt-4 space-y-3 text-sm">
							<li className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
								<span className="text-slate-700">
									Suporte técnico
								</span>
								<a
									href="mailto:suporte@kusumba.ao"
									className="font-mono text-xs text-primary-600 hover:underline"
								>
									suporte@kusumba.ao
								</a>
							</li>
							<li className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
								<span className="text-slate-700">
									Denúncias
								</span>
								<a
									href="mailto:denuncias@kusumba.ao"
									className="font-mono text-xs text-primary-600 hover:underline"
								>
									denuncias@kusumba.ao
								</a>
							</li>
							<li className="flex items-center justify-between gap-3">
								<span className="text-slate-700">Imprensa</span>
								<a
									href="mailto:imprensa@kusumba.ao"
									className="font-mono text-xs text-primary-600 hover:underline"
								>
									imprensa@kusumba.ao
								</a>
							</li>
						</ul>
					</Card>
				</aside>

				<Card className="p-6 sm:p-8 lg:col-span-3">
					<h2 className="font-display text-xl">Envie uma mensagem</h2>
					<p className="mt-1 text-sm text-muted">
						Quanto mais contexto, mais rápido respondemos.
					</p>
					<form
						onSubmit={handleSubmit}
						className="mt-6 grid gap-4 sm:grid-cols-2"
					>
						<Input
							label="Nome"
							required
							placeholder="O seu nome"
							value={form.nome}
							onChange={(e) => update('nome', e.target.value)}
						/>
						<Input
							label="Email"
							type="email"
							required
							placeholder="voce@exemplo.ao"
							value={form.email}
							onChange={(e) => update('email', e.target.value)}
						/>
						<div className="sm:col-span-2">
							<label
								htmlFor="assunto"
								className="mb-1.5 block text-sm font-medium text-slate-700"
							>
								Assunto
							</label>
							<select
								id="assunto"
								required
								value={form.assunto}
								onChange={(e) =>
									update('assunto', e.target.value)
								}
								className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
							>
								<option value="" disabled>
									Escolha um assunto
								</option>
								{SUBJECTS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div className="sm:col-span-2">
							<Textarea
								label="Mensagem"
								required
								rows={5}
								placeholder="Conte-nos o que aconteceu, com links ou ecrãs se ajudar."
								value={form.mensagem}
								onChange={(e) =>
									update('mensagem', e.target.value)
								}
							/>
						</div>
						<div className="flex items-center justify-between gap-3 sm:col-span-2">
							<p className="text-xs text-muted">
								Ao enviar, concorda com a nossa{' '}
								<a
									href="/politicas"
									className="text-primary-600 hover:underline"
								>
									política de privacidade
								</a>
								.
							</p>
							<Button
								type="submit"
								variant="accent"
								disabled={sending}
							>
								<FaPaperPlane className="h-4 w-4" />
								{sending ? 'A enviar…' : 'Enviar mensagem'}
							</Button>
						</div>
					</form>
				</Card>
			</section>
		</div>
	);
}
