'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProjectEditPage = ({ projectId, isNew = false }) => {
  const [project, setProject] = useState({
    name: '',
    time: '',
    budget: '',
    starting_at: '',
    ending_at: '',
    deadline: '',
    spent: '',
    status: 'pending',
    public: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!isNew && projectId) {
      fetchProject();
    }
  }, [projectId, isNew]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject({
        name: data.name || '',
        time: data.time || '',
        budget: data.budget || '',
        starting_at: data.starting_at || '',
        ending_at: data.ending_at || '',
        deadline: data.deadline || '',
        spent: data.spent || '',
        status: data.status || 'pending',
        public: data.public ?? true
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!project.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (project.budget && (isNaN(project.budget) || parseFloat(project.budget) < 0)) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    if (project.time && (isNaN(project.time) || parseFloat(project.time) < 0)) {
      newErrors.time = 'Time must be a valid positive number';
    }

    if (project.spent && (isNaN(project.spent) || parseFloat(project.spent) < 0)) {
      newErrors.spent = 'Spent amount must be a valid positive number';
    }

    if (project.starting_at && project.ending_at && new Date(project.starting_at) > new Date(project.ending_at)) {
      newErrors.ending_at = 'End date must be after start date';
    }

    if (project.starting_at && project.deadline && new Date(project.starting_at) > new Date(project.deadline)) {
      newErrors.deadline = 'Deadline must be after start date';
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
      const url = isNew ? 'http://localhost:3000/projects' : `http://localhost:3000/projects/${projectId}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            name: project.name.trim(),
            time: project.time ? parseInt(project.time) : null,
            budget: project.budget ? parseFloat(project.budget) : null,
            starting_at: project.starting_at || null,
            ending_at: project.ending_at || null,
            deadline: project.deadline || null,
            spent: project.spent ? parseFloat(project.spent) : null,
            status: project.status,
            public: project.public
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isNew ? 'create' : 'update'} project`);
      }

      const savedProject = await response.json();
      router.push(`/projects/${savedProject.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getProjectIcon = (status) => {
    const icons = {
      pending: '⏳',
      active: '🚀',
      complete: '✅',
      on_hold: '⏸️'
    };
    return icons[status] || '📋';
  };

  const formatCurrency = (value) => {
    return value ? `$${parseFloat(value).toFixed(2)}` : '$0.00';
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
          <Link href="/projects" className="hover:text-blue-600 transition-colors">
            Projects
          </Link>
          <span>›</span>
          {!isNew && (
            <>
              <Link href={`/projects/${projectId}`} className="hover:text-blue-600 transition-colors">
                Project Details
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900">{isNew ? 'New Project' : 'Edit Project'}</span>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-4xl">{getProjectIcon(project.status)}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Create New Project' : 'Edit Project'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Start a new DIY project' : 'Update project information'}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Details</h2>
          
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                value={project.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., Kitchen Cabinet Refinishing, Backyard Deck Build"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Give your project a descriptive name that clearly identifies what you're building or creating.
              </p>
            </div>

            {/* Budget and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="budget"
                    step="0.01"
                    min="0"
                    value={project.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.budget ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Total budget allocated for this project
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
                  value={project.time}
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
                  Estimated total hours to complete
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
                  value={project.spent}
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
                Amount already spent on this project
              </p>
              {project.budget && project.spent && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Budget Progress</span>
                    <span>{Math.round((parseFloat(project.spent) / parseFloat(project.budget)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        (parseFloat(project.spent) / parseFloat(project.budget)) > 1 
                          ? 'bg-red-500' 
                          : (parseFloat(project.spent) / parseFloat(project.budget)) > 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (parseFloat(project.spent) / parseFloat(project.budget)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="starting_at" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="starting_at"
                  value={project.starting_at}
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
                  value={project.ending_at}
                  onChange={(e) => handleInputChange('ending_at', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ending_at ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.ending_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.ending_at}</p>
                )}
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={project.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.deadline ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
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
                value={project.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="complete">Complete</option>
                <option value="on_hold">On Hold</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Current status of the project
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
                    checked={project.public}
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
                    checked={!project.public}
                    onChange={() => handleInputChange('public', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Private - Only visible to you
                  </span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Choose whether this project should be visible to other users in the community.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href={isNew ? '/projects' : `/projects/${projectId}`}
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
              {saving ? 'Saving...' : (isNew ? 'Create Project' : 'Update Project')}
            </button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium mb-2">💡 Tips for creating projects</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Choose a descriptive name that clearly identifies your DIY project</li>
          <li>• Set a realistic budget and track your spending as you go</li>
          <li>• Break down large projects into smaller, manageable tasks</li>
          <li>• Set achievable deadlines and update your progress regularly</li>
          <li>• Make projects public to inspire and help other DIY enthusiasts</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectEditPage; 
