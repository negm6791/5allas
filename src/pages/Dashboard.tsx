// frontend/src/pages/Dashboard.tsx
import { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { TaskItemMinimal } from '../components/tasks/TaskItemMinimal';
import { ActivityChart } from '../components/Dashboard/ActivityChart';
import { Heatmap } from '../components/Dashboard/Heatmap';
import {
    Plus,
    Search,
    Shield,
    Clock as ClockIcon,
    AlertCircle,
    TrendingUp,
    Flame,
    Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { DailyNotes } from '../components/notes/DailyNotes';


export const Dashboard = () => {
    const todayDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const activeViewDate = selectedDate || todayDate;
    const { tasks: displayTasks, allTasks } = useTasks(activeViewDate);
    const analytics = useAnalytics(allTasks);

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [holidays, setHolidays] = useState<string[]>(() => {
        const saved = localStorage.getItem('antigravity_holidays');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleHoliday = (date: string) => {
        const newHolidays = holidays.includes(date)
            ? holidays.filter(d => d !== date)
            : [...holidays, date];
        setHolidays(newHolidays);
        localStorage.setItem('antigravity_holidays', JSON.stringify(newHolidays));
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 5) return "Quiet Hours";
        if (hour < 12) return "Morning Dashboard";
        if (hour < 17) return "Active Operations";
        if (hour < 21) return "Evening Review";
        return "System Maintenance";
    };

    const filteredTasks = useMemo(() => (displayTasks || []).filter(t => {
        const title = t?.title || '';
        const search = searchQuery || '';
        return title.toLowerCase().includes(search.toLowerCase());
    }), [displayTasks, searchQuery]);

    const todayStats = useMemo(() => {
        const total = displayTasks.length;
        const completed = displayTasks.filter(t => {
            if (t.isPersistent) return t.completions?.includes(activeViewDate);
            return t.completed;
        }).length;
        return { completed, total };
    }, [displayTasks, activeViewDate]);

    const criticalCount = useMemo(() =>
        displayTasks.filter(t => t.priority === 'critical' && !t.completed).length,
        [displayTasks]);

    const isMemoryMode = selectedDate && selectedDate !== todayDate;

    // Aggregate tasks by date for the heatmap
    const heatmapData = useMemo(() => {
        const dailyGroups: Record<string, { total: number; completed: number }> = {};

        // With independent instances, we just group by the task's date field
        allTasks.forEach(t => {
            const ds = t.date;
            if (!dailyGroups[ds]) dailyGroups[ds] = { total: 0, completed: 0 };

            dailyGroups[ds].total += 1;
            if (t.completed) {
                dailyGroups[ds].completed += 1;
            }
        });

        return Object.entries(dailyGroups).map(([date, stats]) => ({
            date,
            completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
            count: stats.completed
        }));
    }, [allTasks]);

    const handleEditTask = (task: any) => {
        setTaskToEdit(task);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setTaskToEdit(null);
    };

    return (
        <div className="bg-[#F8FAFC] text-indigo-950 font-sans selection:bg-indigo-100 pb-8 overflow-x-hidden">

            <div className="max-w-7xl mx-auto px-4 pt-4 relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-indigo-950 tracking-tight leading-none">
                            5allas<span className="text-slate-400">OS</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <ClockIcon className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{format(currentTime, 'HH:mm')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Daily Streak */}
                        <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20 group hover:scale-[1.02] transition-all cursor-default">
                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <Flame className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div className="leading-tight">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Daily Streak</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">{analytics.currentStreak}</span>
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Days</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-slate-200 hidden xl:block" />

                        <div className="flex flex-col items-end gap-2">
                            {criticalCount > 0 && !isMemoryMode && (
                                <div className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-500" />
                                    <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider">{criticalCount} Critical</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${isMemoryMode ? 'bg-indigo-500 shadow-indigo-500' : 'bg-green-500 shadow-green-500'}`} />
                                <span className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider">{isMemoryMode ? 'Memory Recall' : 'Online'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

                    {/* TASKS (1/3) */}
                    <div className={`lg:col-span-1 bg-white rounded-2xl border shadow-sm flex flex-col p-4 relative overflow-hidden transition-all ${isMemoryMode ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-1" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isMemoryMode ? 'text-indigo-500' : 'text-slate-400'}`}>
                                    {isMemoryMode ? `Memory Log: ${selectedDate}` : 'My Tasks'}
                                </h2>
                                <p className="text-2xl font-black text-indigo-950 tracking-tight">
                                    {isMemoryMode ? 'Completed' : 'Total'} <span className="text-slate-400 text-lg ml-2">{filteredTasks.length}</span>
                                </p>
                            </div>
                            {!isMemoryMode && (
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-indigo-900 hover:bg-indigo-950 text-white p-4 rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-xl shadow-slate-200 group"
                                >
                                    <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            )}
                        </div>

                        {!isMemoryMode && (
                            <div className="relative mb-6 z-10">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-700 outline-none w-full focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        )}

                        <div className="flex-1 overflow-visible z-10">
                            <table className="w-full">
                                <tbody>
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task: Task) => (
                                            <TaskItemMinimal
                                                key={task.id}
                                                task={task}
                                                viewDate={selectedDate || todayDate}
                                                onEdit={handleEditTask}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-12 text-center">
                                                <Shield className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                                    {isMemoryMode ? 'No memories found' : 'No tasks'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ANALYTICS (2/3) */}
                    <div className="lg:col-span-2 h-full bg-[#F8FAFC] rounded-2xl border border-slate-200/60 shadow-sm p-4 flex flex-col relative overflow-hidden group">

                        {/* Analytic Header */}
                        <div className="flex items-center justify-between mb-8 relative z-10 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-700">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-indigo-950 tracking-tight">Overview</h3>
                                </div>
                            </div>

                            <div className="px-3 py-1 bg-indigo-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                {getGreeting()}
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rate</p>
                                    <span className="text-3xl font-black text-indigo-950 tracking-tight leading-none">{analytics.completionRate}%</span>
                                </div>
                                <div className="h-8 w-px bg-slate-200" />
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Done</p>
                                    <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                                        {todayStats.completed}<span className="text-slate-200 mx-1 text-xl">/</span>{todayStats.total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200/50 shadow-lg p-6 relative group/curve overflow-hidden flex flex-col">
                            <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 z-10">
                                <Activity className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">30 Days</span>
                            </div>

                            <div className="flex-1 w-full min-h-[400px] relative">
                                <div className="absolute inset-0 pb-2">
                                    <ActivityChart data={analytics.last30Days} />
                                </div>
                            </div>

                            {/* Chart Footer Metrics */}
                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 px-2 z-10 bg-white">
                                <div className="flex-1 flex flex-col items-start gap-1">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Reliability</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight capitalize">
                                        {analytics.completionRate >= 90 ? 'Excellent' : (analytics.completionRate >= 70 ? 'Good' : 'Standard')}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-slate-100" />
                                <div className="flex-1 px-4 flex flex-col items-center gap-1">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Best Streak</p>
                                    <p className="text-xl font-black text-rose-500 tracking-tight">
                                        {analytics.longestStreak}<span className="text-[10px] ml-1 text-slate-300 font-bold uppercase">Days</span>
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-slate-100" />
                                <div className="flex-1 flex flex-col items-end gap-1">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                        <p className="text-xl font-black text-indigo-950 tracking-tight uppercase font-mono italic">Good</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Daily Notes Section (Middle) */}
                <DailyNotes date={selectedDate || todayDate} />

                {/* Yearly Matrix */}
                <div className="mt-4">
                    <Heatmap
                        data={heatmapData}
                        holidays={holidays}
                        onToggleHoliday={toggleHoliday}
                        onDateSelect={setSelectedDate}
                        selectedDate={selectedDate}
                    />
                </div>
            </div>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                taskToEdit={taskToEdit}
            />
        </div >
    );
};
