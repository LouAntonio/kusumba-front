import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addToWishlist,
	checkWishlist,
	listWishlist,
	removeFromWishlist,
} from '../api/wishlist';

export function useWishlist(page = 1, limit = 20) {
	return useQuery({
		queryKey: ['wishlist', page, limit],
		queryFn: () => listWishlist({ page, limit }),
	});
}

export function useWishlistCheck(adId: string | undefined) {
	return useQuery({
		queryKey: ['wishlist-check', adId],
		queryFn: () => checkWishlist(adId as string),
		enabled: Boolean(adId),
	});
}

export function useToggleWishlist() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (adId: string) => {
			return qc.getQueryData<{ inWishlist: boolean }>([
				'wishlist-check',
				adId,
			])?.inWishlist
				? removeFromWishlist(adId).then(() => ({
						inWishlist: false,
					}))
				: addToWishlist(adId).then(() => ({
						inWishlist: true,
					}));
		},
		onSuccess: (_data, adId) => {
			void qc.invalidateQueries({ queryKey: ['wishlist'] });
			void qc.invalidateQueries({ queryKey: ['wishlist-check', adId] });
		},
	});
}
