import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import MainLayout from './layout/MainLayout';
import User from './pages/user/User';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import { Toaster } from 'sonner';
import Unauthorized from './pages/Unauthorized';
import Project from './pages/project/Project';
import TodoTask from './pages/task/TodoTask';
import InProgressTask from './pages/task/InProgressTask';
import RejectTask from './pages/task/RejectTask';
import DoneTask from './pages/task/DoneTask';
import TaskList from './pages/task/TaskList';
import CreateTask from './pages/task/CreateTask';
import ActivityLog from './pages/ActivityLog/ActivityLog';
import ProjectReport from './pages/report/ProjectReport';

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Project />
              </ProtectedRoute>
            }
          />

          {/* task */}
          <Route
            path="/task/create"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <CreateTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/todo"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <TodoTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/in-progress"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <InProgressTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/reject"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <RejectTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/done"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <DoneTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task/project/:project"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-log"
            element={
              <ProtectedRoute allowedRoles={['admin', 'developer']}>
                <ActivityLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report/project"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProjectReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={
              <ProtectedRoute>
                <Unauthorized />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
