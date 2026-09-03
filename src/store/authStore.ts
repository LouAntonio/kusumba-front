import { create } from 'zustand';
import type { SessionUser } from '../lib/auth';

interface AuthState {
	user: SessionUser | null;
	loading: boolean;
	setUser: (user: SessionUser | null) => void;
	setLoading: (loading: boolean) => void;
	clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: true,
	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	clear: () => set({ user: null, loading: false }),
}));
