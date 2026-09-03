import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaFlag } from 'react-icons/fa';
import { createReport } from '../../api/reports';
import { getApiError } from '../../lib/axios';
import {
	REPORT_REASON_LABELS,
	type ReportReason,
	type ReportTarget,
} from '../../lib/types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const REASONS = (Object.keys(REPORT_REASON_LABELS) as ReportReason[]).map(
	(r) => ({ value: r, label: REPORT_REASON_LABELS[r] }),
);

export function ReportModal({
	open,
	onClose,
	targetType,
	targetId,
}: {
	open: boolean;
	onClose: () => void;
	targetType: ReportTarget;
	targetId: string;
}) {
	const [reason, setReason] = useState<ReportReason>('SPAM');
	const [description, setDescription] = useState('');
	const [submitting, setSubmitting] = useState(false);

	if (!open) {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await createReport({
				targetType,
				targetId,
				reason,
				description: description || undefined,
			});
			toast.success(
				'Denúncia enviada. Obrigado por ajudar a comunidade.',
			);
			onClose();
			setDescription('');
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
						<FaFlag className="h-4 w-4" />
					</div>
					<div>
						<h2 className="font-display text-lg">Denunciar</h2>
						<p className="text-sm text-muted">
							Ajude a manter a comunidade segura.
						</p>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Select
						label="Motivo"
						value={reason}
						onChange={(e) =>
							setReason(e.target.value as ReportReason)
						}
						options={REASONS}
					/>
					<Textarea
						label="Descrição (opcional)"
						placeholder="Descreva com mais detalhe o que se passa…"
						value={description}
						onChange={(e) =>
							setDescription(e.target.value.slice(0, 2000))
						}
						maxLength={2000}
					/>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost" onClick={onClose}>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="danger"
							disabled={submitting}
						>
							{submitting ? 'A enviar…' : 'Enviar denúncia'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
