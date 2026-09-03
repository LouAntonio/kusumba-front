import { api } from './axios';

export interface SessionUser {
	id: string;
	name: string;
	surname: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	role: string;
	banned: boolean;
	subscriptionTier?: string;
	isVerified?: boolean;
	trustScore?: number;
	neighborhood?: string;
	city?: string;
	phone?: string;
}

export interface GetSessionResponse {
	user: SessionUser;
	session: { id: string; createdAt: string; expiresAt: string };
}

export async function getSession(): Promise<GetSessionResponse | null> {
	try {
		const { data } = await api.get<GetSessionResponse>(
			'/api/auth/get-session',
		);
		return data;
	} catch {
		return null;
	}
}

export async function requestMagicLink(
	email: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/magic-link/request',
		{ email },
	);
	return data;
}

export async function verifyMagicLink(
	token: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/magic-link/verify',
		{ token },
	);
	return data;
}

export async function signInWithGoogleIdToken(
	idToken: string,
	accessToken?: string,
): Promise<GetSessionResponse> {
	const { data } = await api.post<GetSessionResponse>(
		'/api/auth/sign-in/social',
		{
			provider: 'google',
			idToken: {
				token: idToken,
				...(accessToken ? { accessToken } : {}),
			},
		},
	);
	return data;
}

export async function signOut(): Promise<void> {
	await api.post('/api/auth/sign-out');
}
