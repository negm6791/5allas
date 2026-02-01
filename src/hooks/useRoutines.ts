// frontend/src/hooks/useRoutines.ts
import { useLocalStorage } from './useLocalStorage';
import { Routine } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay, isSameDay, differenceInDays } from 'date-fns';

export const useRoutines = () => {
    const [routines, setRoutines] = useLocalStorage<Routine[]>('5allas_routines', []);

    const addRoutine = (
        title: string,
        frequency: Routine['frequency'],
        growthPoints: number = 2
    ) => {
        const newRoutine: Routine = {
            id: uuidv4(),
            title,
            frequency,
            startDate: new Date().toISOString(),
            completions: [],
            streak: 0,
            totalCompletions: 0,
            growthPoints,
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        setRoutines([...routines, newRoutine]);
        return newRoutine;
    };

    const completeRoutine = (id: string) => {
        const routine = routines.find(r => r.id === id);
        if (!routine) return { points: 0, success: false };

        const today = startOfDay(new Date());
        const alreadyCompletedToday = routine.completions.some(comp =>
            isSameDay(new Date(comp.completedAt), today)
        );

        if (alreadyCompletedToday) return { points: 0, success: false };

        const newCompletion = { id: uuidv4(), completedAt: new Date().toISOString() };
        const newCompletions = [...routine.completions, newCompletion];
        const newStreak = calculateStreak(newCompletions);

        setRoutines(routines.map(r =>
            r.id === id
                ? {
                    ...r,
                    completions: newCompletions,
                    totalCompletions: r.totalCompletions + 1,
                    streak: newStreak,
                }
                : r
        ));

        return { points: routine.growthPoints, success: true };
    };

    const deleteRoutine = (id: string) => {
        setRoutines(routines.filter(r => r.id !== id));
    };

    return {
        routines,
        addRoutine,
        completeRoutine,
        deleteRoutine,
    };
};

const calculateStreak = (completions: { completedAt: string }[]): number => {
    if (completions.length === 0) return 0;

    const sortedDates = completions
        .map(d => startOfDay(new Date(d.completedAt)))
        .sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    let currentDate = sortedDates[0];

    // Check if the most recent completion was today or yesterday
    const today = startOfDay(new Date());
    const daysFromToday = differenceInDays(today, currentDate);

    if (daysFromToday > 1) return 0; // Streak broken

    for (let i = 1; i < sortedDates.length; i++) {
        const daysDiff = differenceInDays(currentDate, sortedDates[i]);

        if (daysDiff === 1) {
            streak++;
            currentDate = sortedDates[i];
        } else if (daysDiff === 0) {
            continue; // Skip same day completions
        } else {
            break;
        }
    }

    return streak;
};
