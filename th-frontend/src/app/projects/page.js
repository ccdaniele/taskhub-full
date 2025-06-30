'use client';

import React from 'react';
import SideBar from 'app/components/templates/SideBar';
import ProjectsIndex from 'app/components/projects/ProjectsIndex';
import { Boxes, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-6 md:p-8 lg:p-10 pt-20 lg:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                                    <Boxes className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-gradient">Your Projects</h1>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Manage and track all your DIY projects in one place
                            </p>
                        </div>
                        
                        <Link 
                            href="/projects/new" 
                            className="btn-enhanced btn-gradient flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </Link>
                    </div>
                    
                    {/* Projects Content */}
                    <ProjectsIndex />
                </div>
            </main>
        </div>
    );
}
