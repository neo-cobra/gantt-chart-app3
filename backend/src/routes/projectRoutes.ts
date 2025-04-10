import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/members')
  .post(addProjectMember);

router.route('/:id/members/:userId')
  .delete(removeProjectMember);

export default router;