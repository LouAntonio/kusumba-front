import { useEffect, type ReactNode } from 'react';
import { getSession } from '../lib/auth';
import { useAuthStore } from '../store/authStore';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { useChatStore } from '../store/chatStore';

export function AuthProvider({ children }: { children: ReactNode }) {
	const setUser = useAuthStore((s) => s.setUser);
	const setLoading = useAuthStore((s) => s.setLoading);
	const user = useAuthStore((s) => s.user);
	const resetChat = useChatStore((s) => s.reset);

	useEffect(() => {
		let active = true;
		getSession()
			.then((session) => {
				if (!active) {
					return;
				}
				setUser(session?.user ?? null);
			})
			.finally(() => {
				if (active) {
					setLoading(false);
				}
			});
		return () => {
			active = false;
		};
	}, [setUser, setLoading]);

	useEffect(() => {
		if (user) {
			connectSocket();
		} else {
			disconnectSocket();
			resetChat();
		}
		return () => {
			/* socket lifecycle managed globally */
		};
	}, [user, resetChat]);

	return <>{children}</>;
}
