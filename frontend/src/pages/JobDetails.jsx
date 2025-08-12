
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJob } from '../store/slices/jobsSlice';
import { applyJob } from '../store/slices/applicationsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function JobDetails(){
  const { id } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(s => s.jobs.current);
  const auth = useSelector(s => s.auth);
  const [cover, setCover] = useState('');
  const [cv, setCv] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=>{ dispatch(fetchJob(id)); }, [dispatch, id]);

  const apply = async () => {
    if (!auth.token) return setMsg('You must log in');
    try {
      await dispatch(applyJob({ jobId: parseInt(id), coverLetter: cover, cvLink: cv })).unwrap();
      setMsg('Applied successfully');
    } catch (e) {
      setMsg('Error applying');
    }
  };

  if (!job) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-xl">{job.title}</h2>
      <p className="mb-4">{job.description}</p>
      <div className="mb-4">
        <h3 className="font-semibold">Apply</h3>
        <textarea value={cover} onChange={e=>setCover(e.target.value)} className="w-full border p-2 mb-2" placeholder="Cover letter"/>
        <input value={cv} onChange={e=>setCv(e.target.value)} placeholder="CV link" className="w-full border p-2 mb-2"/>
        <button className="bg-green-600 text-white px-3 py-1" onClick={apply}>Submit Application</button>
        <div className="mt-2 text-sm">{msg}</div>
      </div>
    </div>
  );
}
