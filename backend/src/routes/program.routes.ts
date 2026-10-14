import { Router } from 'express';
import {
  getMyPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  assignProgram,
  unassignProgram,
  getMyAssignedPrograms,
} from '../controllers/program.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);


// ===== برنامه‌های شاگرد (باید بالاتر از /:id باشه) =====
router.get('/assigned', getMyAssignedPrograms);


// ===== برنامه‌های مربی =====
router.get('/', getMyPrograms);
router.post('/', createProgram);
router.get('/:id', getProgramById);
router.put('/:id', updateProgram);
router.delete('/:id', deleteProgram);

// ===== اتصال به شاگرد =====
router.post('/:id/assign', assignProgram);
router.delete('/assignments/:assignmentId', unassignProgram);

export default router;