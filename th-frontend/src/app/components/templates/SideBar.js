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
    Home
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/',
        icon: Home,
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: Boxes,
    },
    {
        name: 'Tasks',
        href: '/tasks',
        icon: ListChecks,
    },
    {
        name: 'Resources',
        href: '/resources',
        icon: Tag,
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: User,
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
        closeSidebar(); // Close sidebar on mobile after navigation
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
                className="lg:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-sm"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                    TaskHub
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    DIY Project Manager
                                </p>
                            </div>
                        </div>
                        
                        {/* Close button for mobile */}
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden btn btn-ghost btn-sm"
                            aria-label="Close menu"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-content shadow-sm"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
