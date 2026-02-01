// backend/src/routes/routine.routes.ts
import { Router } from 'express';
import {
    getRoutines,
    createRoutine,
    completeRoutine,
    getCompletionStats
} from '../controllers/routine.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getRoutines);
router.post('/', createRoutine);
router.post('/:id/complete', completeRoutine);
router.get('/stats', getCompletionStats);

export default router;
