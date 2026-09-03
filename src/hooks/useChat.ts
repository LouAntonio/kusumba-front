import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createConversation,
	getMessages,
	listConversations,
} from '../api/chat';

export function useConversations(page = 1, limit = 20) {
	return useQuery({
		queryKey: ['conversations', page, limit],
		queryFn: () => listConversations({ page, limit }),
	});
}

export function useConversationMessages(conversationId: string | undefined) {
	return useQuery({
		queryKey: ['messages', conversationId],
		queryFn: () => getMessages(conversationId as string),
		enabled: Boolean(conversationId),
		select: (data) => data.items,
	});
}

export function useCreateConversation() {
	return useMutation({
		mutationFn: (adId: string) => createConversation(adId),
	});
}
