import { create } from 'zustand';
import { User, Role } from '@/types/auth';

interface AuthState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, role: user?.role || null, isAuthenticated: !!user }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null, role: null, isAuthenticated: false }),
}));
