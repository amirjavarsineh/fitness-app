import { Router } from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder,
} from '../controllers/reminder.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.patch('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

export default router;