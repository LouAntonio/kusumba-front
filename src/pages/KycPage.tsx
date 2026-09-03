import { useEffect, useMemo, useState } from 'react';
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
import { LoadingScreen } from '../components/ui/Spinner';
import type { KYCStatus } from '../lib/types';

const STATUS_LABEL: Record<KYCStatus, string> = {
	PENDING: 'Em análise',
	APPROVED: 'Aprovado',
	REJECTED: 'Rejeitado',
};

function useObjectUrl(file: File | null): string | null {
	return useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
}

export function KycPage() {
	const qc = useQueryClient();
	const { data: kyc, isLoading } = useMyKyc();
	const [frontFile, setFrontFile] = useState<File | null>(null);
	const [backFile, setBackFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const frontUrl = useObjectUrl(frontFile);
	const backUrl = useObjectUrl(backFile);

	useEffect(() => {
		return () => {
			if (frontUrl) {
				URL.revokeObjectURL(frontUrl);
			}
			if (backUrl) {
				URL.revokeObjectURL(backUrl);
			}
		};
	}, [frontUrl, backUrl]);

	if (isLoading) {
		return <LoadingScreen label="A verificar…" />;
	}

	const handleSubmit = async () => {
		if (!frontFile || !backFile) {
			toast.error('Envie a frente e o verso do seu BI.');
			return;
		}
		setSubmitting(true);
		setUploading(true);
		try {
			const [front, back] = await Promise.all([
				uploadImage(frontFile, { folder: 'kyc' }),
				uploadImage(backFile, { folder: 'kyc' }),
			]);
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
			setUploading(false);
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
							file={frontFile}
							previewUrl={frontUrl}
							onPick={setFrontFile}
						/>
						<DocField
							label="Verso do BI"
							file={backFile}
							previewUrl={backUrl}
							onPick={setBackFile}
						/>
					</div>

					<div className="flex justify-end border-t border-slate-200 pt-4">
						<Button
							onClick={handleSubmit}
							disabled={submitting || !frontFile || !backFile}
						>
							{submitting
								? uploading
									? 'A enviar…'
									: 'A submeter…'
								: 'Submeter'}
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
	file,
	previewUrl,
	onPick,
}: {
	label: string;
	file: File | null;
	previewUrl: string | null;
	onPick: (file: File | null) => void;
}) {
	return (
		<div className="space-y-2">
			<span className="text-sm font-medium text-slate-700">{label}</span>
			<label className="flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 text-muted transition hover:border-primary-400 hover:text-primary-600">
				{file && previewUrl ? (
					<img
						src={previewUrl}
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
					onChange={(e) => {
						onPick(e.target.files?.[0] ?? null);
						e.target.value = '';
					}}
				/>
			</label>
		</div>
	);
}
