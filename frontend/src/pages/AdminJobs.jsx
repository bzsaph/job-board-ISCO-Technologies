import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, createJob, deleteJob } from '../store/slices/jobsSlice';
import { Link } from 'react-router-dom';

export default function AdminJobs() {
  const dispatch = useDispatch();
  const jobs = useSelector((s) => s.jobs.list);
  const jobsStatus = useSelector((s) => s.jobs.status);
  const jobsError = useSelector((s) => s.jobs.error);

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const create = async () => {
    if (!form.title || !form.company || !form.location) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      await dispatch(createJob(form)).unwrap();
      setForm({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary: ''
      });
    } catch (err) {
      alert(err.message || 'Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await dispatch(deleteJob(id)).unwrap();
    } catch (err) {
      alert(err.message || 'Failed to delete job.');
    }
  };

  // Loading / Error handling
  if (jobsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading jobs...
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {jobsError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Jobs</h2>

        {/* Create Job Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Create New Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            placeholder="Requirements"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={create}
            disabled={submitting}
            className={`mt-4 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Creating...' : 'Create Job'}
          </button>
        </div>

        {/* Job List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Job Listings</h3>
          <ul className="space-y-4">
            {jobs.length === 0 && <p className="text-gray-500 text-sm">No jobs found.</p>}
            {jobs.map((j) => (
              <li
                key={j.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{j.title}</h4>
                    <p className="text-sm text-gray-600">{j.company} • {j.location}</p>
                    {j.salary && (
                      <p className="text-sm text-green-600 font-medium mt-1">{j.salary}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      className="text-indigo-600 hover:underline text-sm"
                      to={`/admin/applications/${j.id}`}
                    >
                      Applications
                    </Link>
                    <button
                      onClick={() => remove(j.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
