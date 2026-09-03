import { api } from './axios';
import type { User } from './types';

export type SessionUser = User;

export interface GetSessionResponse {
	user: User;
	session: {
		id: string;
		token: string;
		createdAt: string;
		expiresAt: string;
	};
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

export async function signUp(
	name: string,
	surname: string,
	email: string,
	password: string,
): Promise<GetSessionResponse> {
	const { data } = await api.post<GetSessionResponse>(
		'/api/auth/sign-up/email',
		{ name, surname, email, password },
	);
	return data;
}

export async function signInEmail(
	email: string,
	password: string,
): Promise<GetSessionResponse> {
	const { data } = await api.post<GetSessionResponse>(
		'/api/auth/sign-in/email',
		{ email, password },
	);
	return data;
}

export async function forgotPassword(
	email: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/request-password-reset',
		{ email },
	);
	return data;
}

export async function resetPassword(
	token: string,
	newPassword: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/reset-password',
		{ token, newPassword },
	);
	return data;
}

export async function changePassword(
	currentPassword: string,
	newPassword: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/change-password',
		{ currentPassword, newPassword },
	);
	return data;
}

export async function setPassword(
	newPassword: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/set-password',
		{ newPassword },
	);
	return data;
}

export async function changeEmail(
	newEmail: string,
	callbackURL?: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/change-email',
		{
			newEmail,
			callbackURL: callbackURL ?? `${window.location.origin}/perfil`,
		},
	);
	return data;
}

export async function linkGoogleWithIdToken(
	idToken: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/link-social',
		{ provider: 'google', idToken: { token: idToken } },
	);
	return data;
}

export async function unlinkGoogle(
	accountId: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/unlink-account',
		{ accountId },
	);
	return data;
}

export interface SessionInfo {
	id: string;
	token: string;
	userId: string;
	ipAddress?: string | null;
	userAgent?: string | null;
	createdAt: string;
	expiresAt: string;
}

export async function listSessions(): Promise<SessionInfo[]> {
	const { data } = await api.get<SessionInfo[]>('/api/auth/list-sessions');
	return data;
}

export async function revokeSession(
	token: string,
): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/revoke-session',
		{ token },
	);
	return data;
}

export async function revokeOtherSessions(): Promise<{ status: boolean }> {
	const { data } = await api.post<{ status: boolean }>(
		'/api/auth/revoke-other-sessions',
	);
	return data;
}
