// backend/src/routes/task.routes.ts
import { Router } from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/reorder', reorderTasks);

export default router;
