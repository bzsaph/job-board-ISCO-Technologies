import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/slices/jobsSlice';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

export default function JobList() {
  const dispatch = useDispatch();
  const jobs = useSelector((s) => s.jobs.list);
  const [q, setQ] = useState({ title: '', location: '' });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const search = () => {
    const params = [];
    if (q.title) params.push(`title=${encodeURIComponent(q.title)}`);
    if (q.location) params.push(`location=${encodeURIComponent(q.location)}`);
    dispatch(fetchJobs(params.length ? `?${params.join('&')}` : ''));
  };

  return (
    <DashboardLayout>
    <div className="max-w-12xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Jobs</h2>

      {/* Search Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-3 items-center">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Job title"
          value={q.title}
          onChange={(e) => setQ({ ...q, title: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Location"
          value={q.location}
          onChange={(e) => setQ({ ...q, location: e.target.value })}
        />
        <button
          onClick={search}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
        >
          Search
        </button>
      </div>

      {/* Job Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No jobs found. Try adjusting your search.
                </td>
              </tr>
            )}

            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    View
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
