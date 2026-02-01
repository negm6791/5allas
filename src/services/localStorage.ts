// frontend/src/services/localStorage.ts
import { Task, Routine, GrowthProgress } from '../types';

const STORAGE_KEYS = {
    TASKS: '5allas_tasks',
    ROUTINES: '5allas_routines',
    GROWTH: '5allas_growth',
};

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    try {
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Tasks
export const getTasks = (): Task[] => getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
export const saveTasks = (tasks: Task[]) => saveToStorage(STORAGE_KEYS.TASKS, tasks);

// Routines
export const getRoutines = (): Routine[] => getFromStorage<Routine[]>(STORAGE_KEYS.ROUTINES, []);
export const saveRoutines = (routines: Routine[]) => saveToStorage(STORAGE_KEYS.ROUTINES, routines);

// Growth
export const getGrowth = (): GrowthProgress => getFromStorage<GrowthProgress>(STORAGE_KEYS.GROWTH, {
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 10,
    visualizationTheme: 'tree',
    milestones: [],
    lastUpdated: new Date().toISOString(),
    level: 1,
    currentXP: 0,
    nextLevelXP: 10,
    title: 'Beginner'
});
export const saveGrowth = (growth: GrowthProgress) => saveToStorage(STORAGE_KEYS.GROWTH, growth);
