import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProjectContext } from '../../context/ProjectContext';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: var(--dark-color);
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;

  &:hover:not(:disabled) {
    background-color: #2980b9;
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
  margin-top: 5px;
  font-size: 0.9rem;
`;

const Loader = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
  color: var(--primary-color);
`;

interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProject, editProject, fetchProject, currentProject, loading } = useContext(ProjectContext);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        await fetchProject(id);
      };
      loadProject();
    }
  }, [id, fetchProject]);

  useEffect(() => {
    if (id && currentProject) {
      // Format dates for date input (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: currentProject.name,
        description: currentProject.description,
        startDate: formatDate(currentProject.startDate),
        endDate: formatDate(currentProject.endDate)
      });
    }
  }, [id, currentProject]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'プロジェクト名は必須です';
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (id) {
        await editProject(id, formData);
        navigate(`/projects/${id}`);
      } else {
        const newProject = await addProject(formData);
        navigate(`/projects/${newProject._id}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && id) {
    return <Loader>プロジェクトを読み込み中...</Loader>;
  }

  return (
    <FormContainer>
      <Title>{id ? 'プロジェクトを編集' : '新規プロジェクト'}</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">プロジェクト名</Label>
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
          <Label htmlFor="description">説明</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
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

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate(-1)}>
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

export default ProjectForm;