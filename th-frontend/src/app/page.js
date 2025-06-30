'use client';

import React from 'react';
import SideBar from './components/templates/SideBar'
import UserHomePage from './components/user/UserHomePage';

const MainPage = () => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-6 md:p-8 lg:p-10 pt-20 lg:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                            Welcome to TaskHub
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Your all-in-one DIY project management solution. Organize, track, and complete your projects with ease. Now with community features!
                        </p>
                        
                        {/* Community Highlight */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                    🎉 New Feature
                                </span>
                                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Community Feed</span>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Connect with fellow DIY enthusiasts! Share your projects, ask questions, and get inspired by the community.
                            </p>
                        </div>
                    </div>
                    
                    {/* User Homepage Content */}
                    <UserHomePage />
                </div>
            </main>
        </div>
    );
};

export default MainPage;
