import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPaperPlane, FaMapMarkerAlt, FaChevronLeft } from 'react-icons/fa';
import { api } from '../lib/axios';
import { getSocket } from '../lib/socket';
import { useConversationMessages } from '../hooks/useChat';
import { useChatSocket } from '../hooks/useChatSocket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { Skeleton } from '../components/ui/Skeleton';
import { formatTime } from '../lib/format';
import { getApiError } from '../lib/axios';
import type { Conversation, Message } from '../lib/types';

export function ConversaPage() {
	const { conversationId } = useParams();
	useChatSocket();
	const user = useAuthStore((s) => s.user);
	const myId = user?.id;
	const { data: messages, isLoading } =
		useConversationMessages(conversationId);
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [draft, setDraft] = useState('');
	const [sending, setSending] = useState(false);
	const typing = useChatStore((s) => {
		if (!conversationId || !conversation?.other?.id) {
			return false;
		}
		return Boolean(s.typing[conversationId]?.[conversation.other.id]);
	});
	const presence = useChatStore((s) =>
		conversation?.other?.id ? s.presence[conversation.other.id] : undefined,
	);
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!conversationId) {
			return;
		}
		api.get<Conversation>(`/api/conversations/${conversationId}`)
			.then(({ data }) => {
				setConversation(data);
				const socket = getSocket();
				socket?.emit('conversation:join', { conversationId });
				socket?.emit('conversation:read', { conversationId });
				void api.post(`/api/conversations/${conversationId}/read`);
			})
			.catch(() => {
				/* erro tratado pelo estado vazio */
			});
		return () => {
			if (conversationId) {
				getSocket()?.emit('conversation:leave', {
					conversationId,
				});
			}
		};
	}, [conversationId]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const send = () => {
		const content = draft.trim();
		if (!content || !conversationId) {
			return;
		}
		setSending(true);
		const socket = getSocket();
		if (socket?.connected) {
			socket.emit('message:send', { conversationId, content }, () => {
				setDraft('');
				setSending(false);
				getSocket()?.emit('message:typing', {
					conversationId,
					isTyping: false,
				});
			});
		} else {
			api.post(`/api/conversations/${conversationId}/messages`, {
				content,
			})
				.then(() => setDraft(''))
				.catch((e) => {
					alert(getApiError(e));
				})
				.finally(() => setSending(false));
		}
	};

	const handleTyping = (isTyping: boolean) => {
		if (!conversationId) {
			return;
		}
		getSocket()?.emit('message:typing', {
			conversationId,
			isTyping,
		});
	};

	if (isLoading) {
		return (
			<div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
				<div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-8 w-8 rounded-full" />
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
				<div className="flex-1 space-y-3 overflow-y-auto p-4">
					<div className="flex justify-start">
						<Skeleton className="h-10 w-64 rounded-2xl rounded-tl-md" />
					</div>
					<div className="flex justify-end">
						<Skeleton className="h-10 w-48 rounded-2xl rounded-tr-md" />
					</div>
					<div className="flex justify-start">
						<Skeleton className="h-10 w-56 rounded-2xl rounded-tl-md" />
					</div>
					<div className="flex justify-end">
						<Skeleton className="h-10 w-40 rounded-2xl rounded-tr-md" />
					</div>
				</div>
				<div className="border-t border-slate-200 p-3">
					<Skeleton className="h-12 w-full rounded-xl" />
				</div>
			</div>
		);
	}

	const other = conversation?.other;
	const otherOnline = other && (other.id === myId ? false : presence?.online);

	return (
		<div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
			<div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
				<Link
					to="/mensagens"
					className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
					aria-label="Voltar"
				>
					<FaChevronLeft className="h-4 w-4" />
				</Link>
				<Avatar
					image={other?.image}
					name={other?.name ?? 'Conversa'}
					size="sm"
				/>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold text-slate-800">
						{other?.name} {other?.surname ?? ''}
					</p>
					{conversation?.ad && (
						<Link
							to={`/anuncios/${conversation.ad.slug}`}
							className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
						>
							<FaMapMarkerAlt className="h-3 w-3" />
							{conversation.ad.title}
						</Link>
					)}
				</div>
				{otherOnline ? (
					<span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						Online
					</span>
				) : (
					<span className="text-xs text-muted">Offline</span>
				)}
			</div>

			<div className="flex-1 space-y-3 overflow-y-auto p-4">
				{(messages ?? []).map((message) => (
					<MessageBubble
						key={message.id}
						message={message}
						isMine={message.senderId === myId}
					/>
				))}
				{typing && (
					<div className="max-w-[70%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-2 text-sm text-muted">
						<span className="animate-pulse">a escrever…</span>
					</div>
				)}
				<div ref={endRef} />
			</div>

			<div className="border-t border-slate-200 p-3">
				<div className="flex items-end gap-2">
					<textarea
						value={draft}
						onChange={(e) => {
							setDraft(e.target.value);
							handleTyping(e.target.value.length > 0);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								send();
							}
						}}
						rows={1}
						placeholder="Escreva uma mensagem…"
						className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm"
					/>
					<button
						onClick={send}
						disabled={!draft.trim() || sending}
						className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-50"
						aria-label="Enviar"
					>
						{sending ? (
							<Spinner size="sm" />
						) : (
							<FaPaperPlane className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

function MessageBubble({
	message,
	isMine,
}: {
	message: Message;
	isMine: boolean;
}) {
	return (
		<div className={isMine ? 'flex justify-end' : 'flex justify-start'}>
			<div
				className={
					'max-w-[70%] rounded-2xl px-4 py-2 text-sm ' +
					(isMine
						? 'rounded-tr-md bg-primary-600 text-white'
						: 'rounded-tl-md bg-slate-100 text-slate-800')
				}
			>
				{message.content && (
					<p className="whitespace-pre-wrap break-words">
						{message.content}
					</p>
				)}
				{message.media && message.media.length > 0 && (
					<div className="mt-1 flex flex-wrap gap-1">
						{message.media.map((m, i) => (
							<img
								key={m.cloudinaryId + i}
								src={m.url}
								alt=""
								className="h-20 w-20 rounded-lg object-cover"
							/>
						))}
					</div>
				)}
				<p
					className={
						'mt-1 text-right text-[10px] ' +
						(isMine ? 'text-primary-100' : 'text-muted')
					}
				>
					{formatTime(message.createdAt) ||
						new Date(message.createdAt).toLocaleTimeString(
							'pt-AO',
							{
								hour: '2-digit',
								minute: '2-digit',
							},
						)}
				</p>
			</div>
		</div>
	);
}
