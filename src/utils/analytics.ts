// frontend/src/utils/analytics.ts
import { Task, DailyStats } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

export const calculateDailyStats = (
    tasks: Task[],
    days: number = 30
): DailyStats[] => {
    const stats: DailyStats[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

        // Total tasks specifically assigned to this day
        const activeTasks = tasks.filter(task => task.date === dateStr);

        // Count tasks completed on this day
        const tasksCompletedCount = activeTasks.filter(task => task.completed).length;

        const totalTasks = activeTasks.length;

        stats.push({
            date: dateStr,
            tasksCompleted: tasksCompletedCount,
            totalTasks,
            completionRate: totalTasks > 0 ? Math.round((tasksCompletedCount / totalTasks) * 100) : 0,
        });
    }

    return stats;
};

export const calculateCompletionRate = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const activeToday = tasks.filter(task => task.date === todayStr);

    if (activeToday.length === 0) return 0;

    const completedToday = activeToday.filter(task => task.completed).length;

    return Math.round((completedToday / activeToday.length) * 100);
};

export const calculateStreak = (tasks: Task[]): { current: number; longest: number } => {
    const dailyCompletionMap: Record<string, boolean> = {};

    tasks.forEach(task => {
        if (task.completed) {
            dailyCompletionMap[task.date] = true;
        }
    });

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Check back for 365 days
    for (let i = 0; i < 365; i++) {
        const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (dailyCompletionMap[d]) {
            tempStreak++;
        } else {
            if (i === 0) continue; // Today doesn't break it yet
            longest = Math.max(longest, tempStreak);
            tempStreak = 0;
            break;
        }
    }

    // Recalculate current streak correctly
    current = 0;
    for (let i = 0; i < 365; i++) {
        const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (dailyCompletionMap[d]) {
            current++;
        } else {
            if (i === 0) continue;
            break;
        }
    }

    return { current, longest: Math.max(longest, current) };
};
