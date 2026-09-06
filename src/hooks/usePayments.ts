import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	cancelPayment,
	createPayment,
	getMyPayment,
	getPlatformConfig,
	listMyPayments,
	submitProof,
	type MyPaymentsQuery,
} from '../api/payments';
import type { PaymentItem } from '../lib/types';

export function useMyPayments(query: MyPaymentsQuery = {}) {
	return useQuery({
		queryKey: ['payments', 'me', query],
		queryFn: () => listMyPayments(query),
	});
}

export function useMyPayment(id: string | undefined) {
	return useQuery({
		queryKey: ['payments', 'me', id],
		queryFn: () => getMyPayment(id as string),
		enabled: Boolean(id),
	});
}

function usePaymentsInvalidations() {
	const qc = useQueryClient();
	return (payment?: PaymentItem) => {
		void qc.invalidateQueries({ queryKey: ['payments'] });
		void qc.invalidateQueries({ queryKey: ['ads'] });
		if (payment?.ad?.id) {
			void qc.invalidateQueries({ queryKey: ['ad', payment.ad.id] });
		}
	};
}

export function useCreatePayment() {
	const invalidate = usePaymentsInvalidations();
	return useMutation({
		mutationFn: (adId: string) => createPayment(adId),
		onSuccess: invalidate,
	});
}

export function useSubmitProof() {
	const invalidate = usePaymentsInvalidations();
	return useMutation({
		mutationFn: ({
			id,
			proofUrl,
			proofId,
		}: {
			id: string;
			proofUrl: string;
			proofId: string;
		}) => submitProof(id, { proofUrl, proofId }),
		onSuccess: invalidate,
	});
}

export function useCancelPayment() {
	const invalidate = usePaymentsInvalidations();
	return useMutation({
		mutationFn: (id: string) => cancelPayment(id),
		onSuccess: invalidate,
	});
}

export function usePlatformConfig() {
	return useQuery({
		queryKey: ['platform', 'config'],
		queryFn: getPlatformConfig,
	});
}
