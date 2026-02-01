// frontend/src/components/routines/AddRoutineModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Repeat, Calendar, Clock, Sparkles } from 'lucide-react';
import { useRoutines } from '../../hooks/useRoutines';
import { Button } from '../common/Button';


interface AddRoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddRoutineModal = ({ isOpen, onClose }: AddRoutineModalProps) => {
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [points, setPoints] = useState(2);
    const { addRoutine } = useRoutines();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addRoutine(title, frequency, points);
        setTitle('');
        onClose();
    };

    const freqConfig: Record<string, { icon: any, color: string }> = {
        daily: { icon: Clock, color: 'text-blue-400' },
        weekly: { icon: Calendar, color: 'text-purple-400' },
        monthly: { icon: Repeat, color: 'text-pink-400' }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 40, opacity: 0 }}
                        className="bg-white/5 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 glass-morphism"
                    >
                        <div className="p-12">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-5xl font-black tracking-tighter text-white">New Habit Loop</h2>
                                <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 block">Routine Identifier</label>
                                    <input
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. AM Deep Work"
                                        className="w-full bg-transparent border-b-2 border-white/10 focus:border-purple-500 outline-none text-4xl font-black text-white placeholder:text-white/5 pb-6 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 block">Sync Frequency</label>
                                    <div className="grid grid-cols-3 gap-6">
                                        {(['daily', 'weekly', 'monthly'] as const).map((f) => {
                                            const Icon = freqConfig[f].icon;
                                            const isActive = frequency === f;
                                            return (
                                                <button
                                                    key={f}
                                                    type="button"
                                                    onClick={() => setFrequency(f)}
                                                    className={`group flex flex-col items-center gap-4 p-8 rounded-[2rem] transition-all border-2 ${isActive
                                                        ? 'bg-purple-600 border-purple-500 shadow-2xl shadow-purple-600/20'
                                                        : 'bg-white/5 border-transparent hover:border-white/10'
                                                        }`}
                                                >
                                                    <Icon className={`w-10 h-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : freqConfig[f].color}`} />
                                                    <p className="font-black text-[10px] uppercase tracking-widest text-white">{f}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 block">XP Calibration</label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[2, 3, 5, 10].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPoints(p)}
                                                className={`py-4 rounded-2xl transition-all border-2 ${points === p
                                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                                    : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'
                                                    }`}
                                            >
                                                <span className="font-black text-xl">{p} XP</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={onClose}
                                        className="flex-1 h-20 rounded-[2rem] font-black text-slate-400 hover:text-white tracking-widest"
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] h-20 rounded-[2rem] bg-white text-slate-900 hover:bg-purple-600 hover:text-white font-black text-2xl transition-all duration-500 shadow-xl"
                                    >
                                        ESTABLISH LOOP <Sparkles className="w-6 h-6 inline ml-2" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
