'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ResourceDetailPage = ({ resourceId }) => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`http://localhost:3000/resources/${resourceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resource');
      }
      const data = await response.json();
      setResource(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateResourceStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3000/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource: { status: newStatus }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update resource status');
      }

      const updatedResource = await response.json();
      setResource(updatedResource);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteResource = async () => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3000/resources/${resourceId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete resource');
        }

        router.push('/resources');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      used: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      broken: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyles[status] || statusStyles.available}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Available'}
      </span>
    );
  };

  const getResourceCategory = (name) => {
    if (name.includes('Tools:')) return 'Tools';
    if (name.includes('Materials:')) return 'Materials';
    if (name.includes('Hardware:')) return 'Hardware';
    if (name.includes('Safety:')) return 'Safety';
    return 'Other';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Tools: '🔧',
      Materials: '📦',
      Hardware: '⚙️',
      Safety: '🦺',
      Other: '📋'
    };
    return icons[category];
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : 'Price not set';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">Error loading resource</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <div className="mt-4 space-x-3">
            <button 
              onClick={fetchResource}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/resources"
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource not found</h2>
        <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/resources"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Resources
        </Link>
      </div>
    );
  }

  const category = getResourceCategory(resource.name);
  const displayName = resource.name.replace(/^[^:]+:\s*/, '');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/resources" className="hover:text-blue-600 transition-colors">
            Resources
          </Link>
          <span>›</span>
          <span className="text-gray-900">{displayName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <span className="text-4xl">{getCategoryIcon(category)}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-600 text-lg">{category}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getStatusBadge(resource.status)}
            {resource.public && (
              <span className="px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                Public
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resource Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(resource.price)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <span>🏪</span>
                  <span>{resource.source || 'Not specified'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(resource.status)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <div className="text-gray-900">
                  {resource.public ? 'Public (visible to community)' : 'Private (only you can see)'}
                </div>
              </div>
            </div>
          </div>

          {/* Associated Projects */}
          {resource.projects && resource.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Associated Projects ({resource.projects.length})
              </h2>
              <div className="space-y-3">
                {resource.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          Budget: ${project.budget} • Status: {project.status}
                        </p>
                      </div>
                      <span className="text-blue-600">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Associated Tasks */}
          {resource.tasks && resource.tasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Associated Tasks ({resource.tasks.length})
              </h2>
              <div className="space-y-3">
                {resource.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600">
                          Cost: ${task.cost} • Status: {task.status}
                        </p>
                      </div>
                      <span className="text-blue-600">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/resources/${resource.id}/edit`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
              >
                Edit Resource
              </Link>

              {/* Status Update Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Update Status:</p>
                <div className="space-y-2">
                  {['available', 'used', 'broken'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateResourceStatus(status)}
                      disabled={isUpdating || resource.status === status}
                      className={`w-full px-3 py-2 text-sm rounded border transition-colors ${
                        resource.status === status
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {isUpdating ? 'Updating...' : `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={deleteResource}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Resource
              </button>
            </div>
          </div>

          {/* Resource Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projects</span>
                <span className="font-medium">{resource.projects?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tasks</span>
                <span className="font-medium">{resource.tasks?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tags</span>
                <span className="font-medium">{resource.tags?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Related Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage; 
