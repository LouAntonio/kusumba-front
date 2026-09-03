import { useEffect } from 'react';
import { getSocket, connectSocket } from '../lib/socket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '../lib/types';

export function useChatSocket() {
	const user = useAuthStore((s) => s.user);
	const setPresence = useChatStore((s) => s.setPresence);
	const setTyping = useChatStore((s) => s.setTyping);
	const setUnread = useChatStore((s) => s.setUnread);
	const qc = useQueryClient();

	useEffect(() => {
		if (!user) {
			return;
		}
		const socket = connectSocket();
		if (!socket.connected) {
			socket.connect();
		}

		const onMessageNew = (payload: {
			conversationId: string;
			message: Message;
		}) => {
			qc.setQueryData<{ items: Message[]; hasMore: boolean }>(
				['messages', payload.conversationId],
				(old) =>
					old
						? {
								...old,
								items: [...old.items, payload.message],
							}
						: old,
			);
			void qc.invalidateQueries({
				queryKey: ['conversations'],
			});
		};

		const onPresence = (payload: { userId: string; online: boolean }) => {
			setPresence(payload.userId, payload.online);
		};

		const onTyping = (payload: {
			conversationId: string;
			userId: string;
			isTyping: boolean;
		}) => {
			setTyping(payload.conversationId, payload.userId, payload.isTyping);
		};

		const onUnread = (payload: {
			conversationId: string;
			unreadCount: number;
		}) => {
			setUnread(payload.conversationId, payload.unreadCount);
		};

		const onConversationRead = (payload: {
			conversationId: string;
			readBy: string;
		}) => {
			void qc.invalidateQueries({
				queryKey: ['conversations'],
			});
			void qc.invalidateQueries({
				queryKey: ['messages', payload.conversationId],
			});
		};

		socket.on('message:new', onMessageNew);
		socket.on('presence:update', onPresence);
		socket.on('conversation:typing', onTyping);
		socket.on('conversation:unread', onUnread);
		socket.on('conversation:read', onConversationRead);

		return () => {
			socket.off('message:new', onMessageNew);
			socket.off('presence:update', onPresence);
			socket.off('conversation:typing', onTyping);
			socket.off('conversation:unread', onUnread);
			socket.off('conversation:read', onConversationRead);
		};
	}, [user, setPresence, setTyping, setUnread, qc]);

	return getSocket();
}
