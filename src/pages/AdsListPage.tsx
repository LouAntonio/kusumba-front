import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaBoxOpen, FaStar, FaTimes } from 'react-icons/fa';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuthStore } from '../store/authStore';
import { useWishlist } from '../hooks/useWishlist';
import { AdCard } from '../components/ads/AdCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { AdCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { AD_SORTS, type AdType } from '../lib/types';
import { cn } from '../lib/cn';

const TYPE_OPTIONS: { value: string; label: string }[] = [
	{ value: '', label: 'Todos os tipos' },
	{ value: 'SALE', label: 'Venda' },
	{ value: 'TRADE', label: 'Troca' },
	{ value: 'DONATION', label: 'Doação' },
];

const SORT_LABELS: Record<(typeof AD_SORTS)[number], string> = {
	newest: 'Mais recentes',
	oldest: 'Mais antigos',
	price_asc: 'Preço: menor para maior',
	price_desc: 'Preço: maior para menor',
	distance: 'Mais próximos',
};

export function AdsListPage() {
	const [params, setParams] = useSearchParams();
	const user = useAuthStore((s) => s.user);

	const q = params.get('q') ?? '';
	const type = (params.get('type') as AdType | null) ?? undefined;
	const categorySlugs = params.get('categorySlugs') ?? undefined;
	const featured = params.get('featured') === 'true';
	const sortBy =
		(params.get('sortBy') as (typeof AD_SORTS)[number]) ?? 'newest';
	const minPrice = params.get('minPrice') ?? '';
	const maxPrice = params.get('maxPrice') ?? '';

	const selectedSlugs = useMemo(
		() => (categorySlugs ? categorySlugs.split(',').filter(Boolean) : []),
		[categorySlugs],
	);

	const query = useMemo(() => {
		const result: Record<string, unknown> = {
			limit: 24,
			q: q || undefined,
			type,
			categorySlugs: selectedSlugs.length
				? selectedSlugs.join(',')
				: undefined,
			featured: featured,
			sortBy,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		};
		return result;
	}, [q, type, selectedSlugs, featured, sortBy, minPrice, maxPrice]);

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

	const hasFilters = Boolean(
		q || type || selectedSlugs.length || featured || minPrice || maxPrice,
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

						<div className="space-y-1.5">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
								Categorias
							</p>
							{(categories ?? []).map((cat) => {
								const checked = selectedSlugs.includes(
									cat.slug,
								);
								return (
									<label
										key={cat.id}
										className={cn(
											'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50',
											checked &&
												'bg-primary-50 text-primary-800',
										)}
									>
										<input
											type="checkbox"
											checked={checked}
											onChange={() =>
												toggleCategory(cat.slug)
											}
											className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
										/>
										<span className="truncate font-medium">
											{cat.name}
										</span>
									</label>
								);
							})}
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
								label="Tipo"
								value={type ?? ''}
								onChange={(e) =>
									updateParam('type', e.target.value)
								}
								options={TYPE_OPTIONS}
							/>
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
