import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaCheck, FaBan } from 'react-icons/fa';
import { useReports, useUpdateReportStatus } from '../hooks/useReports';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../lib/format';
import { getApiError } from '../lib/axios';
import {
	REPORT_REASON_LABELS,
	REPORT_TARGET_LABELS,
	type ReportStatus,
} from '../lib/types';

const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
	PENDING: 'Pendente',
	REVIEWED: 'Em revisão',
	RESOLVED: 'Resolvida',
	DISMISSED: 'Arquivada',
};

export function ReportsPage() {
	const user = useAuthStore((s) => s.user);
	const [filter, setFilter] = useState<ReportStatus | 'ALL'>('ALL');
	const { data, isLoading } = useReports({
		...(filter !== 'ALL' ? { status: filter } : {}),
		limit: 50,
	});
	const updateStatus = useUpdateReportStatus();
	const reports = data?.items ?? [];
	const isModerator = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	if (!isModerator) {
		return (
			<div className="mx-auto max-w-xl py-16 text-center">
				<FaShieldAlt className="mx-auto mb-3 h-10 w-10 text-muted" />
				<h1 className="font-display text-xl">Acesso restrito</h1>
				<p className="mt-2 text-sm text-muted">
					Esta página é reservada a moderadores.
				</p>
			</div>
		);
	}

	const handleStatus = (id: string, status: ReportStatus) => {
		updateStatus.mutate(
			{ id, status },
			{
				onError: (e) => toast.error(getApiError(e)),
			},
		);
	};

	const filters: { value: ReportStatus | 'ALL'; label: string }[] = [
		{ value: 'ALL', label: 'Todas' },
		{ value: 'PENDING', label: 'Pendentes' },
		{ value: 'REVIEWED', label: 'Em revisão' },
		{ value: 'RESOLVED', label: 'Resolvidas' },
		{ value: 'DISMISSED', label: 'Arquivadas' },
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl">Denúncias</h1>
				<p className="text-sm text-muted">
					Moderação de denúncias da comunidade.
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				{filters.map((f) => (
					<button
						key={f.value}
						onClick={() => setFilter(f.value)}
						className={
							'rounded-full px-4 py-1.5 text-sm transition ' +
							(filter === f.value
								? 'bg-primary-600 text-white'
								: 'border border-slate-300 text-slate-600 hover:bg-slate-100')
						}
					>
						{f.label}
					</button>
				))}
			</div>

			{isLoading ? (
				<Spinner className="mx-auto" />
			) : reports.length === 0 ? (
				<EmptyState title="Sem denúncias" />
			) : (
				<div className="space-y-3">
					{reports.map((report) => (
						<Card key={report.id} className="p-5">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<div className="flex items-center gap-3">
									<Badge tone="danger">
										{
											REPORT_TARGET_LABELS[
												report.targetType
											]
										}
									</Badge>
									<Badge tone="warning">
										{REPORT_REASON_LABELS[report.reason]}
									</Badge>
									<Badge
										tone={
											report.status === 'RESOLVED'
												? 'success'
												: report.status === 'DISMISSED'
													? 'neutral'
													: 'warning'
										}
									>
										{REPORT_STATUS_LABEL[report.status]}
									</Badge>
								</div>
								<span className="text-xs text-muted">
									{formatDate(report.createdAt)}
								</span>
							</div>
							{report.targetType === 'AD' && (
								<p className="mt-3 text-sm text-slate-700">
									Alvo:{' '}
									<span className="font-medium">
										{report.targetId}
									</span>
								</p>
							)}
							{report.description && (
								<p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
									{report.description}
								</p>
							)}
							{report.media.length > 0 && (
								<div className="mt-3 flex gap-2">
									{report.media.map((m, i) => (
										<img
											key={m.cloudinaryId + i}
											src={m.url}
											alt=""
											className="h-16 w-16 rounded-lg object-cover"
										/>
									))}
								</div>
							)}
							<div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
								{(report.status === 'PENDING' ||
									report.status === 'REVIEWED') && (
									<>
										<Button
											size="sm"
											onClick={() =>
												handleStatus(
													report.id,
													'RESOLVED',
												)
											}
										>
											<FaCheck className="h-3 w-3" />
											Resolver
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handleStatus(
													report.id,
													'DISMISSED',
												)
											}
										>
											<FaBan className="h-3 w-3" />
											Arquivar
										</Button>
									</>
								)}
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
