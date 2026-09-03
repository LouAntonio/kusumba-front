import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
	FaShieldAlt,
	FaCheckCircle,
	FaTimesCircle,
	FaHourglassHalf,
	FaUpload,
	FaUserCircle,
} from 'react-icons/fa';
import { useMyKyc, useMe } from '../hooks/useUsers';
import { submitKyc } from '../api/kyc';
import { updateProfile } from '../api/users';
import { uploadImage } from '../api/cloudinary';
import { getApiError } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
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

const MIN_SELFIES = 4;
const MAX_SELFIES = 5;

function useObjectUrl(file: File | null): string | null {
	return useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
}

function useObjectUrls(files: File[]): string[] {
	const urls = useMemo(
		() => files.map((file) => URL.createObjectURL(file)),
		[files],
	);
	useEffect(() => {
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [urls]);
	return urls;
}

export function KycPage() {
	const qc = useQueryClient();
	const setUser = useAuthStore((s) => s.setUser);
	const { data: kyc, isLoading } = useMyKyc();
	const { data: me } = useMe();
	const [frontFile, setFrontFile] = useState<File | null>(null);
	const [backFile, setBackFile] = useState<File | null>(null);
	const [selfieFiles, setSelfieFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [settingProfilePic, setSettingProfilePic] = useState<string | null>(
		null,
	);

	const frontUrl = useObjectUrl(frontFile);
	const backUrl = useObjectUrl(backFile);
	const selfieUrls = useObjectUrls(selfieFiles);

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

	const addSelfie = (file: File | null) => {
		if (!file) {
			return;
		}
		if (selfieFiles.length >= MAX_SELFIES) {
			toast.error(`Pode enviar no máximo ${MAX_SELFIES} selfies.`);
			return;
		}
		setSelfieFiles((prev) => [...prev, file]);
	};

	const removeSelfie = (index: number) => {
		setSelfieFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		if (!frontFile || !backFile) {
			toast.error('Envie a frente e o verso do seu BI.');
			return;
		}
		if (selfieFiles.length < MIN_SELFIES) {
			toast.error(`Adicione pelo menos ${MIN_SELFIES} selfies.`);
			return;
		}
		setSubmitting(true);
		setUploading(true);
		try {
			const [front, back, ...selfieResults] = await Promise.all([
				uploadImage(frontFile, { folder: 'kyc' }),
				uploadImage(backFile, { folder: 'kyc' }),
				...selfieFiles.map((file) =>
					uploadImage(file, { folder: 'kyc' }),
				),
			]);
			await submitKyc({
				biFrontUrl: front.url,
				biFrontId: front.cloudinaryId,
				biBackUrl: back.url,
				biBackId: back.cloudinaryId,
				selfies: selfieResults.map((result) => ({
					url: result.url,
					cloudinaryId: result.cloudinaryId,
				})),
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

	const handleUseAsProfilePic = async (url: string) => {
		setSettingProfilePic(url);
		try {
			const updated = await updateProfile({ image: url });
			setUser(updated);
			toast.success('Foto de perfil atualizada!');
			void qc.invalidateQueries({ queryKey: ['me'] });
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setSettingProfilePic(null);
		}
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6">
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
						de Identidade) e {MIN_SELFIES} ou mais selfies a mostrar
						o rosto. As imagens são tratadas com confidencialidade.
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

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-slate-700">
								Selfies (mínimo {MIN_SELFIES - 1}) e ao menos uma de corpo inteiro (poderá usar como foto de perfil)
							</span>
							<span className="text-xs text-muted">
								{selfieFiles.length}/{MAX_SELFIES}
							</span>
						</div>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
							{selfieFiles.map((_file, index) => (
								<div
									key={index}
									className="relative h-40 overflow-hidden rounded-lg border border-slate-200"
								>
									<img
										src={selfieUrls[index]}
										alt=""
										className="h-full w-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeSelfie(index)}
										aria-label="Remover selfie"
										className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
									>
										<FaTimesCircle className="h-4 w-4" />
									</button>
								</div>
							))}
							{selfieFiles.length < MAX_SELFIES && (
								<label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-sm text-muted transition hover:border-primary-400 hover:text-primary-600">
									<FaUpload className="h-5 w-5" />
									Adicionar
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => {
											addSelfie(
												e.target.files?.[0] ?? null,
											);
											e.target.value = '';
										}}
									/>
								</label>
							)}
						</div>
						{selfieFiles.length < MIN_SELFIES && (
							<p className="text-xs text-amber-600">
								Faltam {MIN_SELFIES - selfieFiles.length}{' '}
								imagem/ns para o mínimo exigido.
							</p>
						)}
					</div>

					<div className="flex justify-end border-t border-slate-200 pt-4">
						<Button
							onClick={handleSubmit}
							disabled={
								submitting ||
								!frontFile ||
								!backFile ||
								selfieFiles.length < MIN_SELFIES
							}
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
				<>
					<Card className="flex items-center gap-3 border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
						<FaCheckCircle className="h-6 w-6" />
						<p>
							A sua identidade foi verificada. Agora pode
							construir confiança na comunidade.
						</p>
					</Card>

					{kyc.selfies && kyc.selfies.length > 0 && (
						<Card className="p-6">
							<h2 className="mb-1 flex items-center gap-2 font-display text-lg">
								<FaUserCircle className="h-5 w-5 text-primary-500" />
								Foto de perfil
							</h2>
							<p className="mb-4 text-sm text-muted">
								Escolha uma das suas selfies aprovadas para usar
								como foto de perfil.
							</p>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
								{kyc.selfies.map((selfie) => {
									const isCurrent = me?.image === selfie.url;
									return (
										<div
											key={selfie.cloudinaryId}
											className={`overflow-hidden rounded-lg border ${
												isCurrent
													? 'border-primary-400 ring-2 ring-primary-100'
													: 'border-slate-200'
											}`}
										>
											<img
												src={selfie.url}
												alt="Selfie"
												className="h-32 w-full object-cover"
											/>
											<div className="p-2">
												<Button
													size="sm"
													variant={
														isCurrent
															? 'outline'
															: 'primary'
													}
													fullWidth
													disabled={
														isCurrent ||
														settingProfilePic ===
															selfie.url
													}
													onClick={() =>
														handleUseAsProfilePic(
															selfie.url,
														)
													}
												>
													{settingProfilePic ===
													selfie.url
														? 'A aplicar…'
														: isCurrent
															? 'Atual'
															: 'Usar como foto'}
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</Card>
					)}
				</>
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
