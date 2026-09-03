import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import type { GalleryItem } from '../../lib/types';
import { cn } from '../../lib/cn';

export interface ImageUploaderHandle {
	getPendingFiles: () => File[];
}

export const ImageUploader = forwardRef<
	ImageUploaderHandle,
	{
		images: GalleryItem[];
		onChange: (images: GalleryItem[]) => void;
		max?: number;
		label?: string;
	}
>(function ImageUploader(
	{ images, onChange, max = 6, label = 'Imagens' },
	ref,
) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState<File[]>([]);

	useImperativeHandle(
		ref,
		() => ({
			getPendingFiles: () => pending,
		}),
		[pending],
	);

	const previewUrls = useMemo(
		() =>
			pending.map((file) => ({
				file,
				url: URL.createObjectURL(file),
			})),
		[pending],
	);

	useEffect(() => {
		return () => {
			for (const p of previewUrls) {
				URL.revokeObjectURL(p.url);
			}
		};
	}, [previewUrls]);

	const handleFiles = (files: FileList | null) => {
		if (!files?.length) {
			return;
		}
		const slots = max - images.length - pending.length;
		if (slots <= 0) {
			return;
		}
		setPending((prev) => [...prev, ...Array.from(files).slice(0, slots)]);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	const remainingSlots = max - images.length - pending.length;

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
				{pending.map((file, i) => (
					<div
						key={file.name + i}
						className="relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-primary-400"
					>
						<img
							src={previewUrls[i]?.url}
							alt=""
							className="h-full w-full object-cover"
						/>
						<button
							type="button"
							onClick={() =>
								setPending((prev) =>
									prev.filter((_, idx) => idx !== i),
								)
							}
							className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
							aria-label="Remover imagem"
						>
							<FaTimes className="h-3 w-3" />
						</button>
						<span className="absolute bottom-1 left-1 rounded bg-primary-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
							Nova
						</span>
					</div>
				))}
				{remainingSlots > 0 && (
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className={cn(
							'flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-muted transition hover:border-primary-400 hover:text-primary-600',
						)}
					>
						<FaPlus className="h-5 w-5" />
						<span className="text-xs">Adicionar</span>
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
			{images.length === 0 && pending.length === 0 && (
				<p className="flex items-center gap-1.5 text-xs text-muted">
					<FaImage className="h-3 w-3" /> A primeira imagem é a capa
					do anúncio.
				</p>
			)}
		</div>
	);
});
