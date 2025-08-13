import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      nav('/');
    } catch (err) {
      alert('Register failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
