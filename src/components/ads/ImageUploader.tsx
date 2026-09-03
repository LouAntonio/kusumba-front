import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes, FaSpinner, FaImage } from 'react-icons/fa';
import { uploadImage } from '../../api/cloudinary';
import { getApiError } from '../../lib/axios';
import type { GalleryItem } from '../../lib/types';
import { cn } from '../../lib/cn';

export function ImageUploader({
	images,
	onChange,
	max = 6,
	label = 'Imagens',
}: {
	images: GalleryItem[];
	onChange: (images: GalleryItem[]) => void;
	max?: number;
	label?: string;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const handleFiles = async (files: FileList | null) => {
		if (!files?.length) {
			return;
		}
		setUploading(true);
		const fileArr = Array.from(files).slice(0, max - images.length);
		try {
			const results: GalleryItem[] = [];
			for (const file of fileArr) {
				const uploaded = await uploadImage(file, { folder: 'ads' });
				results.push({
					url: uploaded.url,
					cloudinaryId: uploaded.cloudinaryId,
					type: 'image',
				});
			}
			onChange([...images, ...results]);
		} catch (error) {
			toast.error(getApiError(error));
		} finally {
			setUploading(false);
			if (inputRef.current) {
				inputRef.current.value = '';
			}
		}
	};

	return (
		<div className="space-y-2">
			<span className="text-sm font-medium text-slate-700">{label}</span>
			<div className="flex flex-wrap gap-3">
				{images.map((img, i) => (
					<div
						key={img.cloudinaryId + i}
						className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200"
					>
						<img
							src={img.url}
							alt=""
							className="h-full w-full object-cover"
						/>
						<button
							type="button"
							onClick={() =>
								onChange(images.filter((_, idx) => idx !== i))
							}
							className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
							aria-label="Remover imagem"
						>
							<FaTimes className="h-3 w-3" />
						</button>
						{i === 0 && (
							<span className="absolute bottom-1 left-1 rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
								Capa
							</span>
						)}
					</div>
				))}
				{images.length < max && (
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
						className={cn(
							'flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-muted transition hover:border-primary-400 hover:text-primary-600',
							uploading && 'opacity-60',
						)}
					>
						{uploading ? (
							<FaSpinner className="h-5 w-5 animate-spin" />
						) : (
							<FaPlus className="h-5 w-5" />
						)}
						<span className="text-xs">
							{uploading ? 'A enviar…' : 'Adicionar'}
						</span>
					</button>
				)}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				hidden
				onChange={(e) => handleFiles(e.target.files)}
			/>
			{images.length === 0 && (
				<p className="flex items-center gap-1.5 text-xs text-muted">
					<FaImage className="h-3 w-3" /> A primeira imagem é a capa
					do anúncio.
				</p>
			)}
		</div>
	);
}
