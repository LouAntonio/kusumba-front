import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { RequireGuest } from './components/layout/RequireGuest';
import { LandingPage } from './pages/LandingPage';
import { AdsListPage } from './pages/AdsListPage';
import { AdDetailPage } from './pages/AdDetailPage';
import { CreateAdPage } from './pages/CreateAdPage';
import { EditAdPage } from './pages/EditAdPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { MagicCallbackPage } from './pages/MagicCallbackPage';
import { ProfileRouter } from './pages/ProfileRouter';
import { MeusAnunciosPage } from './pages/MeusAnunciosPage';
import { FavoritosPage } from './pages/FavoritosPage';
import { MinhasDenunciasPage } from './pages/MinhasDenunciasPage';
import { KycPage } from './pages/KycPage';
import { MensagensPage } from './pages/MensagensPage';
import { ConversaPage } from './pages/ConversaPage';
import { PlanosPage } from './pages/PlanosPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { TermsPage } from './pages/TermsPage';

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
			{
				path: '/entrar',
				element: (
					<RequireGuest>
						<LoginPage />
					</RequireGuest>
				),
			},
			{
				path: '/registar',
				element: (
					<RequireGuest>
						<RegisterPage />
					</RequireGuest>
				),
			},
			{
				path: '/esqueci-a-senha',
				element: (
					<RequireGuest>
						<ForgotPasswordPage />
					</RequireGuest>
				),
			},
			{
				path: '/redefinir-senha',
				element: (
					<RequireGuest>
						<ResetPasswordPage />
					</RequireGuest>
				),
			},
			{ path: '/auth/magic', element: <MagicCallbackPage /> },
			{
				path: '/perfil',
				element: <ProfileRouter />,
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
				path: '/perfil/denuncias',
				element: (
					<RequireAuth>
						<MinhasDenunciasPage />
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
			{ path: '/sobre', element: <AboutPage /> },
			{ path: '/contacto', element: <ContactPage /> },
			{ path: '/politicas', element: <PoliciesPage /> },
			{ path: '/termos', element: <TermsPage /> },
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
