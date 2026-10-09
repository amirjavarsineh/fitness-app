import { Router } from 'express';
import { getWeeklyReport } from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/weekly', getWeeklyReport);

export default router;