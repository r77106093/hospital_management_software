import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import BookAppointment from './pages/BookAppointment';
import Upload from './pages/Upload';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="patients" element={
              <ProtectedRoute roles={['doctor', 'staff']}>
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <Reports />
            } />
            <Route path="book-appointment" element={
              <ProtectedRoute roles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="upload" element={
              <ProtectedRoute roles={['staff']}>
                <Upload />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;