
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:''});
  const dispatch = useDispatch();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      nav('/');
    } catch (err) {
      alert('Login failed');
    }
  };
  return (
    <form onSubmit={submit} className="max-w-md">
      <input className="w-full border p-2 mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="w-full border p-2 mb-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="bg-blue-600 text-white px-3 py-1">Login</button>
    </form>
  );
}
