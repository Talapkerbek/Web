import { create } from "zustand";

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (partial: Partial<User>) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    updateUser: (partial) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...partial } : null,
        })),

    clearUser: () => set({ user: null }),
}));
