import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { LandingPage } from './pages/LandingPage';
import { AdsListPage } from './pages/AdsListPage';
import { AdDetailPage } from './pages/AdDetailPage';
import { CreateAdPage } from './pages/CreateAdPage';
import { EditAdPage } from './pages/EditAdPage';
import { LoginPage } from './pages/LoginPage';
import { PerfilPage } from './pages/PerfilPage';
import { MeusAnunciosPage } from './pages/MeusAnunciosPage';
import { FavoritosPage } from './pages/FavoritosPage';
import { KycPage } from './pages/KycPage';
import { MensagensPage } from './pages/MensagensPage';
import { ConversaPage } from './pages/ConversaPage';
import { PlanosPage } from './pages/PlanosPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{ path: '/', element: <LandingPage /> },
			{ path: '/anuncios', element: <AdsListPage /> },
			{ path: '/procurar', element: <AdsListPage /> },
			{
				path: '/anuncios/novo',
				element: (
					<RequireAuth>
						<CreateAdPage />
					</RequireAuth>
				),
			},
			{ path: '/anuncios/:slug', element: <AdDetailPage /> },
			{
				path: '/anuncios/:slug/editar',
				element: (
					<RequireAuth>
						<EditAdPage />
					</RequireAuth>
				),
			},
			{ path: '/entrar', element: <LoginPage /> },
			{
				path: '/perfil',
				element: (
					<RequireAuth>
						<PerfilPage />
					</RequireAuth>
				),
			},
			{
				path: '/perfil/anuncios',
				element: (
					<RequireAuth>
						<MeusAnunciosPage />
					</RequireAuth>
				),
			},
			{
				path: '/perfil/favoritos',
				element: (
					<RequireAuth>
						<FavoritosPage />
					</RequireAuth>
				),
			},
			{
				path: '/perfil/kyc',
				element: (
					<RequireAuth>
						<KycPage />
					</RequireAuth>
				),
			},
			{
				path: '/mensagens',
				element: (
					<RequireAuth>
						<MensagensPage />
					</RequireAuth>
				),
			},
			{
				path: '/mensagens/:conversationId',
				element: (
					<RequireAuth>
						<ConversaPage />
					</RequireAuth>
				),
			},
			{ path: '/planos', element: <PlanosPage /> },
			{
				path: '/assinatura',
				element: (
					<RequireAuth>
						<SubscriptionPage />
					</RequireAuth>
				),
			},
			{
				path: '/denuncias',
				element: (
					<RequireAuth>
						<ReportsPage />
					</RequireAuth>
				),
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
