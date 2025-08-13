import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJob } from '../store/slices/jobsSlice';
import { applyJob } from '../store/slices/applicationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiFileText } from 'react-icons/fi'; // PDF icon

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const job = useSelector((s) => s.jobs.current);
  const auth = useSelector((s) => s.auth);

  const [coverFile, setCoverFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    dispatch(fetchJob(id));
  }, [dispatch, id]);

  const validateFile = (file) => {
    if (!file) return false;
    if (file.type !== 'application/pdf') {
      setMsg('❌ Only PDF files are allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg('❌ File must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleCertificates = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFile);
    setCertificates(validFiles);
  };

  const apply = async () => {
    if (!auth.token) return setMsg('⚠️ You must log in to apply.');
    if (!coverFile || !cvFile)
      return setMsg('⚠️ Please upload both cover letter and CV.');
  
    try {
      const formData = new FormData();
      formData.append('jobId', Number(id)); // <-- convert to number
      formData.append('coverLetter', coverFile);
      formData.append('cv', cvFile);
      certificates.forEach((file) => formData.append('certificates', file));
  
      await dispatch(applyJob(formData)).unwrap();
      setMsg('✅ Application submitted successfully!');
      setCoverFile(null);
      setCvFile(null);
      setCertificates([]);
      document.getElementById('coverInput').value = '';
      document.getElementById('cvInput').value = '';
      document.getElementById('certInput').value = '';
    } catch (e) {
      console.error(e);
      setMsg('❌ Error submitting application. Please try again.');
    }
  };
  

  if (!job)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading job details...
      </div>
    );

  const renderFile = (file) => (
    <div className="flex items-center space-x-2 py-1">
      <FiFileText className="text-red-500 w-5 h-5" />
      <span className="text-gray-700">{file.name}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Job Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {job.company} • {job.location}
        </p>
        {job.salary && (
          <p className="text-green-600 font-semibold mt-1">{job.salary}</p>
        )}
      </div>

      {/* Job Description */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Job Description
        </h3>
        <p className="text-gray-600 leading-relaxed">{job.description}</p>
      </div>

      {/* Application Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Apply for this job
        </h3>

        {/* Cover Letter PDF */}
        <label className="block mb-1 font-medium">Cover Letter (PDF)</label>
        <input
          id="coverInput"
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            validateFile(e.target.files[0]) && setCoverFile(e.target.files[0])
          }
          className="mb-2"
        />
        {coverFile && <div>{renderFile(coverFile)}</div>}
        <hr className="my-2 border-gray-300" />

        {/* CV PDF */}
        <label className="block mb-1 font-medium">CV (PDF)</label>
        <input
          id="cvInput"
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            validateFile(e.target.files[0]) && setCvFile(e.target.files[0])
          }
          className="mb-2"
        />
        {cvFile && <div>{renderFile(cvFile)}</div>}
        <hr className="my-2 border-gray-300" />

        {/* Multiple Certificates */}
        <label className="block mb-1 font-medium">
          Certificates (PDF, multiple)
        </label>
        <input
          id="certInput"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleCertificates}
          className="mb-2"
        />
        {certificates.length > 0 && (
          <div>
            {certificates.map((file, idx) => (
              <div key={idx}>{renderFile(file)}</div>
            ))}
          </div>
        )}
        <hr className="my-2 border-gray-300" />

        <button
          onClick={apply}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition w-full md:w-auto"
        >
          Submit Application
        </button>

        {msg && (
          <div
            className={`mt-3 text-sm font-medium ${
              msg.includes('✅')
                ? 'text-green-600'
                : msg.includes('⚠️')
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
