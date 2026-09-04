import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useCreateAd, useUpdateAd } from '../../hooks/useAds';
import { useCategories } from '../../hooks/useCategories';
import { uploadImage } from '../../api/cloudinary';
import { getApiError } from '../../lib/axios';
import type { Ad, AdType, GalleryItem, Location } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { ImageUploader, type ImageUploaderHandle } from './ImageUploader';
import { LocationPicker } from './LocationPicker';

const TYPE_OPTIONS = [
	{ value: 'SALE', label: 'Venda' },
	{ value: 'TRADE', label: 'Troca' },
	{ value: 'DONATION', label: 'Doação' },
];

export function AdForm({
	initial,
	onCreate,
	onSave,
}: {
	initial?: Ad;
	onCreate?: (id: string) => void;
	onSave?: (id: string) => void;
}) {
	const navigate = useNavigate();
	const { data: categories } = useCategories();
	const createAd = useCreateAd();
	const updateAd = useUpdateAd(initial?.id ?? '');

	const [title, setTitle] = useState(initial?.title ?? '');
	const [description, setDescription] = useState(initial?.description ?? '');
	const [type, setType] = useState<AdType>(initial?.type ?? 'SALE');
	const [price, setPrice] = useState(
		initial?.price != null ? String(initial.price) : '',
	);
	const [tradefor, setTradefor] = useState<string[]>(initial?.tradefor ?? []);
	const [tradeInput, setTradeInput] = useState('');
	const [categoryIds, setCategoryIds] = useState<string[]>(
		initial?.categories.map((c) => c.id) ?? [],
	);
	const [gallery, setGallery] = useState<GalleryItem[]>(
		initial?.gallery ?? [],
	);
	const [location, setLocation] = useState<Location | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const imageUploaderRef = useRef<ImageUploaderHandle>(null);

	const addTrade = () => {
		const v = tradeInput.trim();
		if (!v) {
			return;
		}
		if (tradefor.length >= 10) {
			return;
		}
		setTradefor((t) => [...t, v]);
		setTradeInput('');
	};

	const toggleCategory = (id: string) => {
		setCategoryIds((ids) =>
			ids.includes(id)
				? ids.filter((x) => x !== id)
				: ids.length >= 5
					? ids
					: [...ids, id],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (categoryIds.length === 0) {
			toast.error('Selecione pelo menos uma categoria.');
			return;
		}
		if (type === 'TRADE' && tradefor.length === 0) {
			toast.error('Informe ao menos um item que aceita para troca.');
			return;
		}
		const pendingFiles = imageUploaderRef.current?.getPendingFiles() ?? [];
		const slots = 6 - gallery.length;
		const filesToUpload = pendingFiles.slice(0, Math.max(0, slots));
		setSubmitting(true);
		let uploaded: GalleryItem[] = [];
		if (filesToUpload.length > 0) {
			const results: GalleryItem[] = [];
			let failures = 0;
			for (const file of filesToUpload) {
				try {
					const uploadedItem = await uploadImage(file, {
						folder: 'ads',
					});
					results.push({
						url: uploadedItem.url,
						cloudinaryId: uploadedItem.cloudinaryId,
						type: 'image',
					});
				} catch {
					failures += 1;
				}
			}
			uploaded = results;
			imageUploaderRef.current?.clearPendingFiles();
			if (failures > 0) {
				const ok = results.length;
				const total = filesToUpload.length;
				toast.error(
					`${failures} de ${total} imagem(ns) falharam o upload.${
						ok > 0 ? ' As restantes foram guardadas.' : ''
					}`,
				);
			}
		}
		const finalGallery = [...gallery, ...uploaded];
		const input = {
			title,
			description,
			type,
			price:
				type === 'SALE' && price
					? Number(price)
					: type === 'SALE'
						? 0
						: undefined,
			tradefor: type === 'TRADE' ? tradefor : undefined,
			categoryIds,
			gallery: finalGallery.length ? finalGallery : undefined,
			image: finalGallery[0]?.url,
			imageId: finalGallery[0]?.cloudinaryId,
			location: location ?? undefined,
		};
		try {
			if (initial) {
				const updated = await updateAd.mutateAsync(input);
				toast.success('Anúncio atualizado com sucesso!');
				if (onSave) {
					onSave(updated.id);
				} else {
					navigate(`/anuncios/${updated.slug}`);
				}
				return;
			}
			const ad = await createAd.mutateAsync(input);
			toast.success('Anúncio criado com sucesso!');
			if (onCreate) {
				onCreate(ad.id);
			} else {
				navigate(`/anuncios/${ad.slug}`);
			}
		} catch (error) {
			toast.error(getApiError(error));
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<Input
					label="Título"
					value={title}
					onChange={(e) => setTitle(e.target.value.slice(0, 140))}
					maxLength={140}
					placeholder={'Ex.: Televisão 32" em bom estado'}
					required
				/>

				<Textarea
					label="Descrição"
					value={description}
					onChange={(e) =>
						setDescription(e.target.value.slice(0, 5000))
					}
					maxLength={5000}
					rows={5}
					placeholder="Descreva o estado, o motivo da venda e os detalhes."
					required
				/>

				<div className="grid gap-4 sm:grid-cols-2">
					<Select
						label="Tipo de transação"
						value={type}
						onChange={(e) => setType(e.target.value as AdType)}
						options={TYPE_OPTIONS}
					/>
					{type === 'SALE' && (
						<Input
							label="Preço (Kz)"
							type="number"
							min={0}
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="Ex.: 150000"
						/>
					)}
				</div>

				{type === 'TRADE' && (
					<div>
						<label className="text-sm font-medium text-slate-700">
							Aceita trocar por
						</label>
						<div className="mt-1.5 flex gap-2">
							<Input
								value={tradeInput}
								onChange={(e) => setTradeInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addTrade();
									}
								}}
								placeholder={'Ex.: monitor 24"'}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={addTrade}
								disabled={!tradeInput.trim()}
							>
								<FaPlus className="h-4 w-4" /> Adicionar
							</Button>
						</div>
						{tradefor.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-2">
								{tradefor.map((item, i) => (
									<span
										key={i}
										className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800"
									>
										{item}
										<button
											type="button"
											onClick={() =>
												setTradefor((t) =>
													t.filter(
														(_, idx) => idx !== i,
													),
												)
											}
											className="text-primary-600 hover:text-primary-800"
											aria-label="Remover"
										>
											<FaTimes className="h-3 w-3" />
										</button>
									</span>
								))}
							</div>
						)}
					</div>
				)}

				<div>
					<label className="text-sm font-medium text-slate-700">
						Categorias (máx. 5)
					</label>
					<div className="mt-1.5 flex flex-wrap gap-2">
						{(categories ?? []).map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => toggleCategory(cat.id)}
								className={
									categoryIds.includes(cat.id)
										? 'rounded-full bg-primary-600 px-3 py-1.5 text-sm font-medium text-white'
										: 'rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-primary-400'
								}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>

				<ImageUploader
					ref={imageUploaderRef}
					images={gallery}
					onChange={setGallery}
					max={6}
					label="Fotos"
				/>

				<div className="space-y-3">
					<div>
						<label className="text-sm font-medium text-slate-700">
							Localização
						</label>
						<p className="mt-0.5 text-xs text-muted">
							Indique onde se encontra o item. Arraste o marcador
							no mapa ou use a sua localização.
						</p>
					</div>
					<LocationPicker value={location} onChange={setLocation} />
				</div>
			</div>

			<div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
				<Button
					type="button"
					variant="ghost"
					onClick={() => navigate(-1)}
				>
					Cancelar
				</Button>
				<Button type="submit" disabled={submitting}>
					{submitting
						? initial
							? 'A guardar…'
							: 'A publicar…'
						: initial
							? 'Guardar alterações'
							: 'Publicar anúncio'}
				</Button>
			</div>
		</form>
	);
}
