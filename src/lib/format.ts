const currencyFormatter = new Intl.NumberFormat('pt-AO', {
	style: 'currency',
	currency: 'AOA',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export function formatCurrency(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return '-';
	}
	return currencyFormatter.format(value);
}

export function formatKz(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return '-';
	}
	return `${new Intl.NumberFormat('pt-AO').format(value)} Kz`;
}

export function formatDate(iso: string | null | undefined): string {
	if (!iso) {
		return '-';
	}
	return new Intl.DateTimeFormat('pt-AO', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(new Date(iso));
}

export function formatTime(iso: string | null | undefined): string {
	if (!iso) {
		return '';
	}
	return new Intl.DateTimeFormat('pt-AO', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(iso));
}

export function timeAgo(iso: string | null | undefined): string {
	if (!iso) {
		return '';
	}
	const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
	if (seconds < 60) {
		return 'agora mesmo';
	}
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes} min atrás`;
	}
	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours} h atrás`;
	}
	const days = Math.floor(hours / 24);
	if (days < 30) {
		return `${days} dia${days > 1 ? 's' : ''} atrás`;
	}
	return formatDate(iso);
}

export function fullName(user: { name: string; surname: string }): string {
	return `${user.name} ${user.surname}`.trim();
}

export function initialsOf(name: string): string {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join('')
		.toUpperCase();
}

export function formatDistance(meters: number | null | undefined): string {
	if (meters === null || meters === undefined) {
		return '';
	}
	if (meters < 1000) {
		return `${Math.round(meters)} m`;
	}
	if (meters < 10000) {
		return `${(meters / 1000).toFixed(1)} km`;
	}
	return `${Math.round(meters / 1000)} km`;
}
