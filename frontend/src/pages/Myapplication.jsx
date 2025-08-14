import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicationsForJob, fetchCoverLetter } from '../store/slices/applicationsSlice';
import { FiFileText, FiExternalLink } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

export default function MyApplications() {
  const dispatch = useDispatch();
  const apps = useSelector(state => state.applications.myList || []);
  const user = useSelector(state => state.auth.user);

  const viewPDF = async (filename) => {
    const resultAction = await dispatch(fetchCoverLetter(filename));
    if (fetchCoverLetter.fulfilled.match(resultAction)) {
      const url = resultAction.payload;
      window.open(url);
    } else {
      console.error('Failed to fetch PDF', resultAction.payload);
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getApplicationsForJob());
    }
  }, [dispatch, user]);
  

  

  const statusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'text-yellow-700 bg-yellow-100';
      case 'accepted': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString(); // formats nicely based on locale
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">My Applications</h2>

        {apps.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Job Title</th>
                <th className="border px-4 py-2 text-left">Applicant Email</th>
                <th className="border px-4 py-2 text-left">Cover Letter</th>
                <th className="border px-4 py-2 text-left">CV Link</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Applied At</th>
                <th className="border px-4 py-2 text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{a.jobTitle || `Job ID: ${a.jobId}`}</td>
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
                        View CV <FiExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-gray-500">No link</span>
                    )}
                  </td>
                  <td className={`border px-4 py-2 ${statusColor(a.status)} font-semibold`}>
                    {a.status.toUpperCase()}
                  </td>
                  <td className="border px-4 py-2">{formatDate(a.createdAt)}</td>
                  <td className="border px-4 py-2">{formatDate(a.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
