import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ProjectContext } from '../../context/ProjectContext';
import GanttChart from '../gantt/GanttChart';
import TaskForm from '../gantt/TaskForm';
import TaskList from '../gantt/TaskList';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaUserPlus, FaUserMinus } from 'react-icons/fa';

const ProjectDetailsContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: var(--dark-color);
  margin: 0;
`;

const ProjectMeta = styled.div`
  margin: 10px 0 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const MetaItem = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const MetaLabel = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const EditButton = styled(Link)`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: var(--warning-color);
  color: white;
  text-decoration: none;

  &:hover {
    background-color: #e67e22;
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  padding: 20px;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-bottom: 2px solid ${(props) => (props.active ? 'var(--primary-color)' : 'transparent')};
  color: ${(props) => (props.active ? 'var(--primary-color)' : '#777')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const MembersSection = styled.div`
  margin-top: 20px;
`;

const MembersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const MemberItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.span`
  font-weight: bold;
`;

const MemberEmail = styled.span`
  font-size: 0.85rem;
  color: #777;
`;

const RemoveMemberButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;
  padding: 5px 10px;
  font-size: 0.8rem;

  &:hover {
    background-color: #c0392b;
  }
`;

const AddMemberForm = styled.form`
  display: flex;
  margin-top: 15px;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AddButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;

  &:hover {
    background-color: #2980b9;
  }
`;

const Loader = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
  color: var(--primary-color);
`;

enum TabType {
  GANTT = 'gantt',
  TASKS = 'tasks',
  MEMBERS = 'members',
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    fetchProject, 
    currentProject, 
    fetchTasks, 
    tasks, 
    loading, 
    removeProject,
    addMember,
    removeMember
  } = useContext(ProjectContext);

  const [activeTab, setActiveTab] = useState<TabType>(TabType.GANTT);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchTasks(id);
    }
  }, [id, fetchProject, fetchTasks]);

  const handleDeleteProject = async () => {
    if (!id || !currentProject) return;
    
    if (window.confirm(`本当に "${currentProject.name}" プロジェクトを削除しますか？`)) {
      await removeProject(id);
      navigate('/');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newMemberEmail.trim()) return;
    
    try {
      await addMember(id, newMemberEmail);
      setNewMemberEmail('');
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id || !currentProject) return;
    
    if (window.confirm('このメンバーをプロジェクトから削除しますか？')) {
      await removeMember(id, userId);
    }
  };

  if (loading || !currentProject) {
    return <Loader>プロジェクトを読み込み中...</Loader>;
  }

  const isOwner = true; // TODO: Replace with actual check once auth is implemented

  return (
    <ProjectDetailsContainer>
      <Header>
        <div>
          <Title>{currentProject.name}</Title>
          <ProjectMeta>
            <MetaItem>
              <MetaLabel>期間:</MetaLabel>
              {format(new Date(currentProject.startDate), 'yyyy/MM/dd')} - {format(new Date(currentProject.endDate), 'yyyy/MM/dd')}
            </MetaItem>
            <MetaItem>
              <MetaLabel>オーナー:</MetaLabel>
              {currentProject.owner.name}
            </MetaItem>
            <MetaItem>
              <MetaLabel>メンバー:</MetaLabel>
              {currentProject.members.length} 人
            </MetaItem>
          </ProjectMeta>
        </div>
        {isOwner && (
          <ButtonGroup>
            <EditButton to={`/projects/edit/${id}`}>
              <FaEdit /> 編集
            </EditButton>
            <DeleteButton onClick={handleDeleteProject}>
              <FaTrash /> 削除
            </DeleteButton>
          </ButtonGroup>
        )}
      </Header>

      <Card>
        <p>{currentProject.description}</p>
      </Card>

      <Tabs>
        <Tab
          active={activeTab === TabType.GANTT}
          onClick={() => setActiveTab(TabType.GANTT)}
        >
          ガントチャート
        </Tab>
        <Tab
          active={activeTab === TabType.TASKS}
          onClick={() => setActiveTab(TabType.TASKS)}
        >
          タスク一覧
        </Tab>
        <Tab
          active={activeTab === TabType.MEMBERS}
          onClick={() => setActiveTab(TabType.MEMBERS)}
        >
          メンバー管理
        </Tab>
      </Tabs>

      {activeTab === TabType.GANTT && (
        <Card>
          <Button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              marginBottom: '20px'
            }}
          >
            {showTaskForm ? 'タスク追加をキャンセル' : '新規タスクを追加'}
          </Button>
          
          {showTaskForm && (
            <TaskForm 
              projectId={id || ''} 
              onComplete={() => setShowTaskForm(false)}
            />
          )}
          
          <GanttChart projectId={id || ''} />
        </Card>
      )}

      {activeTab === TabType.TASKS && (
        <Card>
          <TaskList projectId={id || ''} />
        </Card>
      )}

      {activeTab === TabType.MEMBERS && (
        <Card>
          <MembersSection>
            <h3>プロジェクトメンバー</h3>
            <MembersList>
              <MemberItem>
                <MemberInfo>
                  <MemberName>{currentProject.owner.name} (オーナー)</MemberName>
                  <MemberEmail>{currentProject.owner.email}</MemberEmail>
                </MemberInfo>
              </MemberItem>
              
              {currentProject.members.map((member: any) => (
                <MemberItem key={member._id}>
                  <MemberInfo>
                    <MemberName>{member.name}</MemberName>
                    <MemberEmail>{member.email}</MemberEmail>
                  </MemberInfo>
                  {isOwner && (
                    <RemoveMemberButton onClick={() => handleRemoveMember(member._id)}>
                      <FaUserMinus /> 削除
                    </RemoveMemberButton>
                  )}
                </MemberItem>
              ))}
            </MembersList>

            {isOwner && (
              <>
                <h4>メンバーを追加</h4>
                <AddMemberForm onSubmit={handleAddMember}>
                  <Input
                    type="email"
                    placeholder="メールアドレスを入力"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                  />
                  <AddButton type="submit">
                    <FaUserPlus /> 追加
                  </AddButton>
                </AddMemberForm>
              </>
            )}
          </MembersSection>
        </Card>
      )}
    </ProjectDetailsContainer>
  );
};

export default ProjectDetails;