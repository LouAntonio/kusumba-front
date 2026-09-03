import { api } from '../lib/axios';
import type { Paginated, Review } from '../lib/types';

export async function listReviews(params?: {
	adId?: string;
	revieweeId?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<Review>> {
	const { data } = await api.get<Paginated<Review>>('/api/reviews', {
		params,
	});
	return data;
}

export async function createReview(input: {
	adId: string;
	rating: number;
	comment?: string;
}): Promise<Review> {
	const { data } = await api.post<Review>('/api/reviews', input);
	return data;
}

export async function respondReview(
	id: string,
	response: string,
): Promise<Review> {
	const { data } = await api.patch<Review>(`/api/reviews/${id}/response`, {
		response,
	});
	return data;
}

export async function deleteReview(id: string): Promise<void> {
	await api.delete(`/api/reviews/${id}`);
}
