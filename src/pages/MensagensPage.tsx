import { Link } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';
import { useConversations } from '../hooks/useChat';
import { useChatSocket } from '../hooks/useChatSocket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { formatKz, timeAgo } from '../lib/format';
import { getApiError } from '../lib/axios';

export function MensagensPage() {
	useChatSocket();
	const user = useAuthStore((s) => s.user);
	const myId = user?.id;
	const presence = useChatStore((s) => s.presence);
	const { data, isLoading, error } = useConversations();

	const conversations = data?.items ?? [];

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<div>
				<h1 className="font-display text-2xl">Mensagens</h1>
				<p className="text-sm text-muted">
					Conversas sobre os seus anúncios.
				</p>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
						>
							<Skeleton className="h-12 w-12 shrink-0 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-2/3" />
								<Skeleton className="h-3 w-1/3" />
							</div>
						</div>
					))}
				</div>
			) : error ? (
				<p className="text-sm text-red-600">{getApiError(error)}</p>
			) : conversations.length === 0 ? (
				<EmptyState
					icon={<FaCommentDots />}
					title="Sem mensagens"
					description="Quando alguém contactar sobre um anúncio, a conversa aparece aqui."
					action={<Button to="/anuncios">Explorar anúncios</Button>}
				/>
			) : (
				<div className="space-y-3">
					{conversations.map((conversation) => (
						<Link
							key={conversation.id}
							to={`/mensagens/${conversation.id}`}
							className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-primary-300 hover:shadow-sm"
						>
							<div className="relative shrink-0">
								<Avatar
									image={conversation.other?.image}
									name={
										conversation.other?.name ?? 'Conversa'
									}
								/>
								{conversation.other &&
									(conversation.other.id === myId
										? null
										: presence[conversation.other.id]
												?.online) && (
										<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
									)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-baseline justify-between gap-2">
									<p className="truncate font-medium text-slate-800">
										{conversation.other?.name}{' '}
										{conversation.other?.surname ?? ''}
									</p>
									{conversation.lastMessage && (
										<span className="shrink-0 text-xs text-muted">
											{timeAgo(
												conversation.lastMessage
													.createdAt,
											)}
										</span>
									)}
								</div>
								{conversation.ad && (
									<p className="truncate text-xs text-primary-600">
										{conversation.ad.title}
										{conversation.ad.price != null &&
											` · ${formatKz(
												conversation.ad.price,
											)}`}
									</p>
								)}
								<p className="mt-0.5 truncate text-sm text-muted">
									{conversation.lastMessage
										? (conversation.lastMessage.senderId ===
											myId
												? 'Você: '
												: '') +
											(conversation.lastMessage.content ||
												'📷 Imagem')
										: 'Inicie a conversa'}
								</p>
							</div>
							{(conversation.unreadCount ?? 0) > 0 && (
								<Badge tone="accent">
									{conversation.unreadCount}
								</Badge>
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
