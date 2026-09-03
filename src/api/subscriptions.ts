import { api } from '../lib/axios';
import type { Paginated, Subscription, SubscriptionStatus } from '../lib/types';

export async function getMySubscription(): Promise<Subscription | null> {
	try {
		const { data } = await api.get<Subscription>('/api/subscriptions/me');
		return data;
	} catch {
		return null;
	}
}

export async function subscribe(planId: string): Promise<Subscription> {
	const { data } = await api.post<Subscription>('/api/subscriptions', {
		planId,
	});
	return data;
}

export async function cancelSubscription(id: string): Promise<Subscription> {
	const { data } = await api.delete<Subscription>(`/api/subscriptions/${id}`);
	return data;
}

export async function listSubscriptions(params?: {
	status?: SubscriptionStatus;
	userId?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<Subscription>> {
	const { data } = await api.get<Paginated<Subscription>>(
		'/api/subscriptions',
		{ params },
	);
	return data;
}

export async function manageSubscription(
	id: string,
	input: {
		status?: SubscriptionStatus;
		endDate?: string;
		autoRenew?: boolean;
	},
): Promise<Subscription> {
	const { data } = await api.patch<Subscription>(
		`/api/subscriptions/${id}`,
		input,
	);
	return data;
}
