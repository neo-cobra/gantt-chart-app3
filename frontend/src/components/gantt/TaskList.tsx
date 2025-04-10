import React, { useContext, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import TaskForm from './TaskForm';

const TaskListContainer = styled.div`
  width: 100%;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
`;

const AddButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TaskTableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TaskTableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TaskTableBody = styled.tbody``;

const TaskTableRow = styled.tr`
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TaskTableCell = styled.td`
  padding: 12px 15px;
`;

const StatusBadge = styled.span<{ progress: number }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background-color: ${({ progress }) => {
    if (progress === 100) return '#2ecc71';
    if (progress >= 75) return '#27ae60';
    if (progress >= 50) return '#f39c12';
    if (progress >= 25) return '#e67e22';
    return '#e74c3c';
  }};
  color: white;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
  color: #777;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: var(--dark-color);
  }

  &.edit:hover {
    color: var(--warning-color);
  }

  &.delete:hover {
    color: var(--danger-color);
  }

  &.assign:hover {
    color: var(--primary-color);
  }
`;

const NoTasks = styled.div`
  text-align: center;
  padding: 30px;
  color: #888;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ progress }) => {
    if (progress === 100) return '#2ecc71';
    if (progress >= 75) return '#27ae60';
    if (progress >= 50) return '#f39c12';
    if (progress >= 25) return '#e67e22';
    return '#e74c3c';
  }};
`;

const AssigneesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const AssigneeItem = styled.li`
  font-size: 0.85rem;
  color: #555;
`;

interface TaskListProps {
  projectId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const { tasks, removeTask } = useContext(ProjectContext);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setShowAddForm(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('本当にこのタスクを削除しますか？')) {
      await removeTask(taskId);
    }
  };

  const handleFormComplete = () => {
    setEditingTaskId(null);
    setShowAddForm(false);
  };

  return (
    <TaskListContainer>
      <TasksHeader>
        <Title>タスク一覧</Title>
        <AddButton onClick={() => {
          setShowAddForm(!showAddForm);
          setEditingTaskId(null);
        }}>
          {showAddForm ? 'キャンセル' : '+ 新規タスク'}
        </AddButton>
      </TasksHeader>

      {showAddForm && (
        <TaskForm 
          projectId={projectId} 
          onComplete={handleFormComplete} 
        />
      )}

      {editingTaskId && (
        <TaskForm 
          projectId={projectId} 
          taskId={editingTaskId}
          onComplete={handleFormComplete} 
        />
      )}

      {tasks.length === 0 ? (
        <NoTasks>
          <p>タスクがまだ登録されていません。新しいタスクを追加してください。</p>
        </NoTasks>
      ) : (
        <TaskTable>
          <TaskTableHead>
            <tr>
              <TaskTableHeaderCell>タスク名</TaskTableHeaderCell>
              <TaskTableHeaderCell>期間</TaskTableHeaderCell>
              <TaskTableHeaderCell>タイプ</TaskTableHeaderCell>
              <TaskTableHeaderCell>担当者</TaskTableHeaderCell>
              <TaskTableHeaderCell>進捗</TaskTableHeaderCell>
              <TaskTableHeaderCell>アクション</TaskTableHeaderCell>
            </tr>
          </TaskTableHead>
          <TaskTableBody>
            {tasks.map((task) => (
              <TaskTableRow key={task._id}>
                <TaskTableCell>{task.name}</TaskTableCell>
                <TaskTableCell>
                  {format(new Date(task.startDate), 'yyyy/MM/dd')} - {format(new Date(task.endDate), 'yyyy/MM/dd')}
                </TaskTableCell>
                <TaskTableCell>
                  {task.type === 'milestone' ? 'マイルストーン' : 'タスク'}
                </TaskTableCell>
                <TaskTableCell>
                  <AssigneesList>
                    {task.assignedTo.length > 0 ? (
                      task.assignedTo.map((user: any) => (
                        <AssigneeItem key={user._id || user}>
                          {user.name || '不明なユーザー'}
                        </AssigneeItem>
                      ))
                    ) : (
                      <AssigneeItem>未割り当て</AssigneeItem>
                    )}
                  </AssigneesList>
                </TaskTableCell>
                <TaskTableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ProgressBar>
                      <ProgressFill progress={task.progress} />
                    </ProgressBar>
                    <span>{task.progress}%</span>
                  </div>
                </TaskTableCell>
                <TaskTableCell>
                  <TaskActions>
                    <ActionButton className="edit" onClick={() => handleEditTask(task._id)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton className="delete" onClick={() => handleDeleteTask(task._id)}>
                      <FaTrash />
                    </ActionButton>
                  </TaskActions>
                </TaskTableCell>
              </TaskTableRow>
            ))}
          </TaskTableBody>
        </TaskTable>
      )}
    </TaskListContainer>
  );
};

export default TaskList;