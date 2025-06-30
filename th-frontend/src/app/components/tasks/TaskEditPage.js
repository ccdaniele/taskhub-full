'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TaskEditPage = ({ taskId, isNew = false }) => {
  const [task, setTask] = useState({
    name: '',
    time: '',
    cost: '',
    starting_at: '',
    ending_at: '',
    spent: '',
    status: 'pending',
    public: true
  });
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
    if (!isNew && taskId) {
      fetchTask();
    }
  }, [taskId, isNew]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      setTask({
        name: data.name || '',
        time: data.time || '',
        cost: data.cost || '',
        starting_at: data.starting_at || '',
        ending_at: data.ending_at || '',
        spent: data.spent || '',
        status: data.status || 'pending',
        public: data.public ?? true
      });
      
      // Set selected project if task has projects
      if (data.projects && data.projects.length > 0) {
        setSelectedProject(data.projects[0].id.toString());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!task.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (task.cost && (isNaN(task.cost) || parseFloat(task.cost) < 0)) {
      newErrors.cost = 'Cost must be a valid positive number';
    }

    if (task.time && (isNaN(task.time) || parseFloat(task.time) < 0)) {
      newErrors.time = 'Time must be a valid positive number';
    }

    if (task.spent && (isNaN(task.spent) || parseFloat(task.spent) < 0)) {
      newErrors.spent = 'Spent amount must be a valid positive number';
    }

    if (task.starting_at && task.ending_at && new Date(task.starting_at) > new Date(task.ending_at)) {
      newErrors.ending_at = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? 'http://localhost:3000/tasks' : `http://localhost:3000/tasks/${taskId}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: {
            name: task.name.trim(),
            time: task.time ? parseInt(task.time) : null,
            cost: task.cost ? parseFloat(task.cost) : null,
            starting_at: task.starting_at || null,
            ending_at: task.ending_at || null,
            spent: task.spent ? parseFloat(task.spent) : null,
            status: task.status,
            public: task.public
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isNew ? 'create' : 'update'} task`);
      }

      const savedTask = await response.json();
      
      // Associate with project if selected
      if (selectedProject && isNew) {
        try {
          await fetch('http://localhost:3000/project_tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              project_task: {
                project_id: parseInt(selectedProject),
                task_id: savedTask.id
              }
            }),
          });
        } catch (err) {
          console.error('Failed to associate task with project:', err);
        }
      }
      
      router.push(`/tasks/${savedTask.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTask(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTaskIcon = (status) => {
    const icons = {
      pending: '⏳',
      in_progress: '🔄',
      completed: '✅',
      on_hold: '⏸️'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/tasks" className="hover:text-blue-600 transition-colors">
            Tasks
          </Link>
          <span>›</span>
          {!isNew && (
            <>
              <Link href={`/tasks/${taskId}`} className="hover:text-blue-600 transition-colors">
                Task Details
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900">{isNew ? 'New Task' : 'Edit Task'}</span>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-4xl">{getTaskIcon(task.status)}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Create New Task' : 'Edit Task'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Add a new task to your project' : 'Update task information'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Details</h2>
          
          <div className="space-y-6">
            {/* Task Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                id="name"
                value={task.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., Sand cabinet doors, Install electrical outlet"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Describe what needs to be done in this task.
              </p>
            </div>

            {/* Cost and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="cost"
                    step="0.01"
                    min="0"
                    value={task.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cost ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Estimated cost for materials and tools
                </p>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Time (hours)
                </label>
                <input
                  type="number"
                  id="time"
                  min="0"
                  value={task.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="0"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Estimated hours to complete this task
                </p>
              </div>
            </div>

            {/* Spent Amount */}
            <div>
              <label htmlFor="spent" className="block text-sm font-medium text-gray-700 mb-2">
                Amount Spent
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="spent"
                  step="0.01"
                  min="0"
                  value={task.spent}
                  onChange={(e) => handleInputChange('spent', e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.spent ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.spent && (
                <p className="mt-1 text-sm text-red-600">{errors.spent}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Amount already spent on this task
              </p>
              {task.cost && task.spent && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Budget Progress</span>
                    <span>{Math.round((parseFloat(task.spent) / parseFloat(task.cost)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        (parseFloat(task.spent) / parseFloat(task.cost)) > 1 
                          ? 'bg-red-500' 
                          : (parseFloat(task.spent) / parseFloat(task.cost)) > 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (parseFloat(task.spent) / parseFloat(task.cost)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="starting_at" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="starting_at"
                  value={task.starting_at}
                  onChange={(e) => handleInputChange('starting_at', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="ending_at" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="ending_at"
                  value={task.ending_at}
                  onChange={(e) => handleInputChange('ending_at', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ending_at ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.ending_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.ending_at}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={task.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Current status of the task
              </p>
            </div>

            {/* Project Assignment */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Project
              </label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No project selected</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Optionally assign this task to a project
              </p>
            </div>

            {/* Public/Private */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    checked={task.public}
                    onChange={() => handleInputChange('public', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Public - Visible to the community
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!task.public}
                    onChange={() => handleInputChange('public', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Private - Only visible to you
                  </span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Choose whether this task should be visible to other users in the community.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href={isNew ? '/tasks' : `/tasks/${taskId}`}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Cancel
          </Link>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Saving...' : (isNew ? 'Create Task' : 'Update Task')}
            </button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium mb-2">💡 Tips for creating tasks</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Break down complex work into smaller, manageable tasks</li>
          <li>• Set realistic time and cost estimates based on your skill level</li>
          <li>• Assign tasks to projects to keep your work organized</li>
          <li>• Update the status regularly to track your progress</li>
          <li>• Share public tasks to help others learn from your experience</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskEditPage; 
