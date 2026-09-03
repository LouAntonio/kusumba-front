import { api } from '../lib/axios';
import type { Paginated, WishlistItem } from '../lib/types';

export async function listWishlist(params?: {
	page?: number;
	limit?: number;
}): Promise<Paginated<WishlistItem>> {
	const { data } = await api.get<Paginated<WishlistItem>>('/api/wishlist', {
		params,
	});
	return data;
}

export async function checkWishlist(adId: string): Promise<{
	inWishlist: boolean;
}> {
	const { data } = await api.get<{ inWishlist: boolean }>(
		`/api/wishlist/check/${adId}`,
	);
	return data;
}

export async function addToWishlist(adId: string): Promise<WishlistItem> {
	const { data } = await api.post<WishlistItem>('/api/wishlist', {
		adId,
	});
	return data;
}

export async function removeFromWishlist(adId: string): Promise<void> {
	await api.delete(`/api/wishlist/${adId}`);
}
