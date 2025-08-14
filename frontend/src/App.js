import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminJobs from './pages/AdminJobs';
import AdminApplications from './pages/AdminApplications';
import ProtectedRoute from './components/ProtectedRoute';
import Myapplication from './pages/Myapplication';
import Profile from './pages/Profile';

function Navbar() {
  const user = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://iscotechnologies.rw/assets/isco-tech-logo-web-CGKuiJti.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-bold text-indigo-600">JobBoard 
          {user ? (
            <>
              <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              user.user?.role === 'admin'
                ? 'text-red-600'
                : user.user?.role === 'user'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            ({user.user?.role})
          </span>

            </>
          ) : (
            <>
            
            </>
          )}
            
            
             </span>
        </Link>

        {/* Menu */}
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">Jobs</Link>
          <Link to="/admin" className="text-gray-700 hover:text-indigo-600">Admin</Link>

          {user ? (
            <>
              <span className={`font-semibold ${user.user?.role === 'admin'
                  ? 'text-red-600'
                  : user.user?.role === 'user'
                    ? 'text-green-600'
                    : 'text-gray-600'}`}>Hi, {user.user?.firstName} {user.user?.lastName}
              </span>


              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-4 bg-slate-50 min-h-screen">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/applications/:jobId" element={<ProtectedRoute adminOnly><AdminApplications /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><Myapplication /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

         


        </Routes>
      </main>
    </BrowserRouter>
  );
}
