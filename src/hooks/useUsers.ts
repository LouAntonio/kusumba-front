import { useQuery } from '@tanstack/react-query';
import { getMyKyc } from '../api/kyc';
import { getMySubscription } from '../api/subscriptions';
import { getMe, getPublicUser } from '../api/users';

export function useMe() {
	return useQuery({
		queryKey: ['me'],
		queryFn: getMe,
	});
}

export function usePublicUser(id: string | undefined) {
	return useQuery({
		queryKey: ['public-user', id],
		queryFn: () => getPublicUser(id as string),
		enabled: Boolean(id),
	});
}

export function useMyKyc() {
	return useQuery({
		queryKey: ['kyc'],
		queryFn: getMyKyc,
	});
}

export function useMySubscription() {
	return useQuery({
		queryKey: ['my-subscription'],
		queryFn: getMySubscription,
	});
}
