// frontend/src/hooks/useTasks.ts
import { useLocalStorage } from './useLocalStorage';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const useTasks = (viewDate?: string) => {
    const [allStoredTasks, setAllStoredTasks] = useLocalStorage<Task[]>('5allas_tasks_v2', []);

    // Standardized date string
    const today = format(new Date(), 'yyyy-MM-dd');
    const activeDate = viewDate ? viewDate.split('T')[0] : today;

    // --- Core Logic: Task Cloning & Carry-Over ---

    // We want to ensure that for EVERY day up to activeDate, 
    // all incomplete tasks have been "born" or "carried" into it.
    // However, for performance, we only "solidify" the carry-over when needed.

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

            // --- Future Cleanup Logic ---
            // If we just marked a task as COMPLETED in the past, 
            // delete all future clones of this task.
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
                return {
                    ...task,
                    subtasks: (task.subtasks || []).map(st =>
                        st.id === subTaskId
                            ? { ...st, completed: !st.completed, completedAt: !st.completed ? new Date().toISOString() : undefined }
                            : st
                    )
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

    // --- Computation: Which tasks should I see on activeDate? ---

    // 1. Get all tasks explicitly born on activeDate
    const explicitlyBorn = allStoredTasks.filter(t => t.date === activeDate);

    // 2. Identify missing carry-overs
    // These are tasks born before activeDate that were NOT completed on their day 
    // AND don't have a record for activeDate yet.
    const potentialCarryOvers = allStoredTasks.filter(t => {
        if (t.date >= activeDate) return false;

        // Is there already an instance for this original task on activeDate?
        const originalId = t.originalTaskId || t.id;
        const alreadyHasInstance = allStoredTasks.some(other => (other.originalTaskId === originalId || other.id === originalId) && other.date === activeDate);
        if (alreadyHasInstance) return false;

        // Is this the "latest" instance before activeDate?
        const isLatestBefore = !allStoredTasks.some(other =>
            (other.originalTaskId === originalId || other.id === originalId) &&
            other.date > t.date &&
            other.date < activeDate
        );

        return isLatestBefore && !t.completed;
    });

    // --- Side Effect: Materialize Carry Overs ---
    // If we have potentialCarryOvers, we should save them to localStorage so they are "independent"
    useEffect(() => {
        if (potentialCarryOvers.length > 0) {
            const newClones: Task[] = potentialCarryOvers.map(t => ({
                ...t,
                id: uuidv4(),
                date: activeDate,
                originalTaskId: t.originalTaskId || t.id,
                completed: false,
                completedAt: undefined,
                // Clone subtasks too
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
    }, [potentialCarryOvers.length, activeDate]);

    return {
        tasks: explicitlyBorn,
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
