import { useNavigate } from 'react-router-dom';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { signInWithGoogleIdToken } from '../../lib/auth';
import { getApiError } from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

export function GoogleOneTap() {
	const user = useAuthStore((s) => s.user);
	const loading = useAuthStore((s) => s.loading);

	if (user || loading) {
		return null;
	}

	return <GoogleOneTapPrompt />;
}

function GoogleOneTapPrompt() {
	const setUser = useAuthStore((s) => s.setUser);
	const navigate = useNavigate();

	const handleSuccess = async (credential?: string) => {
		if (!credential) {
			toast.error('Não foi possível obter a credencial do Google.');
			return;
		}
		try {
			const session = await signInWithGoogleIdToken(credential);
			setUser(session.user);
			toast.success(`Bem-vindo, ${session.user.name}!`);
			navigate('/anuncios');
		} catch (error) {
			toast.error(getApiError(error));
		}
	};

	useGoogleOneTapLogin({
		onSuccess: (res) => handleSuccess(res.credential),
		onError: () => toast.error('Não foi possível entrar com o Google.'),
		cancel_on_tap_outside: true,
		auto_select: false,
	});

	return null;
}
