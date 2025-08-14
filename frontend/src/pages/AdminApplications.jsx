import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FILES_BASE_URL } from '../services/api'; // adjust path as needed


import {
  getApplicationsForJob,
  updateApplicationStatus,
  fetchJob
} from '../store/slices/applicationsSlice';
import { FiFileText, FiExternalLink } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminApplications() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const apps = useSelector(s => s.applications.list);
  const error = useSelector(s => s.applications.error);
  const [job, setJob] = useState(null);

  // Open PDF in new tab
  const viewPDF = async (filename) => {
    try {
      const res = await fetch(`${FILES_BASE_URL}/files/${filename}`);

      if (!res.ok) throw new Error('File not found');

      const blob = await res.blob();
      if (blob.type !== 'application/pdf') throw new Error('Invalid file type');

      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error('Failed to fetch PDF', err);
      alert('Could not load PDF. File may be missing.');
    }
  };

  useEffect(() => {
    if (jobId) {
      dispatch(getApplicationsForJob(jobId))
        .unwrap()
        .then(data => console.log('Applications:', data))
        .catch(() => {});

      dispatch(fetchJob(jobId))
        .unwrap()
        .then(data => setJob(data))
        .catch(err => console.error('Failed to fetch job:', err));
    }
  }, [dispatch, jobId]);

  const setStatus = (id, status) => {
    const app = apps.find(a => a.id === id);
    if (!app) return;

    // Do not allow status change if already accepted or rejected
    if (app.status === 'accepted' || app.status === 'rejected') {
      alert('Cannot change status after final decision');
      return;
    }
    dispatch(updateApplicationStatus({ id, status }));
  };

  const statusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'text-yellow-700 bg-yellow-100';
      case 'accepted': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-12xl mx-auto p-12">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {job ? (
          <h2 className="text-2xl font-bold mb-4">
            Applications for: {job.title} (ID: {job.id})
          </h2>
        ) : (
          <h2 className="text-2xl font-bold mb-4">Loading job info...</h2>
        )}

        {apps.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Applicant Email</th>
                <th className="border px-4 py-2 text-left">Cover Letter</th>
                <th className="border px-4 py-2 text-left">CV Link</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{a.applicantEmail}</td>
                  <td className="border px-4 py-2">
                    {a.coverLetter ? (
                      <button
                        onClick={() => viewPDF(a.coverLetter)}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FiFileText className="text-red-500 w-5 h-5 mr-1" />
                        View PDF
                      </button>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {a.cvLink ? (
                      <a
                        href={a.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        View CV <FiExternalLink className="ml-1 w-4 h-4"/>
                      </a>
                    ) : (
                      <span className="text-gray-500">No link</span>
                    )}
                  </td>
                  <td className={`border px-4 py-2 ${statusColor(a.status)} font-semibold`}>
                    {a.status.toUpperCase()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                      onClick={() => setStatus(a.id, 'reviewed')}
                    >
                      Review
                    </button>
                    <button
                      className="px-3 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300"
                      onClick={() => setStatus(a.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                      onClick={() => setStatus(a.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
