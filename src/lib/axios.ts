import axios, { AxiosError } from 'axios';
import { getToken } from './token';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? API_URL;

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.set('Authorization', `Bearer ${token}`);
	}
	return config;
});

export interface ApiErrorPayload {
	message?: string | string[];
	error?: string;
	statusCode?: number;
}

export function getApiError(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<ApiErrorPayload>;
		const payload = axiosError.response?.data;
		if (typeof payload?.message === 'string') {
			return payload.message;
		}
		if (Array.isArray(payload?.message) && payload.message.length > 0) {
			return payload.message[0];
		}
		if (typeof payload?.error === 'string') {
			return payload.error;
		}
		if (axiosError.response?.statusText) {
			return axiosError.response.statusText;
		}
		return 'Ocorreu um erro na ligação ao servidor.';
	}
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return 'Ocorreu um erro inesperado.';
}
