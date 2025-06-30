'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Lightbulb, HelpCircle, Megaphone, Star, Hash } from 'lucide-react';

const PostTypeSelector = ({ selectedType, onTypeChange }) => {
  const types = [
    { 
      value: 'update', 
      label: 'Project Update', 
      icon: Megaphone, 
      color: 'blue',
      description: 'Share progress on your current project'
    },
    { 
      value: 'showcase', 
      label: 'Showcase', 
      icon: Star, 
      color: 'yellow',
      description: 'Show off your completed work'
    },
    { 
      value: 'question', 
      label: 'Question', 
      icon: HelpCircle, 
      color: 'green',
      description: 'Ask for help or advice'
    },
    { 
      value: 'tip', 
      label: 'Tip', 
      icon: Lightbulb, 
      color: 'purple',
      description: 'Share helpful tips and tricks'
    },
    { 
      value: 'general', 
      label: 'General', 
      icon: Hash, 
      color: 'gray',
      description: 'General discussion and chat'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedType === type.value
                ? `border-${type.color}-500 bg-${type.color}-50`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon className={`w-5 h-5 ${
                selectedType === type.value 
                  ? `text-${type.color}-600` 
                  : 'text-gray-400'
              }`} />
              <span className={`font-medium ${
                selectedType === type.value 
                  ? `text-${type.color}-900` 
                  : 'text-gray-700'
              }`}>
                {type.label}
              </span>
            </div>
            <p className={`text-sm ${
              selectedType === type.value 
                ? `text-${type.color}-700` 
                : 'text-gray-500'
            }`}>
              {type.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

const RelatedItemSelector = ({ postType, selectedItem, onItemChange }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (['update', 'showcase'].includes(postType)) {
      fetchItems();
    }
  }, [postType]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [projectsRes, tasksRes, resourcesRes] = await Promise.all([
        fetch('http://localhost:3000/projects'),
        fetch('http://localhost:3000/tasks'),
        fetch('http://localhost:3000/resources')
      ]);

      const [projectsData, tasksData, resourcesData] = await Promise.all([
        projectsRes.json(),
        tasksRes.json(),
        resourcesRes.json()
      ]);

      setProjects(projectsData);
      setTasks(tasksData);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!['update', 'showcase'].includes(postType)) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Link to Project, Task, or Resource (Optional)
      </label>
      
      {loading ? (
        <div className="text-sm text-gray-500">Loading items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Projects */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Projects</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={`project-${project.id}`}
                  onClick={() => onItemChange('project', project.id)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedItem?.type === 'project' && selectedItem?.id === project.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Tasks</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tasks.map((task) => (
                <button
                  key={`task-${task.id}`}
                  onClick={() => onItemChange('task', task.id)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedItem?.type === 'task' && selectedItem?.id === task.id
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {task.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Resources</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {resources.map((resource) => (
                <button
                  key={`resource-${resource.id}`}
                  onClick={() => onItemChange('resource', resource.id)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedItem?.type === 'resource' && selectedItem?.id === resource.id
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {resource.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="mt-3 flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">
            Selected: <span className="font-medium">{selectedItem.name}</span>
          </span>
          <button
            onClick={() => onItemChange(null, null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function CreatePost({ onPostCreated, onCancel }) {
  const [formData, setFormData] = useState({
    post_type: '',
    title: '',
    content: '',
    public: true
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleItemChange = (type, id) => {
    if (type && id) {
      // Find the item name
      const itemName = `${type} ${id}`; // Simplified for now
      setSelectedItem({ type, id, name: itemName });
    } else {
      setSelectedItem(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.post_type) {
      newErrors.post_type = 'Please select a post type';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const postData = {
        ...formData,
        user_id: 1 // Default user for now
      };

      // Add related item if selected
      if (selectedItem) {
        postData[`${selectedItem.type}_id`] = selectedItem.id;
      }

      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: postData })
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated && onPostCreated(newPost);
        
        // Reset form
        setFormData({
          post_type: '',
          title: '',
          content: '',
          public: true
        });
        setSelectedItem(null);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'Failed to create post' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getTitlePlaceholder = () => {
    switch (formData.post_type) {
      case 'update':
        return 'e.g., "Progress on Kitchen Renovation"';
      case 'showcase':
        return 'e.g., "Completed DIY Bookshelf"';
      case 'question':
        return 'e.g., "Best paint for outdoor furniture?"';
      case 'tip':
        return 'e.g., "How to prevent drill bits from slipping"';
      case 'general':
        return 'e.g., "Weekend project ideas"';
      default:
        return 'Give your post a title...';
    }
  };

  const getContentPlaceholder = () => {
    switch (formData.post_type) {
      case 'update':
        return 'Share your progress, challenges, or next steps...';
      case 'showcase':
        return 'Tell us about your project - what you built, how long it took, any challenges...';
      case 'question':
        return 'Describe your question in detail. The more context you provide, the better help you\'ll get...';
      case 'tip':
        return 'Share your tip, trick, or lesson learned. Include any important details...';
      case 'general':
        return 'What\'s on your mind? Share your thoughts with the community...';
      default:
        return 'What would you like to share?';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Post Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What type of post is this?
          </label>
          <PostTypeSelector
            selectedType={formData.post_type}
            onTypeChange={(type) => handleInputChange('post_type', type)}
          />
          {errors.post_type && (
            <p className="text-red-600 text-sm mt-1">{errors.post_type}</p>
          )}
        </div>

        {/* Related Item Selection */}
        <RelatedItemSelector
          postType={formData.post_type}
          selectedItem={selectedItem}
          onItemChange={handleItemChange}
        />

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={getTitlePlaceholder()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm ml-auto">
              {formData.title.length}/200
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder={getContentPlaceholder()}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={5000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content && (
              <p className="text-red-600 text-sm">{errors.content}</p>
            )}
            <p className="text-gray-500 text-sm ml-auto">
              {formData.content.length}/5000
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.public}
              onChange={(e) => handleInputChange('public', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Make this post public (visible to all community members)
            </span>
          </label>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
