import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createAd,
	deleteAd,
	featureAd,
	getAd,
	listAds,
	moderateAd,
	unfeatureAd,
	updateAd,
	type CreateAdInput,
	type UpdateAdInput,
} from '../api/ads';
import type { AdQuery, AdStatus } from '../lib/types';

export function useAds(query: AdQuery = {}) {
	return useQuery({
		queryKey: ['ads', query],
		queryFn: () => listAds(query),
	});
}

export function useAd(idOrSlug: string | undefined) {
	return useQuery({
		queryKey: ['ad', idOrSlug],
		queryFn: () => getAd(idOrSlug as string),
		enabled: Boolean(idOrSlug),
	});
}

export function useCreateAd() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateAdInput) => createAd(input),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
		},
	});
}

export function useUpdateAd(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateAdInput) => updateAd(id, input),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
			void qc.invalidateQueries({ queryKey: ['ad', id] });
		},
	});
}

export function useDeleteAd() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteAd(id),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
		},
	});
}

export function useFeatureAd() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => featureAd(id),
		onSuccess: (_data, id) => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
			void qc.invalidateQueries({ queryKey: ['ad', id] });
		},
	});
}

export function useUnfeatureAd() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => unfeatureAd(id),
		onSuccess: (_data, id) => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
			void qc.invalidateQueries({ queryKey: ['ad', id] });
		},
	});
}

export function useModerateAd(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: { verified?: boolean; status?: AdStatus }) =>
			moderateAd(id, input),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ads'] });
			void qc.invalidateQueries({ queryKey: ['ad', id] });
		},
	});
}
