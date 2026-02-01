// backend/src/controllers/routine.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export const getRoutines = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const routines = await prisma.routine.findMany({
            where: { userId, isActive: true },
            include: {
                completions: {
                    orderBy: { completedAt: 'desc' }
                }
            }
        });

        res.json(routines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createRoutine = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { title, frequency, startDate } = req.body;

        const routine = await prisma.routine.create({
            data: {
                title,
                frequency,
                startDate: startDate ? new Date(startDate) : new Date(),
                userId
            },
            include: {
                completions: true
            }
        });

        res.status(201).json(routine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const completeRoutine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify routine belongs to user
        const routine = await prisma.routine.findFirst({
            where: { id, userId }
        });

        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        // Create completion
        const completion = await prisma.completion.create({
            data: {
                routineId: id,
                completedAt: new Date()
            }
        });

        res.json(completion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCompletionStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { days = 30 } = req.query;

        const routines = await prisma.routine.findMany({
            where: { userId },
            include: {
                completions: {
                    where: {
                        completedAt: {
                            gte: new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000)
                        }
                    }
                }
            }
        });

        // Group completions by date
        const stats = new Map<string, number>();
        routines.forEach(routine => {
            routine.completions.forEach(completion => {
                const dateKey = startOfDay(completion.completedAt).toISOString();
                stats.set(dateKey, (stats.get(dateKey) || 0) + 1);
            });
        });

        const result = Array.from(stats.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
