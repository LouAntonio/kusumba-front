import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	FaSearch,
	FaBoxOpen,
	FaStar,
	FaTimes,
	FaLocationArrow,
	FaMapMarkerAlt,
} from 'react-icons/fa';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuthStore } from '../store/authStore';
import { useWishlist } from '../hooks/useWishlist';
import { AdCard } from '../components/ads/AdCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { AdCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { AD_SORTS, AD_TYPE_LABELS, type AdType } from '../lib/types';
import { cn } from '../lib/cn';

const SORT_LABELS: Record<(typeof AD_SORTS)[number], string> = {
	newest: 'Mais recentes',
	oldest: 'Mais antigos',
	price_asc: 'Preço: menor para maior',
	price_desc: 'Preço: maior para menor',
	distance: 'Mais próximos',
};

const RADIUS_OPTIONS = [
	{ value: '5', label: '5 km' },
	{ value: '10', label: '10 km' },
	{ value: '25', label: '25 km' },
	{ value: '50', label: '50 km' },
];

const TYPE_KEYS: AdType[] = ['SALE', 'TRADE', 'DONATION'];

export function AdsListPage() {
	const [params, setParams] = useSearchParams();
	const user = useAuthStore((s) => s.user);

	const q = params.get('q') ?? '';
	const type = params.get('type') ?? undefined;
	const categorySlugs = params.get('categorySlugs') ?? undefined;
	const featured = params.get('featured') === 'true';
	const sortBy =
		(params.get('sortBy') as (typeof AD_SORTS)[number]) ?? 'newest';
	const minPrice = params.get('minPrice') ?? '';
	const maxPrice = params.get('maxPrice') ?? '';
	const radiusKm = params.get('radiusKm') ?? '';
	const lat = params.get('lat') ?? '';
	const lng = params.get('lng') ?? '';

	const [locBusy, setLocBusy] = useState(false);
	const [locError, setLocError] = useState<string | null>(null);

	const selectedSlugs = useMemo(
		() => (categorySlugs ? categorySlugs.split(',').filter(Boolean) : []),
		[categorySlugs],
	);

	const selectedTypes = useMemo(
		() => (type ? type.split(',').filter(Boolean) : []),
		[type],
	);

	const query = useMemo(() => {
		const result: Record<string, unknown> = {
			limit: 24,
			q: q || undefined,
			type: selectedTypes.length ? selectedTypes.join(',') : undefined,
			categorySlugs: selectedSlugs.length
				? selectedSlugs.join(',')
				: undefined,
			featured: featured,
			sortBy,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
			lat: lat ? Number(lat) : undefined,
			lng: lng ? Number(lng) : undefined,
			radiusKm: radiusKm ? Number(radiusKm) : undefined,
		};
		return result;
	}, [
		q,
		selectedTypes,
		selectedSlugs,
		featured,
		sortBy,
		minPrice,
		maxPrice,
		lat,
		lng,
		radiusKm,
	]);

	const { data, isLoading } = useAds(query);
	const { data: categories } = useCategories();

	const favoritesSet = useFavoriteSet();

	const updateParams = (patch: Record<string, string | undefined>) => {
		const next = new URLSearchParams(params);
		for (const [key, value] of Object.entries(patch)) {
			if (value) {
				next.set(key, value);
			} else {
				next.delete(key);
			}
		}
		setParams(next, { replace: true });
	};

	const updateParam = (key: string, value: string) => {
		updateParams({ [key]: value });
	};

	const clearAllFilters = () => {
		const next = new URLSearchParams();
		setParams(next);
	};

	const toggleCategory = (slug: string) => {
		const has = selectedSlugs.includes(slug);
		const next = has
			? selectedSlugs.filter((s) => s !== slug)
			: [...selectedSlugs, slug];
		updateParams({
			categorySlugs: next.length ? next.join(',') : undefined,
		});
	};

	const toggleType = (t: AdType) => {
		const has = selectedTypes.includes(t);
		const next = has
			? selectedTypes.filter((x) => x !== t)
			: [...selectedTypes, t];
		updateParams({ type: next.length ? next.join(',') : undefined });
	};

	const useMyLocation = () => {
		if (!('geolocation' in navigator)) {
			setLocError('A geolocalização não é suportada neste navegador.');
			return;
		}
		setLocBusy(true);
		setLocError(null);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				updateParams({
					lat: pos.coords.latitude.toFixed(6),
					lng: pos.coords.longitude.toFixed(6),
					radiusKm: radiusKm || '10',
				});
				setLocBusy(false);
			},
			() => {
				setLocError(
					'Não foi possível obter a sua localização. Verifique as permissões.',
				);
				setLocBusy(false);
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	};

	const clearLocation = () => {
		setLocError(null);
		updateParams({ lat: undefined, lng: undefined, radiusKm: undefined });
	};

	const hasFilters = Boolean(
		q ||
		selectedTypes.length ||
		selectedSlugs.length ||
		featured ||
		minPrice ||
		maxPrice ||
		lat,
	);

	const currentCategoryName =
		selectedSlugs.length === 1
			? (categories ?? []).find((c) => c.slug === selectedSlugs[0])?.name
			: undefined;

	const title = q
		? `Resultados para "${q}"`
		: (currentCategoryName ?? 'Anúncios');

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-display text-2xl">{title}</h1>
					<p className="text-sm text-muted">
						{data?.total ?? 0} item(ns) encontrados
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[240px_1fr]">
				<aside className="lg:sticky lg:top-24 lg:self-start">
					<div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
						<div className="flex items-center justify-between">
							<h2 className="font-display text-sm font-semibold text-slate-800">
								Filtros
							</h2>
							{hasFilters && (
								<button
									onClick={clearAllFilters}
									className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
								>
									<FaTimes className="h-3 w-3" /> Limpar
								</button>
							)}
						</div>

						<div className="space-y-2">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Categorias
							</p>
							<div className="flex flex-wrap gap-2">
								{(categories ?? []).map((cat) => {
									const active = selectedSlugs.includes(
										cat.slug,
									);
									return (
										<button
											key={cat.id}
											type="button"
											onClick={() =>
												toggleCategory(cat.slug)
											}
											className={cn(
												'rounded-full border px-3 py-1.5 text-xs font-medium transition',
												active
													? 'border-primary-600 bg-primary-600 text-white'
													: 'border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700',
											)}
										>
											{cat.name}
										</button>
									);
								})}
							</div>
						</div>

						<div className="space-y-2">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Tipo
							</p>
							<div className="flex flex-wrap gap-2">
								{TYPE_KEYS.map((t) => {
									const active = selectedTypes.includes(t);
									return (
										<button
											key={t}
											type="button"
											onClick={() => toggleType(t)}
											className={cn(
												'rounded-full border px-3 py-1.5 text-xs font-medium transition',
												active
													? 'border-primary-600 bg-primary-600 text-white'
													: 'border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700',
											)}
										>
											{AD_TYPE_LABELS[t]}
										</button>
									);
								})}
							</div>
						</div>

						<div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Distância
							</p>
							{lat && lng ? (
								<>
									<div className="flex items-center gap-2 text-xs text-slate-600">
										<FaMapMarkerAlt className="h-3.5 w-3.5 text-primary-600" />
										Localização ativa
									</div>
									<div>
										<Select
											label="Raio (km)"
											value={radiusKm}
											onChange={(e) =>
												updateParam(
													'radiusKm',
													e.target.value,
												)
											}
											options={RADIUS_OPTIONS}
										/>
									</div>
									<button
										type="button"
										onClick={clearLocation}
										className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
									>
										Remover localização
									</button>
								</>
							) : (
								<button
									type="button"
									onClick={useMyLocation}
									disabled={locBusy}
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-3 py-2 text-xs font-medium text-primary-700 transition hover:bg-primary-50 disabled:opacity-60"
								>
									<FaLocationArrow
										className={cn(
											'h-3.5 w-3.5',
											locBusy && 'animate-pulse',
										)}
									/>
									{locBusy
										? 'A obter localização…'
										: 'Usar a minha localização'}
								</button>
							)}
							{locError && (
								<p className="text-xs text-red-600">
									{locError}
								</p>
							)}
							{!locError && !lat && (
								<p className="text-[11px] text-slate-400">
									Para ordenar por proximidade e filtrar por
									raio.
								</p>
							)}
						</div>

						<label className="flex cursor-pointer items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
							<span className="flex items-center gap-2 text-sm font-medium text-amber-800">
								<FaStar className="h-3.5 w-3.5 text-amber-400" />
								Só destacados
							</span>
							<input
								type="checkbox"
								checked={featured}
								onChange={() =>
									updateParams({
										featured: featured ? undefined : 'true',
									})
								}
								className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
							/>
						</label>

						<div className="space-y-4">
							<Select
								label="Ordenar por"
								value={sortBy}
								onChange={(e) =>
									updateParam('sortBy', e.target.value)
								}
								options={AD_SORTS.map((s) => ({
									value: s,
									label: SORT_LABELS[s],
								}))}
							/>
							<div>
								<label className="text-sm font-medium text-slate-700">
									Faixa de preço (Kz)
								</label>
								<div className="mt-1.5 flex gap-2">
									<input
										type="number"
										placeholder="Mín"
										value={minPrice}
										onChange={(e) =>
											updateParam(
												'minPrice',
												e.target.value,
											)
										}
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
									/>
									<input
										type="number"
										placeholder="Máx"
										value={maxPrice}
										onChange={(e) =>
											updateParam(
												'maxPrice',
												e.target.value,
											)
										}
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
									/>
								</div>
							</div>
						</div>
					</div>
				</aside>

				<div>
					{isLoading ? (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<AdCardSkeleton key={i} />
							))}
						</div>
					) : (data?.items?.length ?? 0) === 0 ? (
						<EmptyState
							icon={<FaBoxOpen />}
							title="Nenhum anúncio encontrado"
							description="Tente ajustar os filtros ou a busca para encontrar o que procura."
							action={
								hasFilters && (
									<Button
										variant="outline"
										onClick={clearAllFilters}
									>
										<FaSearch className="h-4 w-4" /> Limpar
										filtros
									</Button>
								)
							}
						/>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
							{(data?.items ?? []).map((ad) => (
								<AdCard
									key={ad.id}
									ad={ad}
									favorited={favoritesSet.has(ad.id)}
									showFavorite={Boolean(user)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function useFavoriteSet(): Set<string> {
	const { data } = useWishlist(1, 50);
	const ids = (data?.items ?? []).filter((i) => i.ad).map((i) => i.ad!.id);
	return new Set(ids);
}
