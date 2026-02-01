// frontend/src/components/GrowthVisualization/MilestoneCelebration.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import { GrowthMilestone } from '../../types';

export const MilestoneCelebration = () => {
    const { progress, markMilestoneShown } = useGrowthProgress();
    const [activeMilestone, setActiveMilestone] = useState<GrowthMilestone | null>(null);

    useEffect(() => {
        const unshown = (progress.milestones || []).find(m => !m.celebrationShown);
        if (unshown) {
            setActiveMilestone(unshown);
        } else {
            setActiveMilestone(null);
        }
    }, [progress.milestones]);

    const handleClose = () => {
        if (activeMilestone) {
            markMilestoneShown(activeMilestone.id);
            setActiveMilestone(null);
        }
    };

    return (
        <AnimatePresence>
            {activeMilestone && (
                <>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            numberOfPieces={300}
                            recycle={false}
                            gravity={0.2}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[101] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -20, y: 100 }}
                            animate={{ scale: 1, rotate: 0, y: 0 }}
                            exit={{ scale: 0.5, rotate: 20, y: 100 }}
                            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-1 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.3)] max-w-md w-full"
                        >
                            <div className="bg-gray-900 rounded-[2.8rem] p-10 text-center relative overflow-hidden">
                                {/* Background Decorations */}
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.2),transparent)]" />

                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, -10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 1, repeat: 3 }}
                                    className="text-9xl mb-8 relative z-10"
                                >
                                    🎉
                                </motion.div>

                                <h2 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none relative z-10">
                                    {activeMilestone.title}
                                </h2>

                                <p className="text-xl text-gray-400 mb-8 font-medium relative z-10">
                                    {activeMilestone.description}
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-center justify-center gap-4 relative z-10">
                                    <div className="text-left font-black">
                                        <p className="text-[10px] text-yellow-500 uppercase tracking-widest">New Status</p>
                                        <p className="text-2xl text-white">Level {activeMilestone.level}</p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClose}
                                    className="bg-white text-black font-black text-xl py-5 px-12 rounded-3xl shadow-2xl hover:bg-yellow-400 transition-colors relative z-10"
                                >
                                    KEEP GROWING 🚀
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
