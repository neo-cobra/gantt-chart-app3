import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  addProjectMember,
  removeProjectMember
} from '../services/projectService';
import { 
  getTasksByProject, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskProgress,
  assignUserToTask,
  unassignUserFromTask 
} from '../services/projectService';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  owner: any;
  members: any[];
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  project: string;
  assignedTo: any[];
  dependencies: any[];
  type: string;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Project actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  addProject: (projectData: Partial<Project>) => Promise<Project>;
  editProject: (id: string, projectData: Partial<Project>) => Promise<Project>;
  removeProject: (id: string) => Promise<void>;
  addMember: (projectId: string, email: string) => Promise<void>;
  removeMember: (projectId: string, userId: string) => Promise<void>;
  
  // Task actions
  fetchTasks: (projectId: string) => Promise<void>;
  addTask: (taskData: Partial<Task>) => Promise<Task>;
  editTask: (id: string, taskData: Partial<Task>) => Promise<Task>;
  removeTask: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<Task>;
  assignTask: (taskId: string, userId: string) => Promise<void>;
  unassignTask: (taskId: string, userId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  currentProject: null,
  tasks: [],
  loading: false,
  error: null,
  
  fetchProjects: async () => {},
  fetchProject: async () => {},
  addProject: async () => ({ _id: '', name: '', description: '', startDate: '', endDate: '', owner: {}, members: [], createdAt: '', updatedAt: '' }),
  editProject: async () => ({ _id: '', name: '', description: '', startDate: '', endDate: '', owner: {}, members: [], createdAt: '', updatedAt: '' }),
  removeProject: async () => {},
  addMember: async () => {},
  removeMember: async () => {},
  
  fetchTasks: async () => {},
  addTask: async () => ({ _id: '', name: '', description: '', startDate: '', endDate: '', progress: 0, project: '', assignedTo: [], dependencies: [], type: 'task', isDisabled: false, createdAt: '', updatedAt: '' }),
  editTask: async () => ({ _id: '', name: '', description: '', startDate: '', endDate: '', progress: 0, project: '', assignedTo: [], dependencies: [], type: 'task', isDisabled: false, createdAt: '', updatedAt: '' }),
  removeTask: async () => {},
  updateProgress: async () => ({ _id: '', name: '', description: '', startDate: '', endDate: '', progress: 0, project: '', assignedTo: [], dependencies: [], type: 'task', isDisabled: false, createdAt: '', updatedAt: '' }),
  assignTask: async () => {},
  unassignTask: async () => {},
});

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Project actions
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProject(id);
      setCurrentProject(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      const newProject = await createProject(projectData);
      setProjects((prevProjects) => [...prevProjects, newProject]);
      toast.success('プロジェクトが作成されました');
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの作成に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await updateProject(id, projectData);
      setProjects((prevProjects) =>
        prevProjects.map((project) => (project._id === id ? updatedProject : project))
      );
      if (currentProject && currentProject._id === id) {
        setCurrentProject(updatedProject);
      }
      toast.success('プロジェクトが更新されました');
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの更新に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  const removeProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProject(id);
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
      if (currentProject && currentProject._id === id) {
        setCurrentProject(null);
      }
      toast.success('プロジェクトが削除されました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'プロジェクトの削除に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  const addMember = useCallback(async (projectId: string, email: string) => {
    try {
      setLoading(true);
      setError(null);
      await addProjectMember(projectId, email);
      // Refresh project data to get updated member list
      const updatedProject = await getProject(projectId);
      setCurrentProject(updatedProject);
      toast.success('メンバーが追加されました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'メンバーの追加に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (projectId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await removeProjectMember(projectId, userId);
      // Refresh project data to get updated member list
      const updatedProject = await getProject(projectId);
      setCurrentProject(updatedProject);
      toast.success('メンバーが削除されました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'メンバーの削除に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Task actions
  const fetchTasks = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksByProject(projectId);
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの取得に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast.success('タスクが作成されました');
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの作成に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (id: string, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
      toast.success('タスクが更新されました');
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの更新に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      toast.success('タスクが削除されました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの削除に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (id: string, progress: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTaskProgress(id, progress);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '進捗の更新に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignTask = useCallback(async (taskId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await assignUserToTask(taskId, userId);
      // Refresh tasks to get updated assignee list
      const projectId = tasks.find(task => task._id === taskId)?.project;
      if (projectId) {
        const updatedTasks = await getTasksByProject(projectId);
        setTasks(updatedTasks);
      }
      toast.success('タスクが割り当てられました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの割り当てに失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const unassignTask = useCallback(async (taskId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await unassignUserFromTask(taskId, userId);
      // Refresh tasks to get updated assignee list
      const projectId = tasks.find(task => task._id === taskId)?.project;
      if (projectId) {
        const updatedTasks = await getTasksByProject(projectId);
        setTasks(updatedTasks);
      }
      toast.success('タスクの割り当てが解除されました');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの割り当て解除に失敗しました';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        tasks,
        loading,
        error,
        fetchProjects,
        fetchProject,
        addProject,
        editProject,
        removeProject,
        addMember,
        removeMember,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        updateProgress,
        assignTask,
        unassignTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};