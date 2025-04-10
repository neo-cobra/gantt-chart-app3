import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Project from '../models/Project';
import User from '../models/User';

// @desc    Get all projects for logged in user (owned or member)
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  // Find projects where user is owner or member
  const projects = await Project.find({
    $or: [
      { owner: req.user?._id },
      { members: { $in: [req.user?._id] } }
    ]
  }).populate('owner', 'name email');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .populate('tasks');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or member of the project
  if (
    project.owner.toString() !== req.user?._id.toString() &&
    !project.members.some(member => member._id.toString() === req.user?._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  // Add user to request body as owner
  req.body.owner = req.user?._id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Make sure user is project owner
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Make sure user is project owner
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addProjectMember = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email');
  }

  // Find project
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is project owner
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add members to this project');
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is already a member
  if (project.members.includes(user._id)) {
    res.status(400);
    throw new Error('User is already a member of this project');
  }

  // Add user to members
  project.members.push(user._id);
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeProjectMember = asyncHandler(async (req: Request, res: Response) => {
  // Find project
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is project owner
  if (project.owner.toString() !== req.user?._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to remove members from this project');
  }

  // Remove user from members
  project.members = project.members.filter(
    member => member.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});