import { create } from 'zustand';

interface AppState {
    isCommandPaletteOpen: boolean;
    activeTab: string;
    theme: 'light' | 'dark';

    setCommandPaletteOpen: (val: boolean) => void;
    setActiveTab: (tab: string) => void;
    toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
    isCommandPaletteOpen: false,
    activeTab: 'today',
    theme: 'light',

    setCommandPaletteOpen: (val) => set({ isCommandPaletteOpen: val }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
