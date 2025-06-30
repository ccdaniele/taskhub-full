'use client';

import React from 'react';
import SideBar from 'app/components/templates/SideBar';
import TasksIndex from 'app/components/tasks/TasksIndex';
import { ListChecks } from 'lucide-react';

export default function TasksPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-6 md:p-8 lg:p-10 pt-20 lg:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-lg">
                                <ListChecks className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gradient">Your Tasks</h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Stay organized and complete your project tasks efficiently
                        </p>
                    </div>
                    
                    {/* Tasks Content */}
                    <TasksIndex />
                </div>
            </main>
        </div>
    );
} 
