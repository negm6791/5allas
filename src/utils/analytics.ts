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
            if (task.isPersistent) {
                const createdDate = startOfDay(parseISO(task.createdAt));
                return createdDate <= startOfDay(date);
            }
            // For non-persistent tasks, they only count on the day they were created or completed
            return task.createdAt.startsWith(dateStr) || (task.completedAt && task.completedAt.startsWith(dateStr));
        });

        // Count tasks completed on this day
        const tasksCompleted = activeTasks.filter(task => {
            if (task.isPersistent && task.completions) {
                return task.completions.some(d => d === dateStr);
            }
            return task.completedAt && task.completedAt.startsWith(dateStr);
        }).length;

        const totalTasks = activeTasks.length;

        stats.push({
            date: dateStr,
            tasksCompleted,
            totalTasks,
            completionRate: totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0,
        });
    }

    return stats;
};

export const calculateCompletionRate = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;
    const today = format(new Date(), 'yyyy-MM-dd');

    const activeToday = tasks.filter(t => {
        if (t.isPersistent) return true;
        return t.createdAt.startsWith(today) || (t.completedAt && t.completedAt.startsWith(today));
    });

    if (activeToday.length === 0) return 0;

    const completed = activeToday.filter(t => {
        if (t.isPersistent) return t.completions?.includes(today);
        return t.completed;
    }).length;

    return Math.round((completed / activeToday.length) * 100);
};

export const calculateStreak = (tasks: Task[]): { current: number; longest: number } => {
    const completionsMap: { [key: string]: boolean } = {};

    tasks.forEach(task => {
        if (task.isPersistent && task.completions) {
            task.completions.forEach(d => completionsMap[d] = true);
        } else if (task.completedAt) {
            completionsMap[format(parseISO(task.completedAt), 'yyyy-MM-dd')] = true;
        }
    });

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Check back for 365 days
    for (let i = 0; i < 365; i++) {
        const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (completionsMap[d]) {
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
        if (completionsMap[d]) {
            current++;
        } else {
            if (i === 0) continue;
            break;
        }
    }

    return { current, longest: Math.max(longest, current) };
};
