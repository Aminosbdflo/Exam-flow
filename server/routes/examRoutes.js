import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getExams, startExam, submitExam, createExam, updateExam, deleteExam } from '../controllers/examController.js';

const router = express.Router();

router.route('/')
  .get(getExams)
  .post(protect, admin, createExam);

router.route('/:id')
  .put(protect, admin, updateExam)
  .delete(protect, admin, deleteExam);

router.post('/:id/start', protect, startExam);
router.post('/:id/submit', protect, submitExam);

export default router;
