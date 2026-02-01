// backend/src/controllers/project.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const projects = await prisma.project.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        });
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { name, color } = req.body;

        const project = await prisma.project.create({
            data: {
                name,
                color: color || '#3b82f6',
                userId
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const project = await prisma.project.deleteMany({
            where: { id, userId }
        });

        if (project.count === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
