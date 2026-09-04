import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pathLabels: Record<string, string> = {
	'': 'Kusumba',
	anuncios: 'Anúncios',
	procurar: 'Procurar',
	entrar: 'Entrar',
	registar: 'Criar conta',
	'esqueci-a-senha': 'Recuperar senha',
	'redefinir-senha': 'Redefinir senha',
	perfil: 'Perfil',
	mensagens: 'Mensagens',
	planos: 'Planos',
	assinatura: 'Assinatura',
	sobre: 'Sobre',
	contacto: 'Contacto',
	politicas: 'Políticas',
	termos: 'Termos',
	denuncias: 'Moderação',
};

function labelFor(pathname: string): string {
	const parts = pathname.split('/').filter(Boolean);
	if (parts.length === 0) return 'Kusumba';

	if (parts[0] === 'anuncios' && parts[1] === 'novo') return 'Criar anúncio';
	if (parts[0] === 'anuncios' && parts[2] === 'editar')
		return 'Editar anúncio';

	const base = pathLabels[parts[0]];
	if (!base) return 'Kusumba';
	return `${base} · Kusumba`;
}

export function usePageTitle() {
	const location = useLocation();

	useEffect(() => {
		document.title = labelFor(location.pathname);
	}, [location.pathname]);
}
