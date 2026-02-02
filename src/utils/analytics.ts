// frontend/src/utils/analytics.ts
import { Task, DailyStats } from '../types';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

export const calculateDailyStats = (
    tasks: Task[],
    days: number = 30
): DailyStats[] => {
    const stats: DailyStats[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

        // Total tasks available on this day
        const activeTasks = tasks.filter(task => {
            const createdDateStr = task.createdAt.split('T')[0];

            // Task must be created on or before this day
            if (createdDateStr > dateStr) return false;

            if (task.isPersistent) return true;

            // For non-persistent tasks:
            // Include if NOT completed OR completed ON or AFTER this day
            if (!task.completed) return true;

            const completedDateStr = task.completedAt?.split('T')[0];
            return completedDateStr && completedDateStr >= dateStr;
        });

        // Count tasks completed on this day
        const tasksCompletedCount = activeTasks.filter(task => {
            if (task.isPersistent && task.completions) {
                return task.completions.some(d => d === dateStr);
            }
            const completedDateStr = task.completedAt?.split('T')[0];
            return task.completed && completedDateStr === dateStr;
        }).length;

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

    const activeToday = tasks.filter(task => {
        const createdDateStr = task.createdAt.split('T')[0];
        if (createdDateStr > todayStr) return false;

        if (task.isPersistent) return true;

        if (!task.completed) return true;
        const completedDateStr = task.completedAt?.split('T')[0];
        return completedDateStr && completedDateStr >= todayStr;
    });

    if (activeToday.length === 0) return 0;

    const completedToday = activeToday.filter(task => {
        if (task.isPersistent) return task.completions?.includes(todayStr);
        const completedDateStr = task.completedAt?.split('T')[0];
        return task.completed && completedDateStr === todayStr;
    }).length;

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
