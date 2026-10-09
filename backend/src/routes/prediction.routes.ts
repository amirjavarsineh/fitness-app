import { Router } from 'express';
import { getPredictions } from '../controllers/prediction.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPredictions);

export default router;