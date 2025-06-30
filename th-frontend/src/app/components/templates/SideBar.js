'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    ListChecks,
    Boxes,
    Tag,
    User,
    LogOut,
    Menu,
    X,
    Home,
    Users
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/',
        icon: Home,
        color: 'text-blue-600 dark:text-blue-400'
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: Boxes,
        color: 'text-purple-600 dark:text-purple-400'
    },
    {
        name: 'Tasks',
        href: '/tasks',
        icon: ListChecks,
        color: 'text-green-600 dark:text-green-400'
    },
    {
        name: 'Resources',
        href: '/resources',
        icon: Tag,
        color: 'text-orange-600 dark:text-orange-400'
    },
    {
        name: 'Community',
        href: '/community',
        icon: Users,
        color: 'text-indigo-600 dark:text-indigo-400'
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: User,
        color: 'text-pink-600 dark:text-pink-400'
    },
];

export default function SideBar({ className }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const handleNavigation = (href) => {
        router.push(href);
        closeSidebar();
    };

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout clicked');
        closeSidebar();
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-50 w-72 sidebar-enhanced transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    TaskHub
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    DIY Project Manager
                                </p>
                            </div>
                        </div>
                        
                        {/* Close button for mobile */}
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                        isActive
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:transform hover:translate-x-1"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-white" : item.color
                                    )} />
                                    <span className="truncate">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">U</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        Welcome User
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Free Plan
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 group"
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:transform group-hover:translate-x-1 transition-transform" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
