import { api } from '../lib/axios';
import type {
	Conversation,
	GalleryItem,
	Message,
	Paginated,
} from '../lib/types';

export async function listConversations(params?: {
	page?: number;
	limit?: number;
}): Promise<Paginated<Conversation>> {
	const { data } = await api.get<Paginated<Conversation>>(
		'/api/conversations',
		{ params },
	);
	return data;
}

export async function getConversation(id: string): Promise<Conversation> {
	const { data } = await api.get<Conversation>(`/api/conversations/${id}`);
	return data;
}

export async function createConversation(adId: string): Promise<Conversation> {
	const { data } = await api.post<Conversation>('/api/conversations', {
		adId,
	});
	return data;
}

export async function getMessages(
	conversationId: string,
	params?: { limit?: number; before?: string },
): Promise<{ items: Message[]; hasMore: boolean }> {
	const { data } = await api.get<{ items: Message[]; hasMore: boolean }>(
		`/api/conversations/${conversationId}/messages`,
		{ params },
	);
	return data;
}

export async function sendMessageRest(
	conversationId: string,
	input: { content?: string; media?: GalleryItem[] },
): Promise<{ message: Message }> {
	const { data } = await api.post<{ message: Message }>(
		`/api/conversations/${conversationId}/messages`,
		input,
	);
	return data;
}

export async function markConversationRead(
	conversationId: string,
): Promise<void> {
	await api.post(`/api/conversations/${conversationId}/read`);
}
