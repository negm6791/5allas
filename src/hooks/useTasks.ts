// frontend/src/hooks/useTasks.ts
import { useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, SubTask } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const useTasks = (viewDate?: string) => {
    const [allStoredTasks, setAllStoredTasks] = useLocalStorage<Task[]>('5allas_tasks', []);

    // Standardized date string
    const today = format(new Date(), 'yyyy-MM-dd');
    const activeDate = viewDate ? viewDate.split('T')[0] : today;

    // --- Data Migration & Normalization ---
    // Ensure old tasks have the 'date' field and are correctly identified
    useEffect(() => {
        const needsStateMigration = allStoredTasks.some(t => !t.date);
        if (needsStateMigration) {
            setAllStoredTasks(prev => prev.map(t => {
                if (!t.date) {
                    return {
                        ...t,
                        date: t.createdAt.split('T')[0],
                        // Ensure it's not showing up as completed on future days unintentionally
                        // If it has completions from the old system, we should ideally convert them
                        // but for now, just giving it a date is the priority.
                    };
                }
                return t;
            }));
        }
    }, [allStoredTasks]);

    const addTask = (title: string, isPersistent: boolean = false, priority: 'critical' | 'standard' | 'secondary' = 'standard') => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            completed: false,
            isPersistent,
            date: activeDate, // Explicit day
            createdAt: new Date().toISOString(),
            priority,
            subtasks: []
        };
        setAllStoredTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const toggleTask = (id: string) => {
        setAllStoredTasks(prev => {
            const taskToToggle = prev.find(t => t.id === id);
            if (!taskToToggle) return prev;

            const nowCompleted = !taskToToggle.completed;
            const updatedTasks = prev.map(t => {
                if (t.id === id) {
                    return {
                        ...t,
                        completed: nowCompleted,
                        completedAt: nowCompleted ? new Date().toISOString() : undefined
                    };
                }
                return t;
            });

            // Future Cleanup: If marked as completed in the past, delete future clones
            if (nowCompleted) {
                const originalId = taskToToggle.originalTaskId || taskToToggle.id;
                return updatedTasks.filter(t => {
                    // Keep if it's NOT a future clone of this task
                    const isClone = t.originalTaskId === originalId || t.id === originalId;
                    const isFuture = t.date > activeDate;
                    return !(isClone && isFuture);
                });
            }

            return updatedTasks;
        });
    };

    const deleteTask = (id: string) => {
        setAllStoredTasks(prev => prev.filter(task => task.id !== id));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setAllStoredTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));
    };

    // Subtasks also need to be independent per instance
    const addSubTask = (taskId: string, title: string) => {
        const newSubTask: SubTask = {
            id: uuidv4(),
            title,
            completed: false,
            date: activeDate,
        };

        setAllStoredTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, subtasks: [...(task.subtasks || []), newSubTask] }
                : task
        ));
        return newSubTask;
    };

    const toggleSubTask = (taskId: string, subTaskId: string) => {
        setAllStoredTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const updatedSubTasks = (task.subtasks || []).map(st =>
                    st.id === subTaskId
                        ? { ...st, completed: !st.completed, completedAt: !st.completed ? new Date().toISOString() : undefined }
                        : st
                );

                // Auto-toggle parent task only for routine tasks with subtasks
                let shouldBeCompleted = task.completed;
                if (task.isPersistent && updatedSubTasks.length > 0) {
                    const allDone = updatedSubTasks.every(st => st.completed);
                    shouldBeCompleted = allDone;
                }

                return {
                    ...task,
                    completed: shouldBeCompleted,
                    completedAt: shouldBeCompleted && !task.completed ? new Date().toISOString() : (shouldBeCompleted ? task.completedAt : undefined),
                    subtasks: updatedSubTasks
                };
            }
            return task;
        }));
    };

    const deleteSubTask = (taskId: string, subTaskId: string) => {
        setAllStoredTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, subtasks: (task.subtasks || []).filter(st => st.id !== subTaskId) }
                : task
        ));
    };

    // --- Computation: Visible Tasks on activeDate ---
    const tasksForActiveDate = useMemo(() => {
        return allStoredTasks.filter(t => t.date === activeDate);
    }, [allStoredTasks, activeDate]);

    // --- Carry Over Logic ---
    useEffect(() => {
        // Find tasks from the past that were incomplete and aren't present today
        const missingCarryOvers = allStoredTasks.filter(t => {
            if (t.date >= activeDate) return false; // Only consider tasks from before activeDate
            if (t.completed) return false; // Only carry over incomplete tasks

            const originalId = t.originalTaskId || t.id;

            // Is there already an instance (or original) on activeDate?
            const hasInstanceToday = allStoredTasks.some(other =>
                (other.originalTaskId === originalId || other.id === originalId) && other.date === activeDate
            );
            if (hasInstanceToday) return false;

            // Is this the most recent instance before activeDate?
            const isMostRecentBefore = !allStoredTasks.some(other =>
                (other.originalTaskId === originalId || other.id === originalId) &&
                other.date > t.date &&
                other.date < activeDate
            );

            return isMostRecentBefore;
        });

        if (missingCarryOvers.length > 0) {
            const newClones: Task[] = missingCarryOvers.map(t => ({
                ...t,
                id: uuidv4(),
                date: activeDate,
                originalTaskId: t.originalTaskId || t.id,
                completed: false,
                completedAt: undefined,
                subtasks: (t.subtasks || []).map(st => ({
                    ...st,
                    id: uuidv4(),
                    date: activeDate,
                    originalSubTaskId: st.originalSubTaskId || st.id,
                    completed: false,
                    completedAt: undefined
                }))
            }));
            setAllStoredTasks(prev => [...prev, ...newClones]);
        }
    }, [allStoredTasks, activeDate]);

    return {
        tasks: tasksForActiveDate,
        allTasks: allStoredTasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
    };
};
