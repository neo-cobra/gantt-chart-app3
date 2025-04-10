import React, { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { Gantt, Task, ViewMode, StylingOption, EventOption } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import styled from 'styled-components';

const GanttContainer = styled.div`
  height: 600px;
  position: relative;
`;

const ViewSwitcher = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  margin-left: 8px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--light-color)'};
  color: ${props => props.active ? 'white' : 'var(--dark-color)'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#e0e0e0'};
  }
`;

const NoTasks = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;
`;

interface GanttChartProps {
  projectId: string;
}

// Extend the base Task type from gantt-task-react
interface GanttTask extends Task {
  _id: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ projectId }) => {
  const { tasks, currentProject, updateProgress } = useContext(ProjectContext);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  // Convert API tasks to Gantt chart format
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.map(task => ({
        _id: task._id,
        id: task._id,
        name: task.name,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        progress: task.progress / 100,
        type: task.type === 'milestone' ? 'milestone' as const : 'task' as const,
        isDisabled: task.isDisabled,
        styles: { progressColor: '#2ecc71', progressSelectedColor: '#27ae60' },
        dependencies: task.dependencies.map((dep: any) => dep._id || dep),
        project: task.project
      }));

      // Add project as a root task if it exists
      if (currentProject) {
        const projectTask: GanttTask = {
          _id: currentProject._id,
          id: currentProject._id,
          name: currentProject.name,
          start: new Date(currentProject.startDate),
          end: new Date(currentProject.endDate),
          progress: calculateProjectProgress(tasks),
          type: 'project' as const,
          isDisabled: false,
          hideChildren: false,
          styles: { progressColor: '#3498db', progressSelectedColor: '#2980b9' }
        };
        
        setGanttTasks([projectTask, ...formattedTasks]);
      } else {
        setGanttTasks(formattedTasks as GanttTask[]);
      }
    } else {
      setGanttTasks([]);
    }
  }, [tasks, currentProject]);

  // Calculate overall project progress based on all tasks
  const calculateProjectProgress = (tasks: any[]): number => {
    if (!tasks || tasks.length === 0) return 0;
    
    const total = tasks.length;
    const progressSum = tasks.reduce((sum, task) => sum + task.progress, 0);
    return progressSum / (total * 100);
  };

  const handleTaskChange = (task: Task) => {
    // Find the original task
    const originalTask = ganttTasks.find(t => t.id === task.id);
    if (!originalTask || originalTask._id === currentProject?._id) return;

    // Calculate progress as percentage
    const progressPercentage = Math.round(task.progress * 100);
    
    // Update the task progress in the backend
    updateProgress(originalTask._id, progressPercentage);
  };

  const handleProgressChange = (task: Task) => {
    handleTaskChange(task);
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const handleExpanderClick = (task: Task) => {
    setGanttTasks(ganttTasks.map(t => (
      t.id === task.id ? { ...t, hideChildren: !task.hideChildren } : t
    )));
  };

  // Styling options
  const getColumnWidth = () => {
    switch (view) {
      case ViewMode.Year:
        return 350;
      case ViewMode.Month:
        return 300;
      default:
        return 60;
    }
  };

  return (
    <GanttContainer>
      <ViewSwitcher>
        <ViewButton 
          active={view === ViewMode.Hour} 
          onClick={() => setView(ViewMode.Hour)}
        >
          時間
        </ViewButton>
        <ViewButton 
          active={view === ViewMode.Day} 
          onClick={() => setView(ViewMode.Day)}
        >
          日
        </ViewButton>
        <ViewButton 
          active={view === ViewMode.Week} 
          onClick={() => setView(ViewMode.Week)}
        >
          週
        </ViewButton>
        <ViewButton 
          active={view === ViewMode.Month} 
          onClick={() => setView(ViewMode.Month)}
        >
          月
        </ViewButton>
        <ViewButton 
          active={view === ViewMode.Year} 
          onClick={() => setView(ViewMode.Year)}
        >
          年
        </ViewButton>
      </ViewSwitcher>

      {ganttTasks.length > 0 ? (
        <Gantt
          tasks={ganttTasks}
          viewMode={view}
          onDateChange={handleTaskChange}
          onProgressChange={handleProgressChange}
          onDoubleClick={handleTaskClick}
          onExpanderClick={handleExpanderClick}
          listCellWidth={`${getColumnWidth()}px`}
          columnWidth={getColumnWidth()}
        />
      ) : (
        <NoTasks>
          <p>タスクがまだ登録されていません。新しいタスクを追加してください。</p>
        </NoTasks>
      )}
    </GanttContainer>
  );
};

export default GanttChart;