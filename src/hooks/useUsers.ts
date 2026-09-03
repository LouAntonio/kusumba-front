import { useQuery } from '@tanstack/react-query';
import { getMyKyc } from '../api/kyc';
import { getMySubscription } from '../api/subscriptions';
import { getMe } from '../api/users';

export function useMe() {
	return useQuery({
		queryKey: ['me'],
		queryFn: getMe,
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
