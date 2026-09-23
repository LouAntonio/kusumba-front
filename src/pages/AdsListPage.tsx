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
import {
	AD_SORTS,
	AD_TYPE_LABELS,
	type AdSort,
	type AdType,
} from '../lib/types';
import { cn } from '../lib/cn';
import { getApiError } from '../lib/axios';

const SORT_LABELS: Record<AdSort, string> = {
	newest: 'Mais recentes',
	oldest: 'Mais antigos',
	price_asc: 'Preço: menor para maior',
	price_desc: 'Preço: maior para menor',
	distance: 'Mais próximos',
};

const MAX_RADIUS_KM = 250;

function parseRadius(value: string): number | undefined {
	if (!value) {
		return undefined;
	}
	const n = Math.round(Number(value));
	if (!Number.isFinite(n) || n < 1 || n > MAX_RADIUS_KM) {
		return undefined;
	}
	return n;
}

const TYPE_KEYS: AdType[] = ['SALE', 'TRADE', 'DONATION'];

const SIDEBAR_PARAM_KEYS = [
	'q',
	'type',
	'categorySlugs',
	'featured',
	'sortBy',
	'minPrice',
	'maxPrice',
	'radiusKm',
	'lat',
	'lng',
] as const;

interface DraftFilters {
	q: string;
	type: string[];
	categorySlugs: string[];
	featured: boolean;
	sortBy: AdSort;
	minPrice: string;
	maxPrice: string;
	radiusKm: string;
	lat: string;
	lng: string;
}

const EMPTY_DRAFT: DraftFilters = {
	q: '',
	type: [],
	categorySlugs: [],
	featured: false,
	sortBy: 'newest',
	minPrice: '',
	maxPrice: '',
	radiusKm: '',
	lat: '',
	lng: '',
};

function draftFromParams(params: URLSearchParams): DraftFilters {
	const rawSortBy = params.get('sortBy');
	const sortBy =
		rawSortBy && AD_SORTS.includes(rawSortBy as AdSort)
			? (rawSortBy as AdSort)
			: 'newest';
	return {
		q: params.get('q') ?? '',
		type: (params.get('type') ?? '').split(',').filter(Boolean),
		categorySlugs: (params.get('categorySlugs') ?? '')
			.split(',')
			.filter(Boolean),
		featured: params.get('featured') === 'true',
		sortBy,
		minPrice: params.get('minPrice') ?? '',
		maxPrice: params.get('maxPrice') ?? '',
		radiusKm: params.get('radiusKm') ?? '',
		lat: params.get('lat') ?? '',
		lng: params.get('lng') ?? '',
	};
}

function draftToParams(draft: DraftFilters): URLSearchParams {
	const next = new URLSearchParams();
	if (draft.q) {
		next.set('q', draft.q);
	}
	if (draft.type.length) {
		next.set('type', draft.type.join(','));
	}
	if (draft.categorySlugs.length) {
		next.set('categorySlugs', draft.categorySlugs.join(','));
	}
	if (draft.featured) {
		next.set('featured', 'true');
	}
	if (draft.sortBy !== 'newest') {
		next.set('sortBy', draft.sortBy);
	}
	if (draft.minPrice) {
		next.set('minPrice', draft.minPrice);
	}
	if (draft.maxPrice) {
		next.set('maxPrice', draft.maxPrice);
	}
	if (draft.lat && draft.lng) {
		next.set('lat', draft.lat);
		next.set('lng', draft.lng);
		if (draft.radiusKm) {
			next.set('radiusKm', draft.radiusKm);
		}
	}
	return next;
}

export function AdsListPage() {
	const [params, setParams] = useSearchParams();
	const user = useAuthStore((s) => s.user);

	const q = params.get('q') ?? '';
	const appliedType = params.get('type') ?? undefined;
	const appliedCategorySlugs = params.get('categorySlugs') ?? undefined;
	const appliedFeatured = params.get('featured') === 'true';
	const appliedSortBy = (params.get('sortBy') as AdSort | null) ?? 'newest';
	const appliedMinPrice = params.get('minPrice') ?? '';
	const appliedMaxPrice = params.get('maxPrice') ?? '';
	const appliedRadiusKm = params.get('radiusKm') ?? '';
	const appliedLat = params.get('lat') ?? '';
	const appliedLng = params.get('lng') ?? '';

	const appliedSlugs = useMemo(
		() =>
			appliedCategorySlugs
				? appliedCategorySlugs.split(',').filter(Boolean)
				: [],
		[appliedCategorySlugs],
	);

	const appliedTypes = useMemo(
		() => (appliedType ? appliedType.split(',').filter(Boolean) : []),
		[appliedType],
	);

	const hasLocation = Boolean(appliedLat && appliedLng);
	const distanceUnavailable = appliedSortBy === 'distance' && !hasLocation;
	const effectiveSortBy: AdSort = distanceUnavailable
		? 'newest'
		: appliedSortBy;
	const effectiveRadiusKm = parseRadius(appliedRadiusKm);

	const query = useMemo(
		() => ({
			limit: 24,
			q: q || undefined,
			type: appliedTypes.length ? appliedTypes.join(',') : undefined,
			categorySlugs: appliedSlugs.length
				? appliedSlugs.join(',')
				: undefined,
			featured: appliedFeatured,
			sortBy: effectiveSortBy,
			minPrice: appliedMinPrice ? Number(appliedMinPrice) : undefined,
			maxPrice: appliedMaxPrice ? Number(appliedMaxPrice) : undefined,
			lat: appliedLat ? Number(appliedLat) : undefined,
			lng: appliedLng ? Number(appliedLng) : undefined,
			radiusKm: effectiveRadiusKm,
		}),
		[
			q,
			appliedTypes,
			appliedSlugs,
			appliedFeatured,
			effectiveSortBy,
			effectiveRadiusKm,
			appliedMinPrice,
			appliedMaxPrice,
			appliedLat,
			appliedLng,
		],
	);

	const { data, isLoading, isError, error } = useAds(query);
	const { data: categories } = useCategories();

	const favoritesSet = useFavoriteSet();

	const [draft, setDraft] = useState<DraftFilters>(() =>
		draftFromParams(params),
	);
	const [prevSearch, setPrevSearch] = useState(params.toString());

	if (prevSearch !== params.toString()) {
		setPrevSearch(params.toString());
		setDraft(draftFromParams(params));
	}

	const [locBusy, setLocBusy] = useState(false);
	const [locError, setLocError] = useState<string | null>(null);

	const draftHasLocation = Boolean(draft.lat && draft.lng);
	const draftDistanceUnavailable =
		draft.sortBy === 'distance' && !draftHasLocation;
	const draftRadius = draft.radiusKm || '10';

	const patchDraft = (patch: Partial<DraftFilters>) =>
		setDraft((d) => ({ ...d, ...patch }));

	const applyFilters = () => {
		const next = new URLSearchParams(params);
		const draftParams = draftToParams(draft);
		for (const key of SIDEBAR_PARAM_KEYS) {
			if (draftParams.has(key)) {
				next.set(key, draftParams.get(key)!);
			} else {
				next.delete(key);
			}
		}
		setParams(next, { replace: true });
	};

	const clearAllFilters = () => {
		setDraft(EMPTY_DRAFT);
		setParams(new URLSearchParams());
	};

	const toggleCategory = (slug: string) => {
		setDraft((d) => {
			const has = d.categorySlugs.includes(slug);
			return {
				...d,
				categorySlugs: has
					? d.categorySlugs.filter((s) => s !== slug)
					: [...d.categorySlugs, slug],
			};
		});
	};

	const toggleType = (t: AdType) => {
		setDraft((d) => {
			const has = d.type.includes(t);
			return {
				...d,
				type: has ? d.type.filter((x) => x !== t) : [...d.type, t],
			};
		});
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
				setDraft((d) => ({
					...d,
					lat: pos.coords.latitude.toFixed(6),
					lng: pos.coords.longitude.toFixed(6),
					radiusKm: d.radiusKm || '10',
				}));
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
		patchDraft({ lat: '', lng: '', radiusKm: '' });
	};

	const hasActiveDraft = Boolean(
		draft.q ||
		draft.type.length ||
		draft.categorySlugs.length ||
		draft.featured ||
		draft.sortBy !== 'newest' ||
		draft.minPrice ||
		draft.maxPrice ||
		draft.lat,
	);

	const hasFilters = Boolean(
		q ||
		appliedTypes.length ||
		appliedSlugs.length ||
		appliedFeatured ||
		appliedMinPrice ||
		appliedMaxPrice ||
		appliedLat,
	);

	const currentCategoryName =
		appliedSlugs.length === 1
			? (categories ?? []).find((c) => c.slug === appliedSlugs[0])?.name
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
							{hasActiveDraft && (
								<button
									type="button"
									onClick={clearAllFilters}
									aria-label="Limpar filtros"
									className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
								>
									<FaTimes className="h-4 w-4" />
								</button>
							)}
						</div>

						<form
							className="relative"
							role="search"
							onSubmit={(e) => {
								e.preventDefault();
								applyFilters();
							}}
						>
							<FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
							<input
								type="text"
								value={draft.q}
								onChange={(e) =>
									patchDraft({ q: e.target.value })
								}
								placeholder="Pesquisar anúncios…"
								aria-label="Pesquisar anúncios"
								className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
							/>
						</form>

						<div className="space-y-2">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Tipo
							</p>
							<div className="flex flex-wrap gap-2">
								{TYPE_KEYS.map((t) => {
									const active = draft.type.includes(t);
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

						<div className="space-y-2">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Categorias
							</p>
							<div className="flex flex-wrap gap-2">
								{(categories ?? []).map((cat) => {
									const active = draft.categorySlugs.includes(
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

						<div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Distância
							</p>
							{draftHasLocation ? (
								<>
									<div className="flex items-center gap-2 text-xs text-slate-600">
										<FaMapMarkerAlt className="h-3.5 w-3.5 text-primary-600" />
										Localização ativa
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<label
												htmlFor="radius-slider"
												className="text-xs font-medium text-slate-700"
											>
												Distância máx.
											</label>
											<span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-primary-700 ring-1 ring-slate-200">
												{draftRadius} km
											</span>
										</div>
										<input
											id="radius-slider"
											type="range"
											min="1"
											max={MAX_RADIUS_KM}
											value={Number(draftRadius)}
											onChange={(e) =>
												patchDraft({
													radiusKm: e.target.value,
												})
											}
											className="h-2 w-full cursor-pointer accent-primary-600"
										/>
										<div className="flex items-center justify-between text-[10px] text-slate-400">
											<span>1 km</span>
											<span>{MAX_RADIUS_KM} km</span>
										</div>
										<input
											type="number"
											min="1"
											max={MAX_RADIUS_KM}
											value={Number(draftRadius)}
											onChange={(e) => {
												const v = e.target.value;
												if (
													v === '' ||
													(Number(v) >= 1 &&
														Number(v) <=
															MAX_RADIUS_KM)
												) {
													patchDraft({
														radiusKm: v,
													});
												}
											}}
											className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm"
											aria-label="Raio em quilómetros"
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
							{!locError && !draft.lat && (
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
								checked={draft.featured}
								onChange={() =>
									patchDraft({ featured: !draft.featured })
								}
								className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
							/>
						</label>

						<div className="space-y-4">
							<Select
								label="Ordenar por"
								value={draft.sortBy}
								onChange={(e) =>
									patchDraft({
										sortBy: e.target.value as AdSort,
									})
								}
								options={AD_SORTS.map((s) => ({
									value: s,
									label: SORT_LABELS[s],
								}))}
							/>
							{draftDistanceUnavailable && (
								<p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
									Para ordenar por proximidade, active a
									localização em{' '}
									<span className="font-semibold">
										Distância
									</span>
									. A ordenação voltou a{' '}
									<span className="font-semibold">
										mais recentes
									</span>
									.
								</p>
							)}
							<div>
								<label className="text-sm font-medium text-slate-700">
									Faixa de preço (Kz)
								</label>
								<div className="mt-1.5 flex gap-2">
									<input
										type="number"
										placeholder="Mín"
										value={draft.minPrice}
										onChange={(e) =>
											patchDraft({
												minPrice: e.target.value,
											})
										}
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
									/>
									<input
										type="number"
										placeholder="Máx"
										value={draft.maxPrice}
										onChange={(e) =>
											patchDraft({
												maxPrice: e.target.value,
											})
										}
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="border-t border-slate-200 pt-4">
							<Button
								variant="primary"
								size="lg"
								fullWidth
								onClick={applyFilters}
							>
								<FaSearch className="h-4 w-4" /> Pesquisar
							</Button>
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
					) : isError ? (
						<div
							className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
							role="alert"
						>
							<FaBoxOpen className="h-8 w-8 text-red-300" />
							<div>
								<h2 className="font-display text-lg font-semibold text-red-700">
									Erro ao carregar os anúncios
								</h2>
								<p className="mt-1 max-w-md text-sm text-red-600">
									{getApiError(error)}
								</p>
							</div>
							{hasFilters && (
								<Button
									variant="outline"
									onClick={clearAllFilters}
								>
									<FaSearch className="h-4 w-4" /> Limpar
									filtros
								</Button>
							)}
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
