import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReview, listReviews } from '../api/reviews';

export function useAdReviews(adId: string | undefined) {
	return useQuery({
		queryKey: ['reviews', adId],
		queryFn: () => listReviews({ adId }),
		enabled: Boolean(adId),
	});
}

export function useUserReviews(revieweeId: string | undefined) {
	return useQuery({
		queryKey: ['reviews', 'user', revieweeId],
		queryFn: () => listReviews({ revieweeId }),
		enabled: Boolean(revieweeId),
	});
}

export function useCreateReview(adId: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: { rating: number; comment?: string }) =>
			createReview({ adId, ...input }),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['reviews', adId] });
			void qc.invalidateQueries({ queryKey: ['ad', adId] });
		},
	});
}
