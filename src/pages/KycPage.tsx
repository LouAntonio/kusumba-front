import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
	FaShieldAlt,
	FaCheckCircle,
	FaTimesCircle,
	FaHourglassHalf,
	FaUpload,
} from 'react-icons/fa';
import { useMyKyc } from '../hooks/useUsers';
import { submitKyc } from '../api/kyc';
import { uploadImage } from '../api/cloudinary';
import { getApiError } from '../lib/axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingScreen, Spinner } from '../components/ui/Spinner';
import type { KYCStatus } from '../lib/types';

type DocUpload = { url: string; cloudinaryId: string } | null;

const STATUS_LABEL: Record<KYCStatus, string> = {
	PENDING: 'Em análise',
	APPROVED: 'Aprovado',
	REJECTED: 'Rejeitado',
};

export function KycPage() {
	const qc = useQueryClient();
	const { data: kyc, isLoading } = useMyKyc();
	const [front, setFront] = useState<DocUpload>(null);
	const [back, setBack] = useState<DocUpload>(null);
	const [uploading, setUploading] = useState<'front' | 'back' | null>(null);
	const [submitting, setSubmitting] = useState(false);

	if (isLoading) {
		return <LoadingScreen label="A verificar…" />;
	}

	const handleUpload = async (
		file: File | undefined,
		side: 'front' | 'back',
	) => {
		if (!file) {
			return;
		}
		setUploading(side);
		try {
			const uploaded = await uploadImage(file, { folder: 'kyc' });
			if (side === 'front') {
				setFront({
					url: uploaded.url,
					cloudinaryId: uploaded.cloudinaryId,
				});
			} else {
				setBack({
					url: uploaded.url,
					cloudinaryId: uploaded.cloudinaryId,
				});
			}
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setUploading(null);
		}
	};

	const handleSubmit = async () => {
		if (!front || !back) {
			toast.error('Envie a frente e o verso do seu BI.');
			return;
		}
		setSubmitting(true);
		try {
			await submitKyc({
				biFrontUrl: front.url,
				biFrontId: front.cloudinaryId,
				biBackUrl: back.url,
				biBackId: back.cloudinaryId,
			});
			toast.success('Submissão enviada para análise.');
			void qc.invalidateQueries({ queryKey: ['kyc'] });
			void qc.invalidateQueries({ queryKey: ['me'] });
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div className="flex items-center gap-3">
				<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
					<FaShieldAlt className="h-5 w-5" />
				</div>
				<div>
					<h1 className="font-display text-2xl">
						Verificação de identidade
					</h1>
					<p className="text-sm text-muted">
						Aumente a confiança na comunidade comprovando a sua
						identidade.
					</p>
				</div>
			</div>

			{kyc && (
				<Card className="p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-slate-800">
								Estado da submissão
							</p>
							<p className="text-sm text-muted">
								Submetida em{' '}
								{new Date(kyc.createdAt).toLocaleDateString(
									'pt-AO',
								)}
							</p>
						</div>
						<Badge
							tone={
								kyc.status === 'APPROVED'
									? 'success'
									: kyc.status === 'REJECTED'
										? 'danger'
										: 'warning'
							}
						>
							{kyc.status === 'APPROVED' ? (
								<FaCheckCircle className="h-3 w-3" />
							) : kyc.status === 'REJECTED' ? (
								<FaTimesCircle className="h-3 w-3" />
							) : (
								<FaHourglassHalf className="h-3 w-3" />
							)}
							{STATUS_LABEL[kyc.status]}
						</Badge>
					</div>
					{kyc.status === 'REJECTED' && kyc.rejectionReason && (
						<p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
							Motivo: {kyc.rejectionReason}
						</p>
					)}
				</Card>
			)}

			{(!kyc || kyc.status === 'REJECTED') && (
				<Card className="space-y-5 p-6">
					<p className="text-sm text-slate-600">
						Envie uma foto da frente e do verso do seu BI (Bilhete
						de Identidade). As imagens são tratadas com
						confidencialidade.
					</p>

					<div className="grid gap-4 sm:grid-cols-2">
						<DocField
							label="Frente do BI"
							doc={front}
							uploading={uploading === 'front'}
							onPick={(f) => handleUpload(f, 'front')}
						/>
						<DocField
							label="Verso do BI"
							doc={back}
							uploading={uploading === 'back'}
							onPick={(f) => handleUpload(f, 'back')}
						/>
					</div>

					<div className="flex justify-end border-t border-slate-200 pt-4">
						<Button
							onClick={handleSubmit}
							disabled={submitting || !front || !back}
						>
							{submitting ? 'A submeter…' : 'Submeter'}
						</Button>
					</div>
				</Card>
			)}

			{kyc?.status === 'APPROVED' && (
				<Card className="flex items-center gap-3 border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
					<FaCheckCircle className="h-6 w-6" />
					<p>
						A sua identidade foi verificada. Agora pode construir
						confiança na comunidade.
					</p>
				</Card>
			)}
		</div>
	);
}

function DocField({
	label,
	doc,
	uploading,
	onPick,
}: {
	label: string;
	doc: DocUpload;
	uploading: boolean;
	onPick: (file: File | undefined) => void;
}) {
	return (
		<div className="space-y-2">
			<span className="text-sm font-medium text-slate-700">{label}</span>
			<label className="flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 text-muted transition hover:border-primary-400 hover:text-primary-600">
				{uploading ? (
					<Spinner />
				) : doc ? (
					<img
						src={doc.url}
						alt=""
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex flex-col items-center gap-2 text-sm">
						<FaUpload className="h-6 w-6" />
						Clique para enviar
					</div>
				)}
				<input
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(e) => onPick(e.target.files?.[0])}
					disabled={uploading}
				/>
			</label>
		</div>
	);
}
