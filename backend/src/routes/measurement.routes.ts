import { Router } from 'express';
import {
  getMeasurements,
  upsertMeasurement,
  deleteMeasurement,
  getMeasurementStats,
} from '../controllers/measurement.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getMeasurements);
router.get('/stats', getMeasurementStats);
router.post('/', upsertMeasurement);
router.delete('/:id', deleteMeasurement);

export default router;