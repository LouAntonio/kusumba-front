import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listMyReports, listReports, updateReportStatus } from '../api/reports';
import type { ReportStatus, ReportTarget } from '../lib/types';

export function useReports(params?: {
	status?: ReportStatus;
	targetType?: ReportTarget;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ['reports', params],
		queryFn: () => listReports(params),
	});
}

export function useMyReports(params?: {
	status?: ReportStatus;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ['reports', 'mine', params],
		queryFn: () => listMyReports(params),
	});
}

export function useUpdateReportStatus() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: ReportStatus }) =>
			updateReportStatus(id, status),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['reports'] });
		},
	});
}
