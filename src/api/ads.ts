import { api, getApiError } from '../lib/axios';
import type {
	Ad,
	AdQuery,
	AdStatus,
	AdType,
	AdVisibility,
	GalleryItem,
	Location,
	Paginated,
} from '../lib/types';

export interface CreateAdInput {
	title: string;
	description: string;
	price?: number;
	type?: AdType;
	slug?: string;
	tradefor?: string[];
	categoryIds: string[];
	image?: string;
	imageId?: string;
	gallery?: GalleryItem[];
	location?: Location;
}

export type UpdateAdInput = Partial<CreateAdInput>;

export async function listAds(query: AdQuery = {}): Promise<Paginated<Ad>> {
	const { data } = await api.get<Paginated<Ad>>('/api/ads', {
		params: query,
	});
	return data;
}

export async function getAd(idOrSlug: string): Promise<Ad> {
	const { data } = await api.get<Ad>(`/api/ads/${idOrSlug}`);
	return data;
}

export async function createAd(input: CreateAdInput): Promise<Ad> {
	const { data } = await api.post<Ad>('/api/ads', input);
	return data;
}

export async function updateAd(id: string, input: UpdateAdInput): Promise<Ad> {
	const { data } = await api.patch<Ad>(`/api/ads/${id}`, input);
	return data;
}

export async function setAdVisibility(
	id: string,
	visibility: AdVisibility,
): Promise<Ad> {
	const { data } = await api.patch<Ad>(`/api/ads/${id}/visibility`, {
		visibility,
	});
	return data;
}

export async function featureAd(id: string): Promise<Ad> {
	const { data } = await api.post<Ad>(`/api/ads/${id}/feature`);
	return data;
}

export async function unfeatureAd(id: string): Promise<Ad> {
	const { data } = await api.delete<Ad>(`/api/ads/${id}/feature`);
	return data;
}

export async function moderateAd(
	id: string,
	input: { verified?: boolean; status?: AdStatus },
): Promise<Ad> {
	const { data } = await api.patch<Ad>(`/api/ads/${id}/moderation`, input);
	return data;
}

export async function deleteAd(id: string): Promise<void> {
	await api.delete(`/api/ads/${id}`);
}

export { getApiError };
