'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ResourceEditPage = ({ resourceId, isNew = false }) => {
  const [resource, setResource] = useState({
    name: '',
    price: '',
    source: '',
    status: 'available',
    public: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!isNew && resourceId) {
      fetchResource();
    }
  }, [resourceId, isNew]);

  const fetchResource = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/resources/${resourceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resource');
      }
      const data = await response.json();
      setResource({
        name: data.name || '',
        price: data.price || '',
        source: data.source || '',
        status: data.status || 'available',
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

    if (!resource.name.trim()) {
      newErrors.name = 'Resource name is required';
    }

    if (resource.price && (isNaN(resource.price) || parseFloat(resource.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number';
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
      const url = isNew ? 'http://localhost:3000/resources' : `http://localhost:3000/resources/${resourceId}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource: {
            name: resource.name.trim(),
            price: resource.price ? parseFloat(resource.price) : null,
            source: resource.source.trim(),
            status: resource.status,
            public: resource.public
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isNew ? 'create' : 'update'} resource`);
      }

      const savedResource = await response.json();
      router.push(`/resources/${savedResource.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setResource(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCategoryIcon = (name) => {
    if (name.includes('Tools') || name.toLowerCase().includes('tool')) return '🔧';
    if (name.includes('Materials') || name.toLowerCase().includes('material')) return '📦';
    if (name.includes('Hardware') || name.toLowerCase().includes('hardware')) return '⚙️';
    if (name.includes('Safety') || name.toLowerCase().includes('safety')) return '🦺';
    return '📋';
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
          <Link href="/resources" className="hover:text-blue-600 transition-colors">
            Resources
          </Link>
          <span>›</span>
          {!isNew && (
            <>
              <Link href={`/resources/${resourceId}`} className="hover:text-blue-600 transition-colors">
                Resource Details
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-900">{isNew ? 'New Resource' : 'Edit Resource'}</span>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-4xl">{getCategoryIcon(resource.name)}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Add New Resource' : 'Edit Resource'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Add a new resource to your catalog' : 'Update resource information'}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resource Details</h2>
          
          <div className="space-y-6">
            {/* Resource Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Name *
              </label>
              <input
                type="text"
                id="name"
                value={resource.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., Circular Saw, Wood Screws, Safety Glasses"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Give your resource a descriptive name. You can include the category (e.g., "Tools: Circular Saw").
              </p>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={resource.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                The cost of this resource. Leave blank if price is not applicable.
              </p>
            </div>

            {/* Source */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={resource.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Home Depot, Amazon, Local Hardware Store"
              />
              <p className="mt-1 text-sm text-gray-500">
                Where you can purchase or obtained this resource.
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={resource.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="used">Used</option>
                <option value="broken">Broken</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Current status of this resource.
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
                    checked={resource.public}
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
                    checked={!resource.public}
                    onChange={() => handleInputChange('public', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Private - Only visible to you
                  </span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Choose whether this resource should be visible to other users in the community.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href={isNew ? '/resources' : `/resources/${resourceId}`}
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
              {saving ? 'Saving...' : (isNew ? 'Create Resource' : 'Update Resource')}
            </button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium mb-2">💡 Tips for adding resources</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Use descriptive names that include the category (Tools, Materials, Hardware, Safety)</li>
          <li>• Include accurate pricing information to help with project budgeting</li>
          <li>• Specify the source to make it easier to purchase again</li>
          <li>• Make resources public to help the community discover useful tools and materials</li>
          <li>• Update the status regularly to keep track of your inventory</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourceEditPage; 
