import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './axios';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
	return socket;
}

export function connectSocket(token?: string | null): Socket {
	if (socket) {
		return socket;
	}

	socket = io(SOCKET_URL, {
		withCredentials: true,
		transports: ['websocket', 'polling'],
		auth: token ? { token } : {},
		autoConnect: true,
	});

	return socket;
}

export function disconnectSocket(): void {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}
