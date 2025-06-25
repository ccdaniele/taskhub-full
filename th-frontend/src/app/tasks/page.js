'use client';

import React from 'react';
import SideBar from 'app/components/templates/SideBar';
import TasksIndex from 'app/components/tasks/TasksIndex';

export default function TasksPage() {
    return (
        <div className="flex min-h-screen bg-base-100">
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Tasks</h1>
                <TasksIndex/>
            </main>
        </div>
    );
}; 
