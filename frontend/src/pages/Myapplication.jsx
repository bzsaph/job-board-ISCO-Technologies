import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../store/slices/myapplicationslices';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.myApplications);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  // Filter applications based on search input
  const filteredList = list.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.jobTitle?.toLowerCase().includes(q) ||
      app.company?.toLowerCase().includes(q) ||
      app.status?.toLowerCase().includes(q)
    );
  });

  const statusColors = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-blue-700 bg-blue-100';
      case 'reviewed':
        return 'text-yellow-700 bg-yellow-100';
      case 'accepted':
        return 'text-green-700 bg-green-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h2>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Job Title, Company or Status..."
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Loading & Error States */}
        {status === 'loading' && (
          <div className="text-center py-6 text-gray-500">Loading applications...</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            Error: {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cover Letter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredList.length === 0 && status !== 'loading' && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No applications found.
                  </td>
                </tr>
              )}

              {filteredList.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {app.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {app.coverLetter ? (
                      <a
                        href={app.coverLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </a>
                    ) : '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {app.cvLink ? (
                      <a
                        href={app.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View CV
                      </a>
                    ) : '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      View Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
