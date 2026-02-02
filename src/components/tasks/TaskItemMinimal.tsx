// frontend/src/components/tasks/TaskItemMinimal.tsx
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { Check, Trash2, Repeat, Plus, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface TaskItemMinimalProps {
    task: Task;
    viewDate?: string;
    onEdit?: (task: Task) => void;
}

export const TaskItemMinimal = ({ task, viewDate, onEdit }: TaskItemMinimalProps) => {
    const { toggleTask, deleteTask, addSubTask, toggleSubTask, deleteSubTask } = useTasks();
    const [isExpanded, setIsExpanded] = useState(false);
    const [subTaskTitle, setSubTaskTitle] = useState('');

    const targetDate = viewDate || format(new Date(), 'yyyy-MM-dd');
    const todaySubTasks = (task.subtasks || []).filter(st => st.date === targetDate);

    const handleAddSubTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subTaskTitle.trim()) return;
        addSubTask(task.id, subTaskTitle);
        setSubTaskTitle('');
    };



    return (
        <>
            <tr className={`group transition-all duration-300 border-b border-slate-50 last:border-0 ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/70'}`}>
                <td className="pl-10 py-5 w-16">
                    <button
                        onClick={() => {
                            toggleTask(task.id);
                            toast.success(`Objective Cleared`, {
                                style: { background: '#312E81', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px' },
                                iconTheme: { primary: '#fff', secondary: '#312E81' }
                            });
                        }}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${task.completed
                            ? 'bg-indigo-900 border-indigo-900 text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                            }`}
                    >
                        {task.completed && <Check className="w-5 h-5 stroke-[4]" />}
                    </button>
                </td>
                <td className="px-4 py-5 font-medium">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <span className={`text-base font-bold tracking-tight transition-all duration-300 ${task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-indigo-950'
                                }`}>
                                {task.title}
                            </span>



                            {task.isPersistent && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all duration-300 ${isExpanded ? 'bg-purple-600 border-purple-600 text-white' : 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-white'}`}
                                >
                                    <Repeat className={`w-3 h-3 ${isExpanded ? 'text-white' : 'text-purple-500'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest ml-1">Routine</span>
                                </button>
                            )}
                            <button
                                onClick={() => onEdit?.(task)}
                                className="p-2 text-slate-400 hover:text-indigo-600 transition-all opacity-100 ml-auto"
                                title="Edit Task"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 transition-all opacity-100"
                                title="Delete Task"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        {isExpanded && task.isPersistent && (
                            <div className="mt-6 space-y-4 pl-4 border-l-2 border-slate-100 ml-1">
                                <div className="space-y-2.5">
                                    {todaySubTasks.map(st => (
                                        <div key={st.id} className="flex items-center justify-between group/sub transition-all">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleSubTask(task.id, st.id)}
                                                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${st.completed
                                                        ? 'bg-indigo-800 border-indigo-800 text-white'
                                                        : 'border-slate-300 bg-white hover:border-slate-500'}`}
                                                >
                                                    {st.completed && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                                                </button>
                                                <span className={`text-[13px] font-bold transition-colors ${st.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                                    {st.title}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteSubTask(task.id, st.id)}
                                                className="p-2 opacity-100 text-slate-300 hover:text-rose-600 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddSubTask} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 focus-within:border-slate-400 transition-all">
                                    <Plus className="w-4 h-4 text-slate-300" />
                                    <input
                                        type="text"
                                        value={subTaskTitle}
                                        onChange={(e) => setSubTaskTitle(e.target.value)}
                                        placeholder="Add mission objective..."
                                        className="bg-transparent text-[13px] font-bold text-slate-600 outline-none w-full placeholder:text-slate-200"
                                    />
                                </form>

                            </div>
                        )}
                    </div>
                </td>

            </tr >
        </>
    );
};
