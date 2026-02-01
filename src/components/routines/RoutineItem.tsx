// frontend/src/components/routines/RoutineItem.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Flame, Sprout, CheckCircle2 } from 'lucide-react';
import { useRoutines } from '../../hooks/useRoutines';
import { Routine } from '../../types';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import { fadeInUp } from '../../animations/variants';
import { isSameDay, startOfDay } from 'date-fns';

interface RoutineItemProps {
    routine: Routine;
}

export const RoutineItem = ({ routine }: RoutineItemProps) => {
    const { completeRoutine, deleteRoutine } = useRoutines();
    const { addGrowthPoints } = useGrowthProgress();
    const [isCompleting, setIsCompleting] = useState(false);

    const today = startOfDay(new Date());
    const isCompletedToday = routine.completions.some(comp =>
        isSameDay(new Date(comp.completedAt), today)
    );

    const handleComplete = async () => {
        if (!isCompletedToday) {
            setIsCompleting(true);
            const result = completeRoutine(routine.id);
            if (result.success) {
                // Celebration delay
                setTimeout(() => {
                    addGrowthPoints(result.points);
                    setIsCompleting(false);
                }, 800);
            } else {
                setIsCompleting(false);
            }
        }
    };

    const handleDelete = () => {
        deleteRoutine(routine.id);
    };

    const freqColors: Record<string, string> = {
        daily: 'text-blue-500 bg-blue-50 border-blue-100',
        weekly: 'text-purple-500 bg-purple-50 border-purple-100',
        monthly: 'text-pink-500 bg-pink-50 border-pink-100',
        custom: 'text-indigo-500 bg-indigo-50 border-indigo-100'
    };

    return (
        <motion.div
            variants={fadeInUp}
            layout
            className={`group flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 ${isCompletedToday
                ? 'bg-white/40 border-slate-100 opacity-60'
                : 'bg-white border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]'
                }`}
        >
            {/* Rapid-Sync Completion Bubble */}
            <motion.button
                whileHover={!isCompletedToday ? { scale: 1.1 } : {}}
                whileTap={!isCompletedToday ? { scale: 0.9 } : {}}
                onClick={handleComplete}
                className={`w-12 h-12 rounded-[1.4rem] border-2 flex items-center justify-center transition-all ${isCompletedToday || isCompleting
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-100'
                    : 'border-slate-100 hover:border-emerald-400 bg-slate-50'
                    }`}
            >
                {isCompletedToday || isCompleting ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-6 h-6 text-white stroke-[2.5]" />
                    </motion.div>
                ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                )}
            </motion.button>

            {/* Routine Details */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-bold text-base ${isCompletedToday ? 'text-slate-400' : 'text-slate-800'}`}>
                        {routine.title}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${freqColors[routine.frequency]}`}>
                        {routine.frequency}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-orange-500">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{routine.streak} DAY STREAK</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-500">
                        <Sprout className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">REWARD: {routine.growthPoints} XP</span>
                    </div>
                </div>
            </div>

            {/* Action Group */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* XP Burst */}
            <AnimatePresence>
                {isCompleting && (
                    <motion.div
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -100, scale: 2.5 }}
                        className="absolute left-1/2 top-0 pointer-events-none z-20"
                    >
                        <div className="text-emerald-500 font-black text-2xl drop-shadow-2xl">
                            +{routine.growthPoints} XP 🚀
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
