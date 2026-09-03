import { useQuery } from '@tanstack/react-query';
import { listPlans } from '../api/plans';

export function usePlans() {
	return useQuery({
		queryKey: ['plans'],
		queryFn: () => listPlans(),
		staleTime: 5 * 60_000,
	});
}
