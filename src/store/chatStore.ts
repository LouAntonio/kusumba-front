import { create } from 'zustand';

interface ChatPresence {
	online: boolean;
}

interface ChatState {
	activeConversationId: string | null;
	presence: Record<string, ChatPresence>;
	typing: Record<string, Record<string, boolean>>;
	unreadCounts: Record<string, number>;
	setActiveConversation: (id: string | null) => void;
	setPresence: (userId: string, online: boolean) => void;
	setTyping: (
		conversationId: string,
		userId: string,
		isTyping: boolean,
	) => void;
	setUnread: (conversationId: string, count: number) => void;
	reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
	activeConversationId: null,
	presence: {},
	typing: {},
	unreadCounts: {},
	setActiveConversation: (id) => set({ activeConversationId: id }),
	setPresence: (userId, online) =>
		set((state) => ({
			presence: {
				...state.presence,
				[userId]: { online },
			},
		})),
	setTyping: (conversationId, userId, isTyping) =>
		set((state) => {
			const convo = state.typing[conversationId] ?? {};
			return {
				typing: {
					...state.typing,
					[conversationId]: {
						...convo,
						[userId]: isTyping,
					},
				},
			};
		}),
	setUnread: (conversationId, count) =>
		set((state) => ({
			unreadCounts: {
				...state.unreadCounts,
				[conversationId]: count,
			},
		})),
	reset: () =>
		set({
			activeConversationId: null,
			presence: {},
			typing: {},
			unreadCounts: {},
		}),
}));
