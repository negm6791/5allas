export type EnergyTag = 'low' | 'medium' | 'high';
export type Priority = 1 | 2 | 3 | 4;

export interface Project {
    id: string;
    title: string;
    description?: string;
    color?: string;
    order: number;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    notes?: string;
    priority: Priority;
    energyTag: EnergyTag;
    tags: string[];
    projectId?: string;
    completed: boolean;
    completedAt?: string;
    isToday: boolean;
    createdAt: string;
}
