// frontend/src/components/GrowthVisualization/GrowthContainer.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import TreeVisualization from './TreeVisualization';
import IslandVisualization from './IslandVisualization';
import GardenVisualization from './GardenVisualization';
import CityVisualization from './CityVisualization';
import { ThemeSelector } from './ThemeSelector';
import { Sprout, Trophy } from 'lucide-react';

export const GrowthContainer = () => {
    const { progress, levelInfo } = useGrowthProgress();

    const renderVisualization = () => {
        const props = { level: levelInfo.currentLevel };
        const theme = progress.visualizationTheme || 'tree';
        switch (theme) {
            case 'tree': return <TreeVisualization {...props} />;
            case 'island': return <IslandVisualization {...props} />;
            case 'garden': return <GardenVisualization {...props} />;
            case 'city': return <CityVisualization {...props} />;
            default: return <TreeVisualization {...props} />;
        }
    };

    const themeBackgrounds: Record<string, string> = {
        tree: 'from-sky-900/40 to-emerald-900/40',
        island: 'from-blue-900/40 to-yellow-900/20',
        garden: 'from-pink-900/30 to-green-900/40',
        city: 'from-indigo-900/50 to-purple-900/50',
    };

    return (
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group transition-all duration-700 hover:border-white/20">
            {/* Dynamic Ambience Glow */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={progress.visualizationTheme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${themeBackgrounds[progress.visualizationTheme || 'tree']} opacity-30`}
                />
            </AnimatePresence>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <Sprout className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                            Ecosystem
                        </h2>
                        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mt-1 pl-1">
                            {levelInfo.levelName} • Level {levelInfo.currentLevel}
                        </p>
                    </div>

                    <ThemeSelector />
                </div>

                {/* Level Progress Bar */}
                <div className="mb-10 p-6 bg-black/40 rounded-[1.8rem] border border-white/5 shadow-inner">
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase mb-3 tracking-widest leading-none">
                        <span>XP Velocity: {progress.totalPoints} TOTAL</span>
                        <span>{Math.round(levelInfo.progressPercentage)}% TO Lvl {levelInfo.currentLevel + 1}</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-green-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${levelInfo.progressPercentage}%` }}
                            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="bg-black/40 rounded-[2.2rem] p-10 min-h-[420px] flex items-end justify-center relative overflow-hidden group/viz border border-white/5 shadow-inner">
                    {/* Grid texture overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={progress.visualizationTheme}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            {renderVisualization()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Level Badge Overlay */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        key={levelInfo.currentLevel}
                        className="absolute top-6 right-6 bg-white text-black w-14 h-14 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-40">Lvl</span>
                        <span className="font-black text-2xl leading-none">{levelInfo.currentLevel}</span>
                    </motion.div>

                    {/* Stats Pill */}
                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-black text-sm tracking-tight">{progress.totalPoints} XP</span>
                    </div>
                </div>

                {/* Milestone Quick View */}
                <div className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {(progress.milestones || []).slice(-4).reverse().map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-shrink-0 bg-white/5 border border-white/5 hover:border-white/10 px-4 py-3 rounded-2xl text-[10px] text-white/40 font-black flex items-center gap-3 transition-colors uppercase tracking-widest"
                        >
                            <Trophy className="w-3 h-3 text-yellow-500/30" />
                            {m.title}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
