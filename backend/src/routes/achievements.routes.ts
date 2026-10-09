import { Router } from 'express';
import { getAchievements } from '../controllers/achievements.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getAchievements);

export default router;