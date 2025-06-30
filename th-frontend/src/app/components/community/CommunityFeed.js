'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, User, Calendar, Hash, Lightbulb, HelpCircle, Megaphone, Star } from 'lucide-react';

const PostTypeIcon = ({ type }) => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (type) {
    case 'update':
      return <Megaphone {...iconProps} className="w-4 h-4 text-blue-500" />;
    case 'showcase':
      return <Star {...iconProps} className="w-4 h-4 text-yellow-500" />;
    case 'question':
      return <HelpCircle {...iconProps} className="w-4 h-4 text-green-500" />;
    case 'tip':
      return <Lightbulb {...iconProps} className="w-4 h-4 text-purple-500" />;
    case 'general':
      return <Hash {...iconProps} className="w-4 h-4 text-gray-500" />;
    default:
      return <Hash {...iconProps} className="w-4 h-4 text-gray-500" />;
  }
};

const PostTypeFilter = ({ selectedType, onTypeChange }) => {
  const types = [
    { value: '', label: 'All Posts', color: 'gray' },
    { value: 'update', label: 'Updates', color: 'blue' },
    { value: 'showcase', label: 'Showcases', color: 'yellow' },
    { value: 'question', label: 'Questions', color: 'green' },
    { value: 'tip', label: 'Tips', color: 'purple' },
    { value: 'general', label: 'General', color: 'gray' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeChange(type.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedType === type.value
              ? `bg-${type.color}-100 text-${type.color}-800 border-${type.color}-300 border`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:3000/posts/${post.id}/likes`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: 1 }) // Default user for now
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        setLikesCount(data.likes_count);
        onLike && onLike(post.id, !isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: { content: newComment },
          user_id: 1 // Default user for now
        })
      });

      if (response.ok) {
        setNewComment('');
        onComment && onComment(post.id);
        // Refresh comments by toggling
        setShowComments(false);
        setTimeout(() => setShowComments(true), 100);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getRelatedItemInfo = () => {
    if (post.project) {
      return { type: 'Project', name: post.project.name, color: 'blue' };
    }
    if (post.task) {
      return { type: 'Task', name: post.task.name, color: 'green' };
    }
    if (post.resource) {
      return { type: 'Resource', name: post.resource.name, color: 'purple' };
    }
    return null;
  };

  const relatedItem = getRelatedItemInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {post.user?.username || 'Anonymous'}
              </h3>
              <div className="flex items-center space-x-1">
                <PostTypeIcon type={post.post_type} />
                <span className="text-sm text-gray-500 capitalize">{post.post_type}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Item */}
      {relatedItem && (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${relatedItem.color}-100 text-${relatedItem.color}-800 mb-3`}>
          <span className="mr-1">{relatedItem.type}:</span>
          <span>{relatedItem.name}</span>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
              isLiked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments_count || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Add Comment */}
          <div className="flex space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedType]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = selectedType 
        ? `http://localhost:3000/posts?type=${selectedType}`
        : 'http://localhost:3000/posts';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId, liked) => {
    // Optimistic update handled in PostCard
  };

  const handleComment = (postId) => {
    // Refresh the specific post or entire feed
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <MessageCircle className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-semibold">Unable to load community feed</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchPosts}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Feed</h1>
        <p className="text-gray-600">
          Connect with fellow DIY enthusiasts, share your projects, and get inspired!
        </p>
      </div>

      {/* Filters */}
      <PostTypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">
            {selectedType 
              ? `No ${selectedType} posts found. Try a different filter.`
              : 'Be the first to share something with the community!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
