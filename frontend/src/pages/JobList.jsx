
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/slices/jobsSlice';
import { Link } from 'react-router-dom';

export default function JobList(){
  const dispatch = useDispatch();
  const jobs = useSelector(s => s.jobs.list);
  const [q, setQ] = useState({ title:'', location:'' });

  useEffect(()=>{ dispatch(fetchJobs()); }, [dispatch]);

  const search = () => {
    const params = [];
    if (q.title) params.push(`title=${encodeURIComponent(q.title)}`);
    if (q.location) params.push(`location=${encodeURIComponent(q.location)}`);
    dispatch(fetchJobs(params.length ? `?${params.join('&')}` : ''));
  };

  return (
    <div>
      <h2 className="text-2xl mb-2">Jobs</h2>
      <div className="mb-4">
        <input className="border p-1 mr-2" placeholder="title" value={q.title} onChange={e=>setQ({...q,title:e.target.value})}/>
        <input className="border p-1 mr-2" placeholder="location" value={q.location} onChange={e=>setQ({...q,location:e.target.value})}/>
        <button className="bg-blue-600 text-white px-3 py-1" onClick={search}>Search</button>
      </div>
      <ul>
        {jobs.map(j => <li key={j.id} className="mb-2 border p-2 rounded">
          <Link to={`/jobs/${j.id}`} className="font-semibold">{j.title}</Link>
          <div className="text-sm text-gray-600">{j.company} • {j.location}</div>
        </li>)}
      </ul>
    </div>
  );
}
