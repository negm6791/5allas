// backend/src/controllers/task.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { date, projectId } = req.query;

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                ...(date && { dueDate: new Date(date as string) }),
                ...(projectId && { projectId: projectId as string })
            },
            include: {
                project: true
            },
            orderBy: { order: 'asc' }
        });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { title, dueDate, priority, projectId } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                priority: priority || 'MEDIUM',
                projectId,
                userId
            },
            include: {
                project: true
            }
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const updates = req.body;

        // Remove immutable fields if present
        delete updates.id;
        delete updates.userId;

        const task = await prisma.task.updateMany({
            where: { id, userId },
            data: updates
        });

        if (task.count === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await prisma.task.deleteMany({
            where: { id, userId }
        });

        if (task.count === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const reorderTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { tasks } = req.body; // Array of { id, order }

        await Promise.all(
            tasks.map((task: { id: string; order: number }) =>
                prisma.task.updateMany({
                    where: { id: task.id, userId },
                    data: { order: task.order }
                })
            )
        );

        res.json({ message: 'Tasks reordered' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
