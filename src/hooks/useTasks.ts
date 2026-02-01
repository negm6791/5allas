// frontend/src/hooks/useTasks.ts
import { useLocalStorage } from './useLocalStorage';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const useTasks = (viewDate?: string) => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('5allas_tasks', []);

    // Standardized date string
    const today = format(new Date(), 'yyyy-MM-dd');
    const activeDate = viewDate ? viewDate.split('T')[0] : today;

    const addTask = (title: string, isPersistent: boolean = false, priority: 'critical' | 'standard' | 'secondary' = 'standard') => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            completed: false,
            isPersistent,
            completions: [],
            createdAt: new Date().toISOString(),
            priority,
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const toggleTask = (id: string, toggleDate?: string) => {
        const targetDate = (toggleDate || activeDate).split('T')[0];

        setTasks(prev => prev.map(task => {
            if (task.id === id) {
                if (task.isPersistent) {
                    const completions = task.completions || [];
                    const isAlreadyCompleted = completions.includes(targetDate);
                    const newCompletions = isAlreadyCompleted
                        ? completions.filter(d => d !== targetDate)
                        : [...completions, targetDate];

                    return {
                        ...task,
                        completions: newCompletions,
                        completed: !isAlreadyCompleted
                    };
                } else {
                    const nowCompleted = !task.completed;
                    return {
                        ...task,
                        completed: nowCompleted,
                        completedAt: nowCompleted ? new Date().toISOString() : undefined
                    };
                }
            }
            return task;
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));
    };

    const addSubTask = (taskId: string, title: string, subTaskDate: string) => {
        const targetDate = subTaskDate.split('T')[0];
        const newSubTask = {
            id: uuidv4(),
            title,
            completed: false,
            date: targetDate,
        };

        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, subtasks: [...(task.subtasks || []), newSubTask] }
                : task
        ));
        return newSubTask;
    };

    const toggleSubTask = (taskId: string, subTaskId: string) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const subTaskToToggle = (task.subtasks || []).find(st => st.id === subTaskId);
                if (!subTaskToToggle) return task;

                const subTaskDate = subTaskToToggle.date;
                const updatedSubTasks = (task.subtasks || []).map(st => {
                    if (st.id === subTaskId) {
                        const nowCompleted = !st.completed;
                        return {
                            ...st,
                            completed: nowCompleted,
                            completedAt: nowCompleted ? activeDate : undefined
                        };
                    }
                    return st;
                });

                // Logic: If all sub-tasks for that specific day are done, mark the persistent task as completed for that day
                const daySubs = updatedSubTasks.filter(st => st.date === subTaskDate);
                const allDone = daySubs.length > 0 && daySubs.every(st => st.completed);

                let updatedCompletions = task.completions || [];
                if (task.isPersistent) {
                    if (allDone && !updatedCompletions.includes(subTaskDate)) {
                        updatedCompletions = [...updatedCompletions, subTaskDate];
                    } else if (!allDone && updatedCompletions.includes(subTaskDate)) {
                        updatedCompletions = updatedCompletions.filter(d => d !== subTaskDate);
                    }
                }

                return {
                    ...task,
                    subtasks: updatedSubTasks,
                    completions: updatedCompletions,
                    completed: task.isPersistent ? (subTaskDate === activeDate ? allDone : updatedCompletions.includes(activeDate)) : task.completed
                };
            }
            return task;
        }));
    };

    const deleteSubTask = (taskId: string, subTaskId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, subtasks: (task.subtasks || []).filter(st => st.id !== subTaskId) }
                : task
        ));
    };

    // Derived filtering & synchronization
    const filteredTasks = tasks
        .filter(t => {
            if (t.isPersistent) return true;

            const taskDate = t.createdAt.split('T')[0];
            const completedOnTarget = t.completedAt?.split('T')[0];

            // Show if:
            // 1. Created on or before target date AND NOT yet completed
            // 2. OR completed specifically on the target date
            return (taskDate <= activeDate && !t.completed) || completedOnTarget === activeDate;
        })
        .map(t => {
            // Live completion status for the current view
            if (t.isPersistent) {
                return {
                    ...t,
                    completed: t.completions?.includes(activeDate) || false
                };
            }
            return t;
        });

    return {
        tasks: filteredTasks,
        allTasks: tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
    };
};
