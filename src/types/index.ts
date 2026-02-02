// frontend/src/types/index.ts

export type VisualizationTheme = 'tree' | 'island' | 'garden' | 'city';

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
    date: string; // YYYY-MM-DD
    completedAt?: string; // ISO string
    originalSubTaskId?: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    isPersistent?: boolean;
    date: string; // YYYY-MM-DD
    originalTaskId?: string;
    subtasks?: SubTask[];
    createdAt: string;
    completedAt?: string;
    priority?: 'critical' | 'standard' | 'secondary';
    growthPoints?: number;
}

export interface Sticker {
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string;
    color?: string;
    stickers?: Sticker[];
}

export interface Routine {
    id: string;
    title: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    streak: number;
    lastCompleted?: string;
    startDate: string;
    completions: { id: string; completedAt: string }[];
    totalCompletions: number;
    growthPoints: number;
    isActive: boolean;
    createdAt: string;
}

export interface GrowthMilestone {
    id: string;
    title: string;
    description: string;
    level: number;
    celebrationShown?: boolean;
}

export interface GrowthProgress {
    level: number;
    currentLevel?: number; // legacy/storage support
    currentXP: number;
    nextLevelXP: number;
    pointsToNextLevel?: number; // legacy/storage support
    title: string;
    totalPoints: number;
    visualizationTheme?: string;
    milestones?: GrowthMilestone[];
    lastUpdated?: string;
}

export interface DailyStats {
    date: string;
    tasksCompleted: number;
    totalTasks: number;
    completionRate: number;
}

export interface AnalyticsData {
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    last30Days: DailyStats[]; // Monthly view
    totalTasksCompleted: number;
}
