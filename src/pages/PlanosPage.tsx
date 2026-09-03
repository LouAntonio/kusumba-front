import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaCrown } from 'react-icons/fa';
import { usePlans } from '../hooks/usePlans';
import { useAuthStore } from '../store/authStore';
import { subscribe } from '../api/subscriptions';
import { getApiError } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { formatKz } from '../lib/format';

export function PlanosPage() {
	const { data, isLoading } = usePlans();
	const user = useAuthStore((s) => s.user);
	const navigate = useNavigate();
	const plans = (data?.items ?? []).filter((p) => p.isActive);

	const handleSubscribe = async (planId: string) => {
		if (!user) {
			navigate('/entrar');
			return;
		}
		try {
			await subscribe(planId);
			toast.success('Subscrição iniciada! Verifique a sua assinatura.');
			navigate('/assinatura');
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	return (
		<div className="space-y-8">
			<div className="mx-auto max-w-2xl text-center">
				<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
					<FaCrown className="h-6 w-6" />
				</div>
				<h1 className="font-display text-3xl">Kusumba Pass</h1>
				<p className="mt-2 text-muted">
					Destaque os seus anúncios e destaque-se na comunidade.
					Assinaturas feitas para quem quer mais visibilidade.
				</p>
			</div>

			{isLoading ? (
				<Spinner className="mx-auto" />
			) : plans.length === 0 ? (
				<p className="text-center text-muted">
					Ainda não há planos disponíveis.
				</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan) => (
						<Card key={plan.id} className="flex flex-col p-6" hover>
							<h2 className="font-display text-xl text-slate-900">
								{plan.name}
							</h2>
							{plan.description && (
								<p className="mt-1 text-sm text-muted">
									{plan.description}
								</p>
							)}
							<div className="mt-4 flex items-baseline gap-1">
								<span className="font-mono text-3xl font-semibold text-slate-900">
									{formatKz(plan.price)}
								</span>
								<span className="text-sm text-muted">
									/ {plan.durationDays} dia(s)
								</span>
							</div>
							<ul className="mt-5 flex-1 space-y-2">
								{plan.benefits.map((benefit, i) => (
									<li
										key={i}
										className="flex items-start gap-2 text-sm text-slate-700"
									>
										<FaCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
										{benefit}
									</li>
								))}
								{plan.featuredAdsLimit > 0 && (
									<li className="flex items-start gap-2 text-sm text-slate-700">
										<FaCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
										Até {plan.featuredAdsLimit} anúncio(s)
										em destaque
									</li>
								)}
							</ul>
							<Button
								onClick={() => handleSubscribe(plan.id)}
								className="mt-6"
								fullWidth
							>
								Assinar {plan.name}
							</Button>
						</Card>
					))}
				</div>
			)}

			{user && (
				<p className="text-center text-xs text-muted">
					Assinaturas são geradas a pedido. A sua assinatura atual e a
					data de expiração podem ser consultadas na página{' '}
					<a
						href="/assinatura"
						className="text-primary-600 hover:underline"
					>
						Minha assinatura
					</a>
					.
				</p>
			)}
		</div>
	);
}
