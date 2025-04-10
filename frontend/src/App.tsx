import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetails from './components/projects/ProjectDetails';
import { AuthContext } from './context/AuthContext';

const App: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  // Protected route component
  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (loading) {
      return <div className="loader">Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <>
      <Header />
      <div className="main-content">
        {user && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            } />
            
            <Route path="/projects/new" element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } />
            
            <Route path="/projects/edit/:id" element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } />
            
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;