import { useState } from 'react';
import { useMyReports } from '../hooks/useReports';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../lib/format';
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

export function MinhasDenunciasPage() {
	const [filter, setFilter] = useState<ReportStatus | 'ALL'>('ALL');
	const { data, isLoading } = useMyReports({
		...(filter !== 'ALL' ? { status: filter } : {}),
		limit: 50,
	});
	const reports = data?.items ?? [];

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
				<h1 className="font-display text-2xl">Minhas denúncias</h1>
				<p className="text-sm text-muted">
					Acompanhe o estado das denúncias que submeteu.
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
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
						>
							<div className="flex gap-2">
								<Skeleton className="h-6 w-20 rounded-full" />
								<Skeleton className="h-6 w-20 rounded-full" />
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-14 w-full rounded-lg" />
						</div>
					))}
				</div>
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
							<p className="mt-3 text-sm text-slate-700">
								Alvo:{' '}
								<span className="font-medium">
									{report.targetLabel ?? report.targetId}
								</span>
							</p>
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
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
