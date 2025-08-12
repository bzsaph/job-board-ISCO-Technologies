
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ email:'', password:'', firstName:'', lastName:''});
  const dispatch = useDispatch();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      nav('/');
    } catch (err) { alert('Register failed'); }
  };
  return (
    <form onSubmit={submit} className="max-w-md">
      <input className="w-full border p-2 mb-2" placeholder="First name" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/>
      <input className="w-full border p-2 mb-2" placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/>
      <input className="w-full border p-2 mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="w-full border p-2 mb-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="bg-green-600 text-white px-3 py-1">Register</button>
    </form>
  );
}
