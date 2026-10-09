import { Router } from 'express';
import {
  getWorkouts,
  getTemplates,
  useTemplate,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workout.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// ⚠️ مهم: این دو تا باید قبل از /:id بیان
// وگرنه Express مسیر /templates رو مثل یه id در نظر می‌گیره
router.get('/templates', getTemplates);
router.post('/templates/:id/use', useTemplate);

router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;