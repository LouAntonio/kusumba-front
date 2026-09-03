export type Role = 'USER' | 'ADMIN' | 'MODERATOR' | 'PROMOTER';

export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AdType = 'SALE' | 'TRADE' | 'DONATION';

export type AdStatus = 'ACTIVE' | 'SOLD' | 'TRADED' | 'ARCHIVED' | 'REJECTED';

export type AdVisibility = 'VISIBLE' | 'HIDDEN';

export type AdSort =
	'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'distance';

export const AD_SORTS: AdSort[] = [
	'newest',
	'oldest',
	'price_asc',
	'price_desc',
	'distance',
];

export type SubscriptionTier = 'FREE' | 'KUSUMBA_PASS';

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';

export type ReportTarget = 'AD' | 'USER' | 'REVIEW' | 'MESSAGE';

export type ReportReason =
	| 'SPAM'
	| 'FRAUD'
	| 'FAKE_AD'
	| 'INAPPROPRIATE'
	| 'DEFECTIVE_PRODUCT'
	| 'NOT_AS_DESCRIBED'
	| 'OTHER';

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface GalleryItem {
	url: string;
	cloudinaryId: string;
	type?: string;
}

export interface Location {
	lat: number;
	lng: number;
}

export interface User {
	id: string;
	name: string;
	surname: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string | null;
	role: Role;
	banned?: boolean | null;
	banReason?: string | null;
	banExpires?: string | null;
	phone?: string | null;
	trustScore: number;
	isVerified: boolean;
	subscriptionTier: SubscriptionTier;
	neighborhood?: string | null;
	city?: string | null;
	accounts?: {
		id: string;
		providerId: string;
		accountId: string;
	}[];
	hasPassword?: boolean;
	kyc?: { status: KYCStatus } | null;
}

export interface Category {
	id: string;
	slug: string;
	name: string;
}

export interface Ad {
	id: string;
	slug: string;
	title: string;
	description: string;
	price?: number | null;
	type: AdType;
	status: AdStatus;
	visibility: AdVisibility;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
	tradefor: string[];
	averageRating?: number | null;
	reviewCount: number;
	featured: boolean;
	featuredUntil?: string | null;
	featuredAt?: string | null;
	image?: string | null;
	imageId?: string | null;
	gallery: GalleryItem[];
	distanceM?: number | null;
	user?: {
		id: string;
		name: string;
		surname: string;
		image?: string | null;
		trustScore: number;
		isVerified: boolean;
		neighborhood?: string | null;
		city?: string | null;
	} | null;
	categories: Category[];
}

export interface Paginated<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	proximity?: boolean;
}

export interface AdQuery {
	page?: number;
	limit?: number;
	sortBy?: AdSort;
	type?: AdType;
	categoryIds?: string;
	q?: string;
	minPrice?: number;
	maxPrice?: number;
	city?: string;
	neighborhood?: string;
	includeInactive?: boolean;
	featured?: boolean;
	lat?: number;
	lng?: number;
	radiusKm?: number;
}

export interface Message {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	conversationId: string;
	isRead: boolean;
	media: GalleryItem[];
}

export interface ConversationParticipant {
	id: string;
	userId: string;
	conversationId: string;
	user?: User;
}

export interface ConversationAd {
	id: string;
	title: string;
	slug: string;
	image: string | null;
	price: number | null;
	type: string;
}

export interface ConversationOther {
	id: string;
	name: string;
	surname: string | null;
	image: string | null;
}

export interface Conversation {
	id: string;
	adId?: string;
	createdAt: string;
	updatedAt: string;
	ad?: ConversationAd | Ad;
	other?: ConversationOther | null;
	participants?: ConversationParticipant[];
	messages?: Message[];
	lastMessage?: Message | null;
	unreadCount?: number;
}

export interface Review {
	id: string;
	rating: number;
	comment?: string | null;
	response?: string | null;
	adId: string;
	reviewerId: string;
	revieweeId: string;
	createdAt: string;
	updatedAt: string;
	reviewer?: User;
	reviewee?: User;
	ad?: Ad;
}

export interface Report {
	id: string;
	targetType: ReportTarget;
	targetId: string;
	reason: ReportReason;
	description?: string | null;
	media: GalleryItem[];
	status: ReportStatus;
	reporterId: string;
	createdAt: string;
	updatedAt: string;
}

export interface WishlistItem {
	id: string;
	userId: string;
	adId: string;
	createdAt: string;
	ad?: Ad;
}

export interface Plan {
	id: string;
	name: string;
	description?: string | null;
	price: number;
	benefits: string[];
	currency: string;
	durationDays: number;
	featuredAdsLimit: number;
	tier: SubscriptionTier;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Subscription {
	id: string;
	userId: string;
	planId: string;
	tier: SubscriptionTier;
	status: SubscriptionStatus;
	startDate: string;
	endDate: string;
	autoRenew: boolean;
	cancelledAt?: string | null;
	renewedAt?: string | null;
	createdAt: string;
	updatedAt: string;
	plan?: Plan;
}

export interface KYC {
	id: string;
	userId: string;
	status: KYCStatus;
	rejectionReason?: string | null;
	biFrontUrl: string;
	biBackUrl: string;
	selfies: { url: string; cloudinaryId: string }[];
	verifiedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export const AD_TYPE_LABELS: Record<AdType, string> = {
	SALE: 'Venda',
	TRADE: 'Troca',
	DONATION: 'Doação',
};

export const AD_STATUS_LABELS: Record<AdStatus, string> = {
	ACTIVE: 'Ativo',
	SOLD: 'Vendido',
	TRADED: 'Trocado',
	ARCHIVED: 'Arquivado',
	REJECTED: 'Rejeitado',
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
	SPAM: 'Spam',
	FRAUD: 'Fraude',
	FAKE_AD: 'Anúncio falso',
	INAPPROPRIATE: 'Conteúdo impróprio',
	DEFECTIVE_PRODUCT: 'Produto com defeito',
	NOT_AS_DESCRIBED: 'Não corresponde à descrição',
	OTHER: 'Outro',
};

export const REPORT_TARGET_LABELS: Record<ReportTarget, string> = {
	AD: 'Anúncio',
	USER: 'Utilizador',
	REVIEW: 'Avaliação',
	MESSAGE: 'Mensagem',
};
