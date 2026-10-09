import { Router } from 'express';
import {
  getChallenges,
  createChallenge,
  updateChallenge,
  checkIn,
  cancelChallenge,
  reactivateChallenge,
  deleteChallenge,
} from '../controllers/challenge.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getChallenges);
router.post('/', createChallenge);
router.put('/:id', updateChallenge);
router.post('/:id/checkin', checkIn);
router.patch('/:id/cancel', cancelChallenge);
router.patch('/:id/reactivate', reactivateChallenge);
router.delete('/:id', deleteChallenge);

export default router;