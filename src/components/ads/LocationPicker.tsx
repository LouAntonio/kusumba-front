import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaLocationArrow } from 'react-icons/fa';
import type { Location } from '../../lib/types';
import { cn } from '../../lib/cn';

const LUANDA: [number, number] = [-8.8383, 13.2344];

const TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined)?.trim();

export function LocationPicker({
	value,
	onChange,
}: {
	value?: Location | null;
	onChange: (loc: Location) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const markerRef = useRef<mapboxgl.Marker | null>(null);

	const [loc, setLoc] = useState<Location>(
		value ?? { lat: LUANDA[0], lng: LUANDA[1] },
	);
	const [search, setSearch] = useState('');
	const [geocoding, setGeocoding] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const hasToken = Boolean(TOKEN);

	useEffect(() => {
		if (!hasToken || !containerRef.current) return;
		mapboxgl.accessToken = TOKEN as string;
		const map = new mapboxgl.Map({
			container: containerRef.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [loc.lng, loc.lat],
			zoom: 12,
		});
		mapRef.current = map;
		const marker = new mapboxgl.Marker({ draggable: true })
			.setLngLat([loc.lng, loc.lat])
			.addTo(map);
		markerRef.current = marker;
		const onDragEnd = () => {
			const lngLat = marker.getLngLat();
			const next = { lat: lngLat.lat, lng: lngLat.lng };
			setLoc(next);
			onChange(next);
		};
		marker.on('dragend', onDragEnd);
		return () => {
			marker.off('dragend', onDragEnd);
			map.remove();
			mapRef.current = null;
			markerRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasToken]);

	const setMarker = (lat: number, lng: number) => {
		const next = { lat, lng };
		setLoc(next);
		onChange(next);
		markerRef.current?.setLngLat([lng, lat]);
		mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });
	};

	const useMyLocation = () => {
		if (!('geolocation' in navigator)) {
			setError('A geolocalização não é suportada neste navegador.');
			return;
		}
		setBusy(true);
		setError(null);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setMarker(pos.coords.latitude, pos.coords.longitude);
				setBusy(false);
			},
			() => {
				setError(
					'Não foi possível obter a sua localização. Verifique as permissões.',
				);
				setBusy(false);
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	};

	const searchPlace = async () => {
		if (!search.trim() || !hasToken) return;
		setGeocoding(true);
		setError(null);
		try {
			const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
				search.trim(),
			)}.json?access_token=${TOKEN}&country=ao&limit=5`;
			const res = await fetch(url);
			if (!res.ok) {
				throw new Error('Falha na pesquisa');
			}
			const data = await res.json();
			const feature = data?.features?.[0];
			if (feature?.center) {
				setMarker(feature.center[1], feature.center[0]);
			} else {
				setError('Nenhum local encontrado para essa pesquisa.');
			}
		} catch {
			setError('Não foi possível pesquisar o local.');
		} finally {
			setGeocoding(false);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex flex-1 gap-2">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								void searchPlace();
							}
						}}
						placeholder="Pesquisar endereço ou local…"
						className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
						disabled={!hasToken}
					/>
					<button
						type="button"
						onClick={() => void searchPlace()}
						disabled={!hasToken || geocoding}
						className="inline-flex h-10 shrink-0 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
					>
						{geocoding ? 'A procurar…' : 'Procurar'}
					</button>
				</div>
				<button
					type="button"
					onClick={useMyLocation}
					disabled={busy}
					className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-primary-200 bg-white px-3 text-sm font-medium text-primary-700 transition hover:bg-primary-50 disabled:opacity-60"
				>
					<FaLocationArrow
						className={cn('h-3.5 w-3.5', busy && 'animate-pulse')}
					/>
					{busy ? 'A obter…' : 'Usar a minha localização'}
				</button>
			</div>

			{hasToken ? (
				<div
					ref={containerRef}
					className="h-56 w-full overflow-hidden rounded-xl border border-slate-200"
				/>
			) : (
				<div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
					<label className="text-sm font-medium text-slate-700">
						Latitude
						<input
							type="number"
							step="any"
							value={Number.isFinite(loc?.lat) ? loc.lat : ''}
							onChange={(e) =>
								setMarker(
									Number(e.target.value),
									loc?.lng ?? LUANDA[1],
								)
							}
							className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
							placeholder="-8.8383"
						/>
					</label>
					<label className="text-sm font-medium text-slate-700">
						Longitude
						<input
							type="number"
							step="any"
							value={Number.isFinite(loc?.lng) ? loc.lng : ''}
							onChange={(e) =>
								setMarker(
									loc?.lat ?? LUANDA[0],
									Number(e.target.value),
								)
							}
							className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
							placeholder="13.2344"
						/>
					</label>
				</div>
			)}

			{!hasToken && (
				<p className="text-xs text-amber-700">
					Configure{' '}
					<code className="font-mono">VITE_MAPBOX_TOKEN</code> para
					ativar o mapa. Enquanto isso pode inserir as coordenadas
					manualmente.
				</p>
			)}
			{error && <p className="text-xs text-red-600">{error}</p>}
		</div>
	);
}
