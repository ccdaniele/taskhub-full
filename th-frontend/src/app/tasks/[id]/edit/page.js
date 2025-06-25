'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import SideBar from '../../../components/templates/SideBar';

export default function EditTaskPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
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
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // Fetch task data
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/tasks/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch task');
                }
                const task = await response.json();
                
                // Format dates for input fields
                const formatDate = (dateString) => {
                    if (!dateString) return '';
                    return new Date(dateString).toISOString().split('T')[0];
                };

                setForm({
                    name: task.name || '',
                    time: task.time || '',
                    cost: task.cost || '',
                    public: task.public || false,
                    starting_at: formatDate(task.starting_at),
                    ending_at: formatDate(task.ending_at),
                    spent: task.spent || '',
                    status: task.status || ''
                });
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Failed to load task data');
            } finally {
                setLoading(false);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3000/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };

        if (params.id) {
            fetchTask();
            fetchProjects();
        }
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            
            const response = await fetch(`http://localhost:3000/tasks/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: form })
            });

            if (response.ok) {
                router.push(`/tasks/${params.id}`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            setError('An error occurred while updating the task');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-base-100">
                <SideBar />
                <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg"></div>
                            <p className="mt-2 text-gray-600">Loading task data...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-base-100">
            <SideBar />
            <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href={`/tasks/${params.id}`} className="btn btn-ghost btn-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
                        <p className="text-gray-600 dark:text-gray-400">Update task information</p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="card bg-white dark:bg-gray-800 shadow-lg">
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-error mb-4">
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Task Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Task Name</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter task name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Time and Cost */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Estimated Time (hours)</span>
                                        </label>
                                        <input
                                            name="time"
                                            type="number"
                                            placeholder="0"
                                            value={form.time}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Budget ($)</span>
                                        </label>
                                        <input
                                            name="cost"
                                            type="number"
                                            placeholder="0"
                                            value={form.cost}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {/* Spent and Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Amount Spent ($)</span>
                                        </label>
                                        <input
                                            name="spent"
                                            type="number"
                                            placeholder="0"
                                            value={form.spent}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Status</span>
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="select select-bordered w-full"
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Start Date</span>
                                        </label>
                                        <input
                                            name="starting_at"
                                            type="date"
                                            value={form.starting_at}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">End Date</span>
                                        </label>
                                        <input
                                            name="ending_at"
                                            type="date"
                                            value={form.ending_at}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>

                                {/* Public Task Checkbox */}
                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3">
                                        <input
                                            name="public"
                                            type="checkbox"
                                            checked={form.public}
                                            onChange={handleChange}
                                            className="checkbox checkbox-primary"
                                        />
                                        <div>
                                            <span className="label-text font-medium">Public Task</span>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Allow other users to see this task in the community
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Project Assignment */}
                                {projects.length > 0 && (
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Assign to Project</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={selectedProject || ''}
                                            onChange={(e) => setSelectedProject(e.target.value)}
                                        >
                                            <option value="">Select a project (optional)</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="label">
                                            <span className="label-text-alt text-gray-500">
                                                You can assign this task to a project for better organization
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn btn-primary flex-1"
                                    >
                                        {saving ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm mr-2"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href={`/tasks/${params.id}`}
                                        className="btn btn-outline"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 
