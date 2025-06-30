'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import SideBar from '../components/templates/SideBar';
import CommunityFeed from '../components/community/CommunityFeed';
import CreatePost from '../components/community/CreatePost';

export default function CommunityPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = (newPost) => {
    setShowCreatePost(false);
    // The feed will refresh automatically
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar />
      
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Create Post Button */}
            {!showCreatePost && (
              <div className="mb-6">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Share with Community</span>
                </button>
              </div>
            )}

            {/* Create Post Form */}
            {showCreatePost && (
              <div className="mb-6">
                <CreatePost
                  onPostCreated={handlePostCreated}
                  onCancel={() => setShowCreatePost(false)}
                />
              </div>
            )}

            {/* Community Feed */}
            <CommunityFeed key={showCreatePost ? 'creating' : 'viewing'} />
          </div>
        </div>
      </main>
    </div>
  );
} 
