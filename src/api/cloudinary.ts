import { api } from '../lib/axios';
import { getApiError } from './ads';

interface SignedParams {
	cloudName: string;
	apiKey: string;
	timestamp: number;
	signature: string;
	folder?: string;
	publicId?: string;
}

export interface UploadResult {
	url: string;
	cloudinaryId: string;
}

export async function getSignedParams(): Promise<SignedParams> {
	const { data } = await api.get<SignedParams>('/api/cloudinary/sign');
	return data;
}

export async function uploadImage(
	file: File | Blob,
	options?: { folder?: string; publicId?: string },
): Promise<UploadResult> {
	const signed = await getSignedParams();
	const form = new FormData();
	form.append('file', file);
	form.append('api_key', signed.apiKey);
	form.append('timestamp', String(signed.timestamp));
	form.append('signature', signed.signature);
	if (signed.folder ?? options?.folder) {
		form.append('folder', signed.folder ?? options?.folder ?? '');
	}
	if (signed.publicId ?? options?.publicId) {
		form.append('public_id', signed.publicId ?? options?.publicId ?? '');
	}

	const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`;
	const response = await fetch(endpoint, { method: 'POST', body: form });
	if (!response.ok) {
		throw new Error('Falha ao enviar a imagem.');
	}
	const result = (await response.json()) as {
		secure_url?: string;
		url?: string;
		public_id: string;
	};
	return {
		url: result.secure_url ?? result.url ?? '',
		cloudinaryId: result.public_id,
	};
}

export { getApiError };
