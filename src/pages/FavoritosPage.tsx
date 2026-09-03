import { useWishlist } from '../hooks/useWishlist';
import { useAuthStore } from '../store/authStore';
import { AdCard } from '../components/ads/AdCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function FavoritosPage() {
	const user = useAuthStore((s) => s.user);
	const { data, isLoading } = useWishlist(1, 50);
	const favorites = (data?.items ?? []).filter((item) => item.ad);
	const favoriteIds = new Set(favorites.map((f) => f.ad!.id));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl">Meus favoritos</h1>
				<p className="text-sm text-muted">
					Itens que guardou para ver mais tarde.
				</p>
			</div>

			{isLoading ? (
				<Spinner className="mx-auto" />
			) : favorites.length === 0 ? (
				<EmptyState
					title="Sem favoritos ainda"
					description="Quando encontrar algo que goste, toque no coração para o guardar aqui."
					action={
						<Button to="/anuncios" variant="accent">
							Explorar anúncios
						</Button>
					}
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					{favorites.map((item) => (
						<AdCard
							key={item.id}
							ad={item.ad!}
							favorited={favoriteIds.has(item.ad!.id)}
							showFavorite={Boolean(user)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
