// frontend/src/hooks/useAnalytics.ts
import { useMemo } from 'react';
import { Task, AnalyticsData } from '../types';
import { calculateDailyStats, calculateCompletionRate, calculateStreak } from '../utils/analytics';

export const useAnalytics = (tasks: Task[]): AnalyticsData => {
    return useMemo(() => {
        const last30Days = calculateDailyStats(tasks, 30);
        const { current, longest } = calculateStreak(tasks);

        return {
            completionRate: calculateCompletionRate(tasks),
            currentStreak: current,
            longestStreak: longest,
            last30Days,
            totalTasksCompleted: tasks.filter(t => t.completed || (t.isPersistent && (t.completions?.length || 0) > 0)).length,
        };
    }, [tasks]);
};
