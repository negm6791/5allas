import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

export const AddTaskModal = ({ isOpen, onClose, taskToEdit }: AddTaskModalProps) => {
    const [title, setTitle] = useState('');
    const [isPersistent, setIsPersistent] = useState(false);
    const [priority, setPriority] = useState<'critical' | 'standard' | 'secondary'>('standard');
    const { addTask, updateTask } = useTasks();

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setIsPersistent(taskToEdit.isPersistent || false);
            setPriority(taskToEdit.priority || 'standard');
        } else {
            setTitle('');
            setIsPersistent(false);
            setPriority('standard');
        }
    }, [taskToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (taskToEdit) {
            updateTask(taskToEdit.id, { title, isPersistent, priority });
        } else {
            addTask(title, isPersistent, priority);
        }

        onClose();
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
                        className="absolute inset-0 bg-indigo-950/20 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-100"
                    >
                        <form onSubmit={handleSubmit} className="p-12 space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-0.5 w-6 bg-indigo-600 rounded-full" />
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">Antigravity Protocol</p>
                                </div>
                                <h2 className="text-3xl font-black text-indigo-950 tracking-tight">
                                    {taskToEdit ? 'Edit Mission' : 'New Mission'}
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objective_Title</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Command objective..."
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-7 py-5 rounded-xl text-lg font-bold text-indigo-950 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>



                                <div className="flex items-center justify-between p-7 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-600/30 transition-all cursor-pointer group" onClick={() => setIsPersistent(!isPersistent)}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                            <Repeat className={`w-5 h-5 ${isPersistent ? 'text-purple-600' : 'text-slate-500'}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-indigo-950 uppercase">Routine Task</p>
                                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">Routine Cycle Enabled</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all duration-500 ${isPersistent ? 'bg-purple-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${isPersistent ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-900 hover:bg-indigo-950 text-white py-5 rounded-xl text-md font-black shadow-xl shadow-indigo-900/10 transition-all active:scale-[0.98] tracking-widest uppercase"
                                >
                                    {taskToEdit ? 'Update Mission' : 'Engage Mission'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full bg-transparent hover:bg-slate-50 text-slate-400 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase"
                                >
                                    Cancel Command
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
