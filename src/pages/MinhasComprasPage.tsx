import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import {
	useCancelPayment,
	useMyPayments,
	useSubmitProof,
} from '../hooks/usePayments';
import { uploadImage } from '../api/cloudinary';
import { getApiError } from '../lib/axios';
import {
	PAYMENT_STATUS_LABELS,
	type PaymentItem,
	type PaymentStatus,
} from '../lib/types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatKz, formatDate } from '../lib/format';
import { cn } from '../lib/cn';

const STATUS_TONES: Record<
	PaymentStatus,
	'neutral' | 'warning' | 'success' | 'danger'
> = {
	PENDING: 'warning',
	UNDER_REVIEW: 'warning',
	APPROVED: 'success',
	RELEASED: 'success',
	REJECTED: 'danger',
	CANCELLED: 'neutral',
};

export function MinhasComprasPage() {
	const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
	const { data, isLoading } = useMyPayments({ role, limit: 50 });
	const cancelPayment = useCancelPayment();
	const [proofFor, setProofFor] = useState<PaymentItem | null>(null);

	const items = data?.items ?? [];

	const handleCancel = (item: PaymentItem) => {
		if (!window.confirm('Deseja cancelar esta compra?')) {
			return;
		}
		cancelPayment.mutate(item.id, {
			onSuccess: () => toast.success('Compra cancelada.'),
			onError: (error) => toast.error(getApiError(error)),
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="font-display text-2xl">
						{role === 'buyer'
							? 'Minhas compras'
							: 'As minhas vendas'}
					</h1>
					<p className="text-sm text-muted">
						Pagamentos por transferência bancária.
					</p>
				</div>
				<div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
					<button
						type="button"
						onClick={() => setRole('buyer')}
						className={cn(
							'rounded-md px-3 py-1.5 text-sm font-medium',
							role === 'buyer'
								? 'bg-primary-600 text-white'
								: 'text-slate-600 hover:bg-slate-100',
						)}
					>
						Compras
					</button>
					<button
						type="button"
						onClick={() => setRole('seller')}
						className={cn(
							'rounded-md px-3 py-1.5 text-sm font-medium',
							role === 'seller'
								? 'bg-primary-600 text-white'
								: 'text-slate-600 hover:bg-slate-100',
						)}
					>
						Vendas
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-2xl border border-slate-200 bg-white p-4"
						>
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="mt-2 h-4 w-1/2" />
							<Skeleton className="mt-2 h-4 w-1/4" />
						</div>
					))}
				</div>
			) : items.length === 0 ? (
				<EmptyState
					title={
						role === 'buyer'
							? 'Ainda não fez compras'
							: 'Ainda não tem vendas'
					}
					description={
						role === 'buyer'
							? 'Ao comprar um anúncio "Venda" com pagamento por transferência, acompanhe aqui o estado.'
							: 'Quando alguém comprar o seu anúncio, acompanhe aqui o pagamento.'
					}
					action={<Button to="/anuncios">Explorar anúncios</Button>}
				/>
			) : (
				<div className="space-y-3">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
						>
							<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
								{item.ad?.image ? (
									<img
										src={item.ad.image}
										alt=""
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-xs text-slate-300">
										Sem imagem
									</div>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									{item.ad ? (
										<Link
											to={`/anuncios/${item.ad.slug}`}
											className="truncate font-medium text-slate-800 hover:text-primary-700"
										>
											{item.ad.title}
										</Link>
									) : (
										<span className="font-medium text-slate-800">
											Anúncio removido
										</span>
									)}
									<Badge tone={STATUS_TONES[item.status]}>
										{PAYMENT_STATUS_LABELS[item.status]}
									</Badge>
								</div>
								<p className="mt-1 text-sm text-slate-600">
									{item.amount != null && (
										<span className="font-mono font-semibold text-slate-900">
											{formatKz(item.amount)}
										</span>
									)}{' '}
									{role === 'seller' && (
										<span className="text-xs text-muted">
											• recebe{' '}
											{formatKz(item.netToSeller)} (taxa{' '}
											{item.feePercent}%)
										</span>
									)}
								</p>
								<p className="text-xs text-muted">
									{formatDate(item.createdAt)}
									{item.buyer && role === 'seller'
										? ` • comprador: ${item.buyer.name}${
												item.buyer.surname
													? ` ${item.buyer.surname}`
													: ''
											}`
										: ''}
								</p>
							</div>
							{(item.status === 'PENDING' ||
								item.status === 'REJECTED') && (
								<div className="flex flex-wrap gap-2">
									<Button
										size="sm"
										variant={
											item.status === 'REJECTED'
												? 'danger'
												: 'accent'
										}
										onClick={() => setProofFor(item)}
									>
										{item.status === 'REJECTED'
											? 'Reenviar comprovativo'
											: 'Enviar comprovativo'}
									</Button>
									{item.status === 'PENDING' && (
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleCancel(item)}
										>
											Cancelar
										</Button>
									)}
								</div>
							)}
							{item.status === 'UNDER_REVIEW' &&
								item.proofUrl && (
									<div className="flex flex-wrap items-center gap-2">
										<a
											href={item.proofUrl}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
										>
											<FaExternalLinkAlt className="h-3 w-3" />
											Ver comprovativo
										</a>
										<span className="text-xs text-muted">
											A aguardar verificação
										</span>
									</div>
								)}
							{item.status === 'RELEASED' && (
								<span className="text-sm font-medium text-emerald-700">
									{role === 'seller'
										? `${formatKz(item.netToSeller)} libertado`
										: 'Concluída'}
								</span>
							)}
						</div>
					))}
				</div>
			)}

			{proofFor && (
				<ProofModal item={proofFor} onClose={() => setProofFor(null)} />
			)}
		</div>
	);
}

function ProofModal({
	item,
	onClose,
}: {
	item: PaymentItem;
	onClose: () => void;
}) {
	const submitProof = useSubmitProof();
	const [fileName, setFileName] = useState('');

	const handleFile = async (file: File) => {
		try {
			const uploaded = await uploadImage(file, {
				folder: 'comprovativos',
			});
			submitProof.mutate(
				{
					id: item.id,
					proofUrl: uploaded.url,
					proofId: uploaded.cloudinaryId,
				},
				{
					onSuccess: () => {
						toast.success(
							'Comprovativo enviado. Ficará a aguardar verificação.',
						);
						onClose();
					},
					onError: (error) => toast.error(getApiError(error)),
				},
			);
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-start justify-between gap-3">
					<div>
						<h2 className="font-display text-lg">
							Comprovativo de transferência
						</h2>
						<p className="text-sm text-muted">
							{item.ad?.title ?? 'Anúncio'}
						</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-md p-1 text-slate-400 hover:text-slate-600"
						aria-label="Fechar"
					>
						<FaTimes className="h-4 w-4" />
					</button>
				</div>

				{item.status === 'REJECTED' && (
					<p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{item.adminNote ||
							'O comprovativo foi recusado. Envie novamente.'}
					</p>
				)}

				{item.platformAccount && (
					<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
						<p className="font-semibold">
							{item.platformAccount.bankName}
						</p>
						<p>Titular: {item.platformAccount.bankHolder}</p>
						{item.platformAccount.bankIban && (
							<p className="font-mono text-xs text-muted">
								{item.platformAccount.bankIban}
							</p>
						)}
						<p className="mt-2 border-t border-slate-200 pt-2">
							Valor a transferir:{' '}
							<span className="font-mono font-semibold text-slate-900">
								{formatKz(item.amount)}
							</span>
						</p>
					</div>
				)}

				<label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 hover:border-primary-400 hover:text-primary-600">
					<input
						type="file"
						accept="image/*"
						disabled={submitProof.isPending}
						className="hidden"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (!file) {
								return;
							}
							if (!file.type.startsWith('image/')) {
								toast.error(
									'O comprovativo deve ser uma imagem.',
								);
								return;
							}
							setFileName(file.name);
							void handleFile(file);
						}}
					/>
					{fileName
						? submitProof.isPending
							? 'A enviar comprovativo…'
							: fileName
						: 'Escolher comprovativo…'}
				</label>
			</div>
		</div>
	);
}
