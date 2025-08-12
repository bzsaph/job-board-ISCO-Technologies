
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, createJob, updateJob, deleteJob } from '../store/slices/jobsSlice';
import { Link } from 'react-router-dom';

export default function AdminJobs() {
  const dispatch = useDispatch();
  const jobs = useSelector(s => s.jobs.list);
  const [form, setForm] = useState({ title:'', company:'', location:'', description:'', requirements:'', salary:'' });
  useEffect(()=>{ dispatch(fetchJobs()); }, [dispatch]);

  const create = async () => {
    await dispatch(createJob(form)).unwrap();
    setForm({ title:'', company:'', location:'', description:'', requirements:'', salary:'' });
  };
  const remove = async (id) => { if (confirm('Delete?')) await dispatch(deleteJob(id)).unwrap(); };
  return (
    <div>
      <h2 className="text-xl">Admin Jobs</h2>
      <div className="mb-4 border p-3">
        <h3>Create</h3>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full border p-1 mb-1"/>
        <input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className="w-full border p-1 mb-1"/>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full border p-1 mb-1"/>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border p-1 mb-1"/>
        <button className="bg-blue-700 text-white px-3 py-1" onClick={create}>Create</button>
      </div>
      <ul>
        {jobs.map(j => (
          <li key={j.id} className="mb-2 p-2 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm">{j.company} • {j.location}</div>
              </div>
              <div>
                <Link className="mr-2 text-sm text-blue-600" to={`/admin/applications/${j.id}`}>Applications</Link>
                <button className="text-red-600" onClick={()=>remove(j.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
