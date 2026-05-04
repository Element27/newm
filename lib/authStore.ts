import { create } from "zustand";

export type AuthUser = {
  id: string;
  email?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  session: null;
  loading: boolean;
  setAuth: (user: AuthUser | null, session: null) => void;
  setLoading: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setAuth: (user, session) => set((state) => {
    if (state.user?.id === user?.id && state.user?.email === user?.email) {
      return state;
    }
    return { user, session };
  }),
  setLoading: (v) => set({ loading: v }),
}));

