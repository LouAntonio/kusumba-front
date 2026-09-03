import { api } from '../lib/axios';
import type { Paginated, Plan } from '../lib/types';

export async function listPlans(params?: {
	page?: number;
	limit?: number;
	includeInactive?: boolean;
}): Promise<Paginated<Plan>> {
	const { data } = await api.get<Paginated<Plan>>('/api/plans', {
		params,
	});
	return data;
}

export async function getPlan(id: string): Promise<Plan> {
	const { data } = await api.get<Plan>(`/api/plans/${id}`);
	return data;
}

export async function createPlan(input: Partial<Plan>): Promise<Plan> {
	const { data } = await api.post<Plan>('/api/plans', input);
	return data;
}

export async function updatePlan(
	id: string,
	input: Partial<Plan>,
): Promise<Plan> {
	const { data } = await api.patch<Plan>(`/api/plans/${id}`, input);
	return data;
}

export async function deletePlan(id: string): Promise<void> {
	await api.delete(`/api/plans/${id}`);
}
