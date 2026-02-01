// frontend/src/utils/growthCalculator.ts

export const LEVEL_THRESHOLDS = [
    { level: 1, pointsRequired: 0, name: "Tiny Seed", emoji: "🌱" },
    { level: 2, pointsRequired: 20, name: "Sprouting", emoji: "🌱" },
    { level: 3, pointsRequired: 50, name: "Young Seedling", emoji: "🌿" },
    { level: 4, pointsRequired: 100, name: "Growing Sapling", emoji: "🌿" },
    { level: 5, pointsRequired: 200, name: "Small Tree", emoji: "🌳" },
    { level: 6, pointsRequired: 400, name: "Flourishing Tree", emoji: "🌳" },
    { level: 7, pointsRequired: 750, name: "Blooming Tree", emoji: "🌸" },
    { level: 8, pointsRequired: 1200, name: "Majestic Tree", emoji: "🌺" },
    { level: 9, pointsRequired: 2000, name: "Ancient Oak", emoji: "🦋" },
    { level: 10, pointsRequired: 3500, name: "Legendary Forest", emoji: "🏞️" },
    { level: 11, pointsRequired: 6000, name: "Mystical Grove", emoji: "✨" },
    { level: 12, pointsRequired: 10000, name: "Eternal Paradise", emoji: "🌟" },
];

export const calculateGrowthLevel = (totalPoints: number) => {
    let currentLevel = 1;
    let currentThreshold = LEVEL_THRESHOLDS[0];
    let nextThreshold = LEVEL_THRESHOLDS[1];

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (totalPoints >= LEVEL_THRESHOLDS[i].pointsRequired) {
            currentLevel = LEVEL_THRESHOLDS[i].level;
            currentThreshold = LEVEL_THRESHOLDS[i];
            nextThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
        } else {
            break;
        }
    }

    const pointsInCurrentLevel = totalPoints - currentThreshold.pointsRequired;
    const pointsNeededForNextLevel = nextThreshold.pointsRequired - currentThreshold.pointsRequired;
    const progressPercentage = pointsNeededForNextLevel > 0
        ? (pointsInCurrentLevel / pointsNeededForNextLevel) * 100
        : 100;

    return {
        currentLevel,
        levelName: currentThreshold.name,
        emoji: currentThreshold.emoji,
        pointsToNextLevel: Math.max(0, nextThreshold.pointsRequired - totalPoints),
        progressPercentage: Math.min(progressPercentage, 100),
        nextLevelName: nextThreshold.name,
    };
};

export const checkMilestoneUnlocked = (oldPoints: number, newPoints: number) => {
    const oldLevel = calculateGrowthLevel(oldPoints).currentLevel;
    const newLevel = calculateGrowthLevel(newPoints).currentLevel;

    if (newLevel > oldLevel) {
        const threshold = LEVEL_THRESHOLDS.find(t => t.level === newLevel);
        return {
            id: `milestone-${newLevel}-${Date.now()}`,
            level: newLevel,
            title: `${threshold?.emoji} ${threshold?.name} Achieved!`,
            description: `You've reached level ${newLevel} with ${newPoints} growth points! Keep growing! 🌟`,
            unlockedAt: new Date().toISOString(),
            celebrationShown: false,
        };
    }

    return null;
};
