import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar'; // ✅ correct, Navbar is default export

export default function DashboardLayout({ children }) {
  const auth = useSelector(state => state.auth);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {auth.token && (
        <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            <Link to="/dashboard">Home</Link>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/jobs">Jobs</Link>
            {auth.user?.role === 'admin' && <Link to="/admin/users">All Users</Link>}
          </nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
