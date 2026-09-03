import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { cn } from '../../lib/cn';

export function Gallery({
	images,
	title,
}: {
	images: string[];
	title: string;
}) {
	const [index, setIndex] = useState(0);
	const current = images[index];
	const hasImages = images.length > 0;

	if (!hasImages) {
		return (
			<div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
				Sem imagem
			</div>
		);
	}

	const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
	const next = () => setIndex((i) => (i + 1) % images.length);

	return (
		<div className="space-y-3">
			<div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
				<img
					src={current}
					alt={title}
					className="h-full w-full object-cover"
				/>
				{images.length > 1 && (
					<>
						<button
							onClick={prev}
							className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
							aria-label="Imagem anterior"
						>
							<FaChevronLeft className="h-4 w-4" />
						</button>
						<button
							onClick={next}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
							aria-label="Próxima imagem"
						>
							<FaChevronRight className="h-4 w-4" />
						</button>
						<div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
							{index + 1} / {images.length}
						</div>
					</>
				)}
			</div>
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-1">
					{images.map((img, i) => (
						<button
							key={i}
							onClick={() => setIndex(i)}
							className={cn(
								'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition',
								i === index
									? 'border-primary-500'
									: 'border-transparent opacity-70 hover:opacity-100',
							)}
							aria-label={`Ver imagem ${i + 1}`}
						>
							<img
								src={img}
								alt=""
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
