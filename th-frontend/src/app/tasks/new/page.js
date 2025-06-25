'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTask() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    time: '',
    cost: '',
    public: false,
    starting_at: '',
    ending_at: '',
    spent: '',
    status: ''
  });
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects
    useEffect(() => {
      fetch('http://localhost:3000/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error('Failed to load projects', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: form })
      });

      if (res.ok) {
        const newTask = await res.json();
        setMessage('Task successfully created!');
        setTimeout(() => {
          router.push(`/tasks/${newTask.id}`);
        }, 1500);
      } else {
        setMessage('Failed to create task.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-white shadow-md w-full max-w-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        {message && <div className="alert alert-info text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} className="input input-bordered w-full" required />

          <input name="time" type="number" placeholder="Time (in hours)" value={form.time} onChange={handleChange} className="input input-bordered w-full" required />

          <input name="cost" type="number" placeholder="Cost ($)" value={form.cost} onChange={handleChange} className="input input-bordered w-full" required />

          <input name="spent" type="number" placeholder="Spent ($)" value={form.spent} onChange={handleChange} className="input input-bordered w-full" />

          <select name="status" value={form.status} onChange={handleChange} className="select select-bordered w-full" required>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <input name="starting_at" type="date" value={form.starting_at} onChange={handleChange} className="input input-bordered w-full" required />

          <input name="ending_at" type="date" value={form.ending_at} onChange={handleChange} className="input input-bordered w-full" required />

          <label className="label cursor-pointer justify-start gap-3">
            <input name="public" type="checkbox" checked={form.public} onChange={handleChange} className="checkbox checkbox-primary" />
            <span className="label-text">Public Task</span>
          </label>
          <label className="form-control w-full max-w-md mt-6">
            <div className="label">
              <span className="label-text">Assign to Project</span>
            </div>
            <select
              className="select select-bordered"
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          

          <button type="submit" className="btn btn-primary w-full">Create Task</button>
        </form>
      </div>
    </div>
  );
}
