import express from 'express';
import {
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskProgress,
  assignUserToTask,
  unassignUserFromTask
} from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .post(createTask);

router.route('/project/:projectId')
  .get(getTasksByProject);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/progress')
  .patch(updateTaskProgress);

router.route('/:id/assign')
  .post(assignUserToTask);

router.route('/:id/assign/:userId')
  .delete(unassignUserFromTask);

export default router;