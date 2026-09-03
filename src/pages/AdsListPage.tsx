import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaBoxOpen } from 'react-icons/fa';
import { useAds } from '../hooks/useAds';
import { useCategories } from '../hooks/useCategories';
import { useAuthStore } from '../store/authStore';
import { useWishlist } from '../hooks/useWishlist';
import { AdCard } from '../components/ads/AdCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { AD_SORTS, type AdType } from '../lib/types';

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
	const [showFilters, setShowFilters] = useState(false);

	const q = params.get('q') ?? '';
	const type = (params.get('type') as AdType | null) ?? undefined;
	const categoryIds = params.get('categoryIds') ?? undefined;
	const sortBy =
		(params.get('sortBy') as (typeof AD_SORTS)[number]) ?? 'newest';
	const minPrice = params.get('minPrice') ?? '';
	const maxPrice = params.get('maxPrice') ?? '';

	const query = useMemo(() => {
		const result: Record<string, unknown> = {
			limit: 24,
			q: q || undefined,
			type,
			categoryIds,
			sortBy,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		};
		return result;
	}, [q, type, categoryIds, sortBy, minPrice, maxPrice]);

	const { data, isLoading } = useAds(query);
	const { data: categories } = useCategories();

	// favorite set for the current user
	const favoritesSet = useFavoriteSet();

	const updateParam = (key: string, value: string) => {
		const next = new URLSearchParams(params);
		if (value) {
			next.set(key, value);
		} else {
			next.delete(key);
		}
		setParams(next, { replace: true });
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-display text-2xl">
						{categoryIds
							? ((categories ?? []).find(
									(c) => c.id === categoryIds,
								)?.name ?? 'Anúncios')
							: 'Anúncios'}
					</h1>
					<p className="text-sm text-muted">
						{data?.total ?? 0} item(ns) encontrados
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowFilters((v) => !v)}
				>
					<FaFilter className="h-3.5 w-3.5" /> Filtros
				</Button>
			</div>

			{showFilters && (
				<form
					className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
					onSubmit={(e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						updateParam(
							'minPrice',
							String(fd.get('minPrice') ?? ''),
						);
						updateParam(
							'maxPrice',
							String(fd.get('maxPrice') ?? ''),
						);
					}}
				>
					<div className="sm:col-span-1">
						<Select
							label="Tipo"
							value={type ?? ''}
							onChange={(e) =>
								updateParam('type', e.target.value)
							}
							options={TYPE_OPTIONS}
						/>
					</div>
					<div className="sm:col-span-1">
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
					</div>
					<div className="sm:col-span-2">
						<label className="text-sm font-medium text-slate-700">
							Faixa de preço (Kz)
						</label>
						<div className="mt-1.5 flex gap-2">
							<input
								name="minPrice"
								type="number"
								placeholder="Mínimo"
								defaultValue={minPrice}
								className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
							/>
							<input
								name="maxPrice"
								type="number"
								placeholder="Máximo"
								defaultValue={maxPrice}
								className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
							/>
						</div>
					</div>
					<div className="lg:col-span-4">
						<Button type="submit" size="sm">
							Aplicar
						</Button>
					</div>
				</form>
			)}

			{isLoading ? (
				<Spinner className="mx-auto" />
			) : (data?.items?.length ?? 0) === 0 ? (
				<EmptyState
					icon={<FaBoxOpen />}
					title="Nenhum anúncio encontrado"
					description="Tente ajustar os filtros ou a busca para encontrar o que procura."
					action={
						q && (
							<Button
								variant="outline"
								onClick={() => {
									const next = new URLSearchParams(params);
									next.delete('q');
									next.delete('type');
									next.delete('categoryIds');
									next.delete('minPrice');
									next.delete('maxPrice');
									setParams(next);
								}}
							>
								<FaSearch className="h-4 w-4" /> Limpar filtros
							</Button>
						)
					}
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
	);
}

function useFavoriteSet(): Set<string> {
	const { data } = useWishlist(1, 50);
	const ids = (data?.items ?? []).filter((i) => i.ad).map((i) => i.ad!.id);
	return new Set(ids);
}
