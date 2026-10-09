import { Router } from 'express';
import { getXpProfile, getXpSummary } from '../controllers/xp.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getXpProfile);
router.get('/summary', getXpSummary);

export default router;