import { api } from '../lib/axios';
import type { Category } from '../lib/types';

export async function listCategories(): Promise<Category[]> {
	const { data } = await api.get<Category[]>('/api/categories');
	return data;
}

export async function getCategory(slug: string): Promise<Category> {
	const { data } = await api.get<Category>(`/api/categories/${slug}`);
	return data;
}
