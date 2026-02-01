// frontend/src/hooks/useGrowthProgress.ts
import { useLocalStorage } from './useLocalStorage';
import { GrowthProgress, VisualizationTheme } from '../types';
import { calculateGrowthLevel, checkMilestoneUnlocked } from '../utils/growthCalculator';

export const useGrowthProgress = () => {
    const [progress, setProgress] = useLocalStorage<GrowthProgress>('5allas_growth', {
        totalPoints: 0,
        currentLevel: 1,
        pointsToNextLevel: 20,
        visualizationTheme: 'tree',
        milestones: [],
        lastUpdated: new Date().toISOString(),
        level: 1,
        currentXP: 0,
        nextLevelXP: 10,
        title: 'Beginner'
    });

    const addGrowthPoints = (points: number): boolean => {
        if (points <= 0) return false;

        const newTotalPoints = progress.totalPoints + points;
        const milestone = checkMilestoneUnlocked(progress.totalPoints, newTotalPoints);
        const levelInfo = calculateGrowthLevel(newTotalPoints);

        setProgress({
            ...progress,
            totalPoints: newTotalPoints,
            currentLevel: levelInfo.currentLevel,
            pointsToNextLevel: levelInfo.pointsToNextLevel,
            milestones: milestone ? [...(progress.milestones || []), milestone] : (progress.milestones || []),
            lastUpdated: new Date().toISOString(),
        });

        return milestone !== null;
    };

    const setVisualizationTheme = (theme: VisualizationTheme) => {
        setProgress({ ...progress, visualizationTheme: theme });
    };

    const markMilestoneShown = (milestoneId: string) => {
        setProgress({
            ...progress,
            milestones: (progress.milestones || []).map(m =>
                m.id === milestoneId ? { ...m, celebrationShown: true } : m
            ),
        });
    };

    return {
        progress,
        addGrowthPoints,
        setVisualizationTheme,
        markMilestoneShown,
        levelInfo: calculateGrowthLevel(progress.totalPoints),
    };
};
