import { Router } from 'express';
import { getProfile, upsertProfile } from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', upsertProfile);

export default router;
