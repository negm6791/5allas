// frontend/src/components/GrowthVisualization/MilestoneList.tsx
import { motion } from 'framer-motion';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../../utils/growthCalculator';

export const MilestoneList = () => {
    const { progress } = useGrowthProgress();

    return (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {LEVEL_THRESHOLDS.map((threshold) => {
                const isUnlocked = (progress.currentLevel || 1) >= threshold.level;
                const isCurrent = (progress.currentLevel || 1) === threshold.level;

                return (
                    <motion.div
                        key={threshold.level}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isCurrent
                            ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                            : isUnlocked
                                ? 'bg-white/5 border-white/10 opacity-60'
                                : 'bg-white/[0.02] border-white/5 opacity-40 grayscale'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'
                            }`}>
                            {isUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className={`font-black text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                    {threshold.name}
                                </h4>
                                {isCurrent && (
                                    <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase">Current</span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                Level {threshold.level} • {threshold.pointsRequired} XP
                            </p>
                        </div>

                        {isUnlocked && (
                            <Trophy className={`w-4 h-4 ${isCurrent ? 'text-yellow-400' : 'text-blue-500/50'}`} />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};
