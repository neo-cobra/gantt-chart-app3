import api from './api';

// Project API calls
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getProject = async (id: string) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createProject = async (projectData: any) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProject = async (id: string, projectData: any) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteProject = async (id: string) => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const addProjectMember = async (projectId: string, email: string) => {
  try {
    const response = await api.post(`/projects/${projectId}/members`, { email });
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  try {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Task API calls
export const getTasksByProject = async (projectId: string) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getTask = async (id: string) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createTask = async (taskData: any) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateTask = async (id: string, taskData: any) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteTask = async (id: string) => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const updateTaskProgress = async (id: string, progress: number) => {
  try {
    const response = await api.patch(`/tasks/${id}/progress`, { progress });
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const assignUserToTask = async (taskId: string, userId: string) => {
  try {
    const response = await api.post(`/tasks/${taskId}/assign`, { userId });
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const unassignUserFromTask = async (taskId: string, userId: string) => {
  try {
    const response = await api.delete(`/tasks/${taskId}/assign/${userId}`);
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Helper to handle error responses
const handleError = (error: any) => {
  if (error.response && error.response.data) {
    return new Error(error.response.data.error || 'Something went wrong');
  }
  return new Error('Server connection failed');
};