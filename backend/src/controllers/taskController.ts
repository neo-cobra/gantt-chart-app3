import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasksByProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to access tasks for this project');
  }

  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .populate('dependencies', 'name startDate endDate');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('dependencies', 'name startDate endDate');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { project: projectId } = req.body;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to create tasks for this project');
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Only project owner can delete tasks
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update task progress
// @route   PATCH /api/tasks/:id/progress
// @access  Private
export const updateTaskProgress = asyncHandler(async (req: Request, res: Response) => {
  const { progress } = req.body;
  
  if (progress === undefined || progress < 0 || progress > 100) {
    res.status(400);
    throw new Error('Progress must be a number between 0 and 100');
  }

  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Update only the progress field
  task = await Task.findByIdAndUpdate(
    req.params.id,
    { progress },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Assign user to task
// @route   POST /api/tasks/:id/assign
// @access  Private
export const assignUserToTask = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('Please provide a user ID');
  }

  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user exists
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Only project owner can assign users to tasks
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to assign users to this task');
  }

  // Check if user is a member of the project
  if (
    project.owner.toString() !== userId &&
    !project.members.some(member => member.toString() === userId)
  ) {
    res.status(400);
    throw new Error('User must be a member of the project to be assigned to a task');
  }

  // Check if user is already assigned to the task
  if (task.assignedTo.some(id => id.toString() === userId)) {
    res.status(400);
    throw new Error('User is already assigned to this task');
  }

  // Add user to assignedTo
  task.assignedTo.push(userId);
  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Unassign user from task
// @route   DELETE /api/tasks/:id/assign/:userId
// @access  Private
export const unassignUserFromTask = asyncHandler(async (req: Request, res: Response) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access to the associated project
  const project = await Project.findById(task.project);
  
  if (!project) {
    res.status(404);
    throw new Error('Associated project not found');
  }

  // Only project owner can unassign users from tasks
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to unassign users from this task');
  }

  // Remove user from assignedTo
  task.assignedTo = task.assignedTo.filter(
    id => id.toString() !== req.params.userId
  );
  
  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});