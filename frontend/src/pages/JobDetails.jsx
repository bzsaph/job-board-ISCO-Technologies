import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../store/slices/jobsSlice';
import { applyJob } from '../store/slices/applicationsSlice';
import { FiFileText } from 'react-icons/fi';

export default function JobDetailsDashboard() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(s => s.jobs.current);
  const auth = useSelector(s => s.auth); // user auth info

  const [coverFile, setCoverFile] = useState(null);
  const [cvLink, setCvLink] = useState('');
  const [msg, setMsg] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchJob(id));

    // Check if user already applied
    if (auth.token) {
      fetch(`/api/applications/check/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
        .then(res => res.json())
        .then(data => setAlreadyApplied(data.applied))
        .catch(err => console.error(err));
    }
  }, [dispatch, id, auth.token]);

  const validateFile = (file) => {
    if (!file) return false;
    if (file.type !== 'application/pdf') { setMsg('❌ Only PDF files are allowed.'); return false; }
    if (file.size > 5 * 1024 * 1024) { setMsg('❌ File must be less than 5MB.'); return false; }
    return true;
  };

  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const apply = async () => {
    if (!auth.token) return setMsg('⚠️ You must log in to apply.');
    if (!coverFile || !cvLink) return setMsg('⚠️ Please upload cover letter and enter CV link.');
    if (!isValidUrl(cvLink)) return setMsg('❌ CV link must be a valid URL.');

    try {
      const formData = new FormData();
      formData.append('jobId', Number(id));
      formData.append('coverLetter', coverFile);
      formData.append('cvLink', cvLink);

      await dispatch(applyJob(formData)).unwrap();
      setMsg('✅ Application submitted successfully!');
      setCoverFile(null);
      setCvLink('');
      document.getElementById('coverInput').value = '';
      setAlreadyApplied(true);
    } catch (e) {
      console.error(e);
      setMsg('❌ Error submitting application.');
    }
  };

  const renderFile = (file) => (
    <div className="flex items-center space-x-2 py-1">
      <FiFileText className="text-red-500 w-5 h-5" />
      <span className="text-gray-700">{file.name}</span>
    </div>
  );

  if (!job) return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading job...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar only if logged in */}
      {auth.token && (
        <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/my-applications" className="text-gray-700 hover:text-indigo-600">My Applications</Link>
            <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Profile</Link>
            <Link to="/jobs" className="text-gray-700 hover:text-indigo-600">Jobs</Link>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
          <p className="text-gray-600 text-sm mt-1">{job.company} • {job.location}</p>
          {job.salary && <p className="text-green-600 font-semibold mt-1">{job.salary}</p>}
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Job Description</h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Application Form */}
        {alreadyApplied ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            ⚠️ You have already applied to this job.
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Apply for this job</h3>

            <label className="block mb-1 font-medium">Cover Letter (PDF)</label>
            <input
              id="coverInput"
              type="file"
              accept="application/pdf"
              onChange={e => validateFile(e.target.files[0]) && setCoverFile(e.target.files[0])}
              className="mb-2"
            />
            {coverFile && renderFile(coverFile)}
            <hr className="my-2 border-gray-300" />

            <label className="block mb-1 font-medium">CV Link (URL)</label>
            <input
              type="url"
              value={cvLink}
              onChange={e => setCvLink(e.target.value)}
              placeholder="Enter your CV URL"
              className="mb-2 w-full border border-gray-300 rounded px-3 py-2"
            />
            <hr className="my-2 border-gray-300" />

            <button
              onClick={apply}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition w-full md:w-auto"
            >
              Submit Application
            </button>

            {msg && (
              <div className={`mt-3 text-sm font-medium ${
                msg.includes('✅') ? 'text-green-600' : msg.includes('⚠️') ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {msg}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
