import { useState } from 'react';
import { FaCheck, FaFilePdf, FaTrash } from 'react-icons/fa';

export function ProofUploader({
	onUpload,
	busy,
}: {
	onUpload: (file: File) => Promise<void> | void;
	busy?: boolean;
}) {
	const [file, setFile] = useState<File | null>(null);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState('');
	const disabled = sending || Boolean(busy);

	const submit = async () => {
		if (!file || disabled) {
			return;
		}
		setSending(true);
		setError('');
		try {
			await onUpload(file);
			setFile(null);
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="space-y-2">
			{!file ? (
				<label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 hover:border-primary-400 hover:text-primary-600">
					<input
						type="file"
						accept="application/pdf,.pdf"
						disabled={disabled}
						className="hidden"
						onChange={(e) => {
							const selected = e.target.files?.[0];
							e.target.value = '';
							if (!selected) {
								return;
							}
							if (selected.type !== 'application/pdf') {
								setError('O comprovativo deve ser um PDF.');
								return;
							}
							setError('');
							setFile(selected);
						}}
					/>
					<FaFilePdf className="mx-auto mb-1 h-6 w-6 text-red-400" />
					Escolher comprovativo em PDF…
				</label>
			) : (
				<div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
					<div className="min-w-0">
						<p className="truncate font-medium text-slate-800">
							{file.name}
						</p>
						<p className="text-xs text-muted">
							{(file.size / 1024).toFixed(0)} KB
						</p>
					</div>
					<button
						type="button"
						onClick={() => setFile(null)}
						disabled={disabled}
						className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-50"
						aria-label="Remover ficheiro"
					>
						<FaTrash className="h-4 w-4" />
					</button>
				</div>
			)}

			<button
				type="button"
				onClick={() => void submit()}
				disabled={disabled || !file}
				className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<FaCheck className="h-4 w-4" />
				{sending ? 'A enviar comprovativo…' : 'Enviar comprovativo'}
			</button>

			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}
