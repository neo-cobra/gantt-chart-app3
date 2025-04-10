import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
`;

const FormTitle = styled.h3`
  margin-bottom: 15px;
  color: var(--dark-color);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  grid-column: 1 / -1;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
`;

const SubmitButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--light-color);
  color: var(--dark-color);

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 5px;
`;

interface TaskFormProps {
  projectId: string;
  taskId?: string;
  onComplete: () => void;
}

interface TaskFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  progress: number;
  dependencies: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, taskId, onComplete }) => {
  const { tasks, addTask, editTask } = useContext(ProjectContext);
  
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'task',
    progress: 0,
    dependencies: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load task data if editing
  useEffect(() => {
    if (taskId && tasks) {
      const task = tasks.find(t => t._id === taskId);
      if (task) {
        // Format dates for date input (YYYY-MM-DD)
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          name: task.name,
          description: task.description,
          startDate: formatDate(task.startDate),
          endDate: formatDate(task.endDate),
          type: task.type,
          progress: task.progress,
          dependencies: task.dependencies.map((dep: any) => dep._id || dep),
        });
      }
    }
  }, [taskId, tasks]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'タスク名は必須です';
    }

    if (!formData.startDate) {
      newErrors.startDate = '開始日は必須です';
    }

    if (!formData.endDate) {
      newErrors.endDate = '終了日は必須です';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = '終了日は開始日より後である必要があります';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleDependencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, dependencies: selected }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data for API
      const taskData = {
        ...formData,
        project: projectId,
      };

      if (taskId) {
        await editTask(taskId, taskData);
      } else {
        await addTask(taskData);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onComplete();
  };

  return (
    <FormContainer>
      <FormTitle>{taskId ? 'タスクを編集' : '新規タスク'}</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">タスク名</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="type">タイプ</Label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="task">タスク</option>
            <option value="milestone">マイルストーン</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">開始日</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">終了日</Label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="progress">進捗率 (%)</Label>
          <Input
            type="number"
            id="progress"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleNumberChange}
          />
        </FormGroup>

        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label htmlFor="dependencies">依存タスク</Label>
          <Select
            id="dependencies"
            name="dependencies"
            multiple
            value={formData.dependencies}
            onChange={handleDependencyChange}
            style={{ height: '100px' }}
          >
            {tasks
              .filter(task => task._id !== taskId) // Don't allow a task to depend on itself
              .map(task => (
                <option key={task._id} value={task._id}>
                  {task.name}
                </option>
              ))}
          </Select>
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            複数選択する場合はCtrlキーを押しながらクリックしてください
          </small>
        </FormGroup>

        <FormGroup style={{ gridColumn: '1 / -1' }}>
          <Label htmlFor="description">説明</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            キャンセル
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default TaskForm;