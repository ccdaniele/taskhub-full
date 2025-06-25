'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import SideBar from 'app/components/templates/SideBar';
import ProjectsIndex from 'app/components/projects/ProjectsIndex';


export default function HomePage (){

    return (
       <div className="flex min-h-screen bg-base-100">
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Projects</h1>
                <ProjectsIndex/>
            </main>
        </div>
    )
};
