import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
	FaDesktop,
	FaExclamationTriangle,
	FaMobileAlt,
} from 'react-icons/fa';
import { listSessions, revokeOtherSessions, revokeSession, type SessionInfo } from '../../lib/auth';
import { getApiError } from '../../lib/axios';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { formatDate } from '../../lib/format';

function isMobileAgent(ua: string | null | undefined): boolean {
	if (!ua) {
		return false;
	}
	return /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
}

export function SessionsSection() {
	const [sessions, setSessions] = useState<SessionInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [revokingToken, setRevokingToken] = useState<string | null>(null);
	const [revokingOthers, setRevokingOthers] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const data = await listSessions();
			setSessions(data);
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const handleRevoke = async (token: string) => {
		setRevokingToken(token);
		try {
			await revokeSession(token);
			toast.success('Sessão terminada.');
			setSessions((prev) => prev.filter((s) => s.token !== token));
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setRevokingToken(null);
		}
	};

	const handleRevokeOthers = async () => {
		setRevokingOthers(true);
		try {
			await revokeOtherSessions();
			toast.success('Outras sessões terminadas.');
			void refresh();
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setRevokingOthers(false);
		}
	};

	const current = sessions.find((s) => s.current === true) ?? null;

	return (
		<Card className="p-6">
			<h2 className="mb-5 flex items-center gap-2 font-display text-lg">
				<FaDesktop className="h-4 w-4 text-primary-500" />
				Sessões ativas
			</h2>

			{loading ? (
				<Spinner className="mx-auto" />
			) : sessions.length === 0 ? (
				<p className="text-sm text-muted">Sem sessões ativas.</p>
			) : (
				<div className="space-y-3">
					{sessions.map((session) => {
						const isCurrent = current?.id === session.id;
						return (
							<div
								key={session.id}
								className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
										{isMobileAgent(session.userAgent) ? (
											<FaMobileAlt className="h-4 w-4" />
										) : (
											<FaDesktop className="h-4 w-4" />
										)}
									</div>
									<div>
										<p className="text-sm font-medium text-slate-800">
											{session.userAgent ?? 'Dispositivo'}
											{isCurrent && (
												<span className="ml-2 rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
													Atual
												</span>
											)}
										</p>
										<p className="text-xs text-muted">
											Criada em{' '}
											{formatDate(session.createdAt)} ·
											expira{' '}
											{formatDate(session.expiresAt)}
										</p>
									</div>
								</div>
								{!isCurrent && (
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleRevoke(session.token)}
										disabled={revokingToken === session.token}
									>
										{revokingToken === session.token
											? 'A terminar…'
											: 'Terminar'}
									</Button>
								)}
							</div>
						);
					})}
				</div>
			)}

			{sessions.length > 1 && (
				<div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-3">
					<p className="flex items-center gap-2 text-sm text-amber-700">
						<FaExclamationTriangle className="h-4 w-4" />
						Terminar todas as outras sessões neste dispositivo.
					</p>
					<Button
						size="sm"
						variant="outline"
						onClick={handleRevokeOthers}
						disabled={revokingOthers}
					>
						{revokingOthers
							? 'A terminar…'
							: 'Terminar outras sessões'}
					</Button>
				</div>
			)}
		</Card>
	);
}
