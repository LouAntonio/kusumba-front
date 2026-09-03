import { api } from '../lib/axios';
import type {
	GalleryItem,
	Paginated,
	Report,
	ReportReason,
	ReportStatus,
	ReportTarget,
} from '../lib/types';

export async function createReport(input: {
	targetType: ReportTarget;
	targetId: string;
	reason: ReportReason;
	description?: string;
	media?: GalleryItem[];
}): Promise<Report> {
	const { data } = await api.post<Report>('/api/reports', input);
	return data;
}

export async function countReports(targetType: ReportTarget, targetId: string) {
	const { data } = await api.get<{ count: number }>('/api/reports/count', {
		params: { targetType, targetId },
	});
	return data;
}

export async function listReports(params?: {
	status?: ReportStatus;
	targetType?: ReportTarget;
	targetId?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<Report>> {
	const { data } = await api.get<Paginated<Report>>('/api/reports', {
		params,
	});
	return data;
}

export async function updateReportStatus(
	id: string,
	status: ReportStatus,
): Promise<Report> {
	const { data } = await api.patch<Report>(`/api/reports/${id}/status`, {
		status,
	});
	return data;
}
