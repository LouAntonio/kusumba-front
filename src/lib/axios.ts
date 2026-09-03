import axios, { AxiosError } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? API_URL;

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

export interface ApiErrorPayload {
	message?: string;
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
