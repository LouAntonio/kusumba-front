import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { FaCrown, FaCalendarAlt, FaBan } from 'react-icons/fa';
import { useMySubscription } from '../hooks/useUsers';
import { cancelSubscription } from '../api/subscriptions';
import { getApiError } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingScreen } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/format';

export function SubscriptionPage() {
	const qc = useQueryClient();
	const { data: subscription, isLoading } = useMySubscription();

	const handleCancel = async () => {
		if (!subscription) {
			return;
		}
		if (!confirm('Deseja cancelar a sua assinatura?')) {
			return;
		}
		try {
			await cancelSubscription(subscription.id);
			toast.success('Assinatura cancelada.');
			void qc.invalidateQueries({ queryKey: ['my-subscription'] });
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	if (isLoading) {
		return <LoadingScreen label="A carregar assinatura…" />;
	}

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<div className="text-center">
				<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
					<FaCrown className="h-6 w-6" />
				</div>
				<h1 className="font-display text-2xl">Minha assinatura</h1>
			</div>

			{!subscription ? (
				<Card className="p-8 text-center">
					<p className="text-muted">
						Ainda não tem uma assinatura ativa. Com o Kusumba Pass
						pode destacar os seus anúncios e aumentar a sua
						visibilidade.
					</p>
					<div className="mt-5">
						<Button to="/planos" variant="accent">
							Ver planos
						</Button>
					</div>
				</Card>
			) : (
				<Card className="overflow-hidden">
					<div className="bg-accent p-6 text-white">
						<p className="text-sm uppercase tracking-wide text-accent/80">
							Plano
						</p>
						<p className="font-display text-3xl">
							{subscription.plan?.name ?? 'Kusumba Pass'}
						</p>
					</div>
					<div className="space-y-4 p-6">
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-2 text-sm text-muted">
								<FaCalendarAlt className="h-4 w-4" />
								Início
							</span>
							<span className="text-sm font-medium text-slate-800">
								{formatDate(subscription.startDate)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-2 text-sm text-muted">
								<FaCalendarAlt className="h-4 w-4" />
								Fim
							</span>
							<span className="text-sm font-medium text-slate-800">
								{formatDate(subscription.endDate)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted">
								Renovação automática
							</span>
							<Badge
								tone={
									subscription.autoRenew
										? 'success'
										: 'neutral'
								}
							>
								{subscription.autoRenew
									? 'Ativa'
									: 'Desativada'}
							</Badge>
						</div>
						<div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
							{subscription.status === 'ACTIVE' && (
								<Button variant="ghost" onClick={handleCancel}>
									<FaBan className="h-4 w-4" />
									Cancelar
								</Button>
							)}
							<Button to="/planos">Alterar plano</Button>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
