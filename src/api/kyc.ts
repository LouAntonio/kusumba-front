import { api } from '../lib/axios';
import type { KYC, KYCStatus } from '../lib/types';

export async function getMyKyc(): Promise<KYC | null> {
	try {
		const { data } = await api.get<KYC>('/api/kyc/me');
		return data;
	} catch {
		return null;
	}
}

export async function submitKyc(input: {
	biFrontUrl: string;
	biFrontId: string;
	biBackUrl: string;
	biBackId: string;
	selfies?: { url: string; cloudinaryId: string }[];
}): Promise<KYC> {
	const { data } = await api.post<KYC>('/api/kyc', input);
	return data;
}

export async function reviewKyc(
	id: string,
	input: { status: KYCStatus; rejectionReason?: string },
): Promise<KYC> {
	const { data } = await api.patch<KYC>(`/api/kyc/${id}/review`, input);
	return data;
}
