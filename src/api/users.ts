import { api } from '../lib/axios';
import type { PublicUser, User } from '../lib/types';

export async function getMe(): Promise<User> {
	const { data } = await api.get<User>('/api/users/me');
	return data;
}

export async function getPublicUser(id: string): Promise<PublicUser> {
	const { data } = await api.get<PublicUser>(`/api/users/public/${id}`);
	return data;
}

export async function updateProfile(
	input: Partial<
		Pick<
			User,
			| 'name'
			| 'surname'
			| 'phone'
			| 'neighborhood'
			| 'city'
			| 'province'
			| 'image'
		>
	>,
): Promise<User> {
	const { data } = await api.patch<User>('/api/users/me', input);
	return data;
}

export async function listUsers(params?: Record<string, unknown>) {
	const { data } = await api.get('/api/users', { params });
	return data;
}
