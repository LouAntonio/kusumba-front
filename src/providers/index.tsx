import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../lib/queryClient';
import { AuthProvider } from './AuthProvider';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>{children}</AuthProvider>
				<Toaster
					position="top-center"
					toastOptions={{
						style: {
							borderRadius: '0.75rem',
							fontSize: '0.9rem',
						},
					}}
				/>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}
