'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ResourcesIndex = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:3000/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      used: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      broken: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status] || statusStyles.available}`}>
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

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.source?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    
    const resourceCategory = getResourceCategory(resource.name);
    const matchesCategory = categoryFilter === 'all' || resourceCategory === categoryFilter;
    
    const matchesPrice = (!priceRange.min || resource.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || resource.price <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading resources</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={fetchResources}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Catalog</h1>
          <p className="text-gray-600">
            Browse and manage your DIY project resources
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/resources/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Resource
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Resources
            </label>
            <input
              type="text"
              placeholder="Search by name or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="used">Used</option>
              <option value="broken">Broken</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Tools">Tools</option>
              <option value="Materials">Materials</option>
              <option value="Hardware">Hardware</option>
              <option value="Safety">Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredResources.length} of {resources.length} resources</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Status: {statusFilter}
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Category: {categoryFilter}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? "Try adjusting your filters to see more resources."
              : "Get started by adding your first resource to the catalog."
            }
          </p>
          <Link 
            href="/resources/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add First Resource
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => {
            const category = getResourceCategory(resource.name);
            const displayName = resource.name.replace(/^[^:]+:\s*/, ''); // Remove category prefix for cleaner display
            
            return (
              <Link 
                key={resource.id} 
                href={`/resources/${resource.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {category}
                      </span>
                    </div>
                    {getStatusBadge(resource.status)}
                  </div>

                  {/* Resource Name */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {displayName}
                  </h3>

                  {/* Price */}
                  <div className="text-2xl font-bold text-green-600 mb-3">
                    {formatPrice(resource.price)}
                  </div>

                  {/* Source */}
                  {resource.source && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="mr-1">🏪</span>
                      <span className="truncate">{resource.source}</span>
                    </div>
                  )}

                  {/* Tags/Associations */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.projects && resource.projects.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {resource.projects.length} project{resource.projects.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {resource.tasks && resource.tasks.length > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {resource.tasks.length} task{resource.tasks.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {resource.public && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>

                  {/* View Details */}
                  <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    View Details →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {resources.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Catalog Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {resources.length}
              </div>
              <div className="text-sm text-gray-600">Total Resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {resources.filter(r => r.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {resources.filter(r => r.status === 'used').length}
              </div>
              <div className="text-sm text-gray-600">In Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {resources.filter(r => r.public).length}
              </div>
              <div className="text-sm text-gray-600">Public</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesIndex; 
