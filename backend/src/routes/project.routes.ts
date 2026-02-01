// backend/src/routes/project.routes.ts
import { Router } from 'express';
import {
    getProjects,
    createProject,
    deleteProject
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProject);
router.delete('/:id', deleteProject);

export default router;
