import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PerfilPage } from './PerfilPage';
import { PublicProfilePage } from './PublicProfilePage';
import { RequireAuth } from '../components/layout/RequireAuth';

export function ProfileRouter() {
	const [params] = useSearchParams();
	const user = useAuthStore((s) => s.user);
	const targetUserId = params.get('user');

	const isPublicOther = Boolean(targetUserId) && targetUserId !== user?.id;

	if (isPublicOther) {
		return <PublicProfilePage />;
	}

	return (
		<RequireAuth>
			<PerfilPage />
		</RequireAuth>
	);
}
