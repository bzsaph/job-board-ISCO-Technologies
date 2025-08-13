import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicationsForJob, updateApplicationStatus, fetchJob } from '../store/slices/applicationsSlice';

export default function AdminApplications() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const apps = useSelector(s => s.applications.list);
  const [job, setJob] = useState(null); // store job info

  useEffect(() => {
    if (jobId) {
      dispatch(getApplicationsForJob(jobId))
        .unwrap()
        .then((data) => console.log('Applications:', data));

      dispatch(fetchJob(jobId))
        .unwrap()
        .then((data) => setJob(data))
        .catch(err => console.error('Failed to fetch job:', err));
    }
  }, [dispatch, jobId]);

  const setStatus = (id, status) => dispatch(updateApplicationStatus({ id, status }));

  const statusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'text-yellow-700 bg-yellow-100';
      case 'accepted': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
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
        <ul className="space-y-4">
          {apps.map(a => (
            <li key={a.id} className="p-4 border rounded shadow hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">{a.applicantEmail}</div>
                <span className={`px-2 py-1 rounded text-sm font-medium ${statusColor(a.status)}`}>
                  {a.status.toUpperCase()}
                </span>
              </div>
              <div className="text-gray-700 mb-3">{a.coverLetter}</div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                  onClick={() => setStatus(a.id, 'reviewed')}
                >
                  Mark Reviewed
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
