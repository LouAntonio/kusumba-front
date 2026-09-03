import { Button } from '../components/ui/Button';

export function NotFoundPage() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
			<p className="font-mono text-7xl font-bold text-primary-200">404</p>
			<h1 className="font-display text-2xl text-slate-800">
				Página não encontrada
			</h1>
			<p className="max-w-sm text-muted">
				A página que procura não existe ou foi movida.
			</p>
			<Button to="/">Voltar ao início</Button>
		</div>
	);
}
