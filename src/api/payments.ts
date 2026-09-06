import { api } from '../lib/axios';
import type {
	Paginated,
	PaymentItem,
	PaymentStatus,
	PlatformBankAccount,
	PlatformConfig,
} from '../lib/types';

export interface MyPaymentsQuery {
	page?: number;
	limit?: number;
	role?: 'buyer' | 'seller';
	status?: PaymentStatus;
}

export async function createPayment(adId: string): Promise<PaymentItem> {
	const { data } = await api.post<PaymentItem>('/api/payments', { adId });
	return data;
}

export async function submitProof(
	id: string,
	input: { proofUrl: string; proofId: string },
): Promise<PaymentItem> {
	const { data } = await api.post<PaymentItem>(
		`/api/payments/${id}/proof`,
		input,
	);
	return data;
}

export async function cancelPayment(id: string): Promise<PaymentItem> {
	const { data } = await api.post<PaymentItem>(`/api/payments/${id}/cancel`);
	return data;
}

export async function listMyPayments(
	query: MyPaymentsQuery = {},
): Promise<Paginated<PaymentItem>> {
	const { data } = await api.get<Paginated<PaymentItem>>('/api/payments/me', {
		params: query,
	});
	return data;
}

export async function getMyPayment(id: string): Promise<PaymentItem> {
	const { data } = await api.get<PaymentItem>(`/api/payments/me/${id}`);
	return data;
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
	const { data } = await api.get<PlatformConfig>('/api/platform/config');
	return data;
}

export async function listPlatformBankAccounts(): Promise<
	PlatformBankAccount[]
> {
	const { data } = await api.get<PlatformBankAccount[]>(
		'/api/platform/bank-accounts',
	);
	return data;
}

export async function createPlatformBankAccount(
	input: Omit<PlatformBankAccount, 'id' | 'createdAt'>,
): Promise<PlatformBankAccount> {
	const { data } = await api.post<PlatformBankAccount>(
		'/api/platform/bank-accounts',
		input,
	);
	return data;
}

export async function updatePlatformBankAccount(
	id: string,
	input: Partial<
		Pick<
			PlatformBankAccount,
			'bankName' | 'bankHolder' | 'bankIban' | 'isActive'
		>
	>,
): Promise<PlatformBankAccount> {
	const { data } = await api.patch<PlatformBankAccount>(
		`/api/platform/bank-accounts/${id}`,
		input,
	);
	return data;
}

export async function removePlatformBankAccount(id: string): Promise<void> {
	await api.delete(`/api/platform/bank-accounts/${id}`);
}

export async function updatePlatformConfig(
	feePercent: number,
): Promise<PlatformConfig> {
	const { data } = await api.put<PlatformConfig>('/api/platform/config', {
		feePercent,
	});
	return data;
}
