
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicationsForJob, updateApplicationStatus } from '../store/slices/applicationsSlice';

export default function AdminApplications(){
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const apps = useSelector(s => s.applications.list);

  useEffect(()=>{ if (jobId) dispatch(getApplicationsForJob(jobId)); }, [dispatch, jobId]);

  const setStatus = (id, status) => dispatch(updateApplicationStatus({ id, status }));

  return (
    <div>
      <h2 className="text-xl mb-2">Applications for job {jobId}</h2>
      <ul>
        {apps.map(a => (
          <li key={a.id} className="mb-3 p-3 border rounded">
            <div className="font-semibold">{a.applicantEmail}</div>
            <div className="text-sm mb-2">{a.coverLetter}</div>
            <div className="mb-2">Status: <strong>{a.status}</strong></div>
            <div>
              <button className="mr-2" onClick={()=>setStatus(a.id,'reviewed')}>Mark Reviewed</button>
              <button className="mr-2" onClick={()=>setStatus(a.id,'accepted')}>Accept</button>
              <button onClick={()=>setStatus(a.id,'rejected')}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
