// frontend/src/components/GrowthVisualization/ThemeSelector.tsx
import { motion } from 'framer-motion';
import { VisualizationTheme } from '../../types';
import { Palmtree, Trees, Flower2, Building2 } from 'lucide-react';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';

interface ThemeOption {
    id: VisualizationTheme;
    name: string;
    icon: any;
    color: string;
}

const themes: ThemeOption[] = [
    { id: 'tree', name: 'Zen Tree', icon: Trees, color: 'text-emerald-500' },
    { id: 'island', name: 'Palm Island', icon: Palmtree, color: 'text-blue-400' },
    { id: 'garden', name: 'Spring Garden', icon: Flower2, color: 'text-pink-400' },
    { id: 'city', name: 'Neon City', icon: Building2, color: 'text-purple-400' },
];

export const ThemeSelector = () => {
    const { progress, setVisualizationTheme } = useGrowthProgress();

    return (
        <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = progress.visualizationTheme === theme.id;

                return (
                    <motion.button
                        key={theme.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setVisualizationTheme(theme.id)}
                        className={`relative group p-3 rounded-xl transition-all ${isActive
                                ? 'bg-white/10 text-white shadow-lg'
                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                            }`}
                        title={theme.name}
                    >
                        <Icon className={`w-5 h-5 ${isActive ? theme.color : ''}`} />

                        {isActive && (
                            <motion.div
                                layoutId="activeTheme"
                                className="absolute inset-0 border-2 border-white/20 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[10px] font-black uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                            {theme.name}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
};
