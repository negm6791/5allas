// frontend/src/components/tasks/TaskItem.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, Sprout } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import { fadeInUp } from '../../animations/variants';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const { toggleTask, deleteTask } = useTasks();
    const { addGrowthPoints } = useGrowthProgress();
    const [isCompleting, setIsCompleting] = useState(false);

    const handleToggle = async () => {
        if (!task.completed) {
            setIsCompleting(true);
            // Satisfaction delay for the mission feeling
            setTimeout(() => {
                toggleTask(task.id);
                if (task.growthPoints) {
                    addGrowthPoints(task.growthPoints);
                }
                setIsCompleting(false);
            }, 600);
        } else {
            toggleTask(task.id);
        }
    };

    const handleDelete = () => {
        deleteTask(task.id);
    };

    const priorityColors: Record<string, string> = {
        secondary: 'bg-emerald-50 text-emerald-600 border-emerald-100', // mapped from low
        standard: 'bg-amber-50 text-amber-600 border-amber-100',   // mapped from medium
        critical: 'bg-rose-50 text-rose-600 border-rose-100'      // mapped from high
    };

    return (
        <motion.div
            variants={fadeInUp}
            layout
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className={`group relative flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300 border ${task.completed
                ? 'bg-white/50 border-gray-100 opacity-60'
                : 'bg-white border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
                }`}
        >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDelete}
                    className="text-gray-300 hover:text-rose-500 transition-colors p-2"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Premium Completion Checkbox */}
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggle}
                className={`w-10 h-10 rounded-[1.2rem] border-2 flex items-center justify-center transition-all ${task.completed || isCompleting
                    ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100'
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {(task.completed || isCompleting) && (
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                        >
                            <Check className="w-5 h-5 text-white stroke-[3.5]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Task Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-bold text-base transition-all duration-300 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}>
                        {task.title}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${priorityColors[task.priority || 'standard']}`}>
                        {task.priority || 'standard'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="tracking-wide">MISSION REWARD: {task.growthPoints} XP</span>
                </div>
            </div>

            {/* Growth Pulse Animation */}
            <AnimatePresence>
                {isCompleting && (
                    <motion.div
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -80, scale: 2 }}
                        className="absolute right-16 top-0 pointer-events-none z-10"
                    >
                        <div className="text-emerald-500 font-black text-xl drop-shadow-2xl">
                            +{task.growthPoints} XP 🌱
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
