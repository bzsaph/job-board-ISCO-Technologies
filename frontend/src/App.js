
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminJobs from './pages/AdminJobs';
import AdminApplications from './pages/AdminApplications';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <BrowserRouter>
      <div className="p-4 bg-slate-50 min-h-screen">
        <nav className="mb-4">
          <Link to="/" className="mr-4">Jobs</Link>
          <Link to="/admin" className="mr-4">Admin</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<JobList/>} />
          <Route path="/jobs/:id" element={<JobDetails/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminJobs/></ProtectedRoute>} />
          <Route path="/admin/applications/:jobId" element={<ProtectedRoute adminOnly><AdminApplications/></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
