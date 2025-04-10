import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ProjectContext } from '../../context/ProjectContext';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ProjectListContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: var(--dark-color);
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }

  svg {
    margin-right: 8px;
  }
`;

const ProjectCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProjectName = styled.h3`
  margin: 0;
  color: var(--primary-color);
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #888;
`;

const ProjectDate = styled.span``;

const ProjectActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--light-color);
  color: var(--dark-color);
  border-radius: 4px;
  margin-left: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }

  &.view {
    background-color: var(--primary-color);
    color: white;
    &:hover {
      background-color: #2980b9;
    }
  }

  &.edit {
    background-color: var(--warning-color);
    color: white;
    &:hover {
      background-color: #e67e22;
    }
  }

  &.delete {
    background-color: var(--danger-color);
    color: white;
    &:hover {
      background-color: #c0392b;
    }
  }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--danger-color);
  color: white;
  border-radius: 4px;
  margin-left: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const NoProjects = styled.p`
  text-align: center;
  color: #888;
  margin-top: 20px;
`;

const Loader = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
  color: var(--primary-color);
`;

const ProjectList: React.FC = () => {
  const { projects, loading, error, fetchProjects, removeProject } = useContext(ProjectContext);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('本当にこのプロジェクトを削除しますか？')) {
      await removeProject(id);
    }
  };

  if (loading) {
    return <Loader>読み込み中...</Loader>;
  }

  return (
    <ProjectListContainer>
      <Title>プロジェクト一覧</Title>
      <AddButton to="/projects/new">
        <FaPlus /> 新規プロジェクト
      </AddButton>

      {projects.length === 0 ? (
        <NoProjects>プロジェクトがありません。新しいプロジェクトを作成してください。</NoProjects>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project._id}>
            <ProjectHeader>
              <ProjectName>{project.name}</ProjectName>
            </ProjectHeader>
            <ProjectDescription>{project.description}</ProjectDescription>
            <ProjectInfo>
              <ProjectDate>
                期間: {format(new Date(project.startDate), 'yyyy/MM/dd')} - {format(new Date(project.endDate), 'yyyy/MM/dd')}
              </ProjectDate>
              <span>オーナー: {project.owner.name}</span>
            </ProjectInfo>
            <ProjectActions>
              <ActionButton to={`/projects/${project._id}`} className="view">
                <FaEye />
              </ActionButton>
              <ActionButton to={`/projects/edit/${project._id}`} className="edit">
                <FaEdit />
              </ActionButton>
              <DeleteButton onClick={(e) => handleDelete(project._id, e)}>
                <FaTrash />
              </DeleteButton>
            </ProjectActions>
          </ProjectCard>
        ))
      )}
    </ProjectListContainer>
  );
};

export default ProjectList;