'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../templates/Card";
import { useRouter } from 'next/navigation';
import { TrendingUp, Calendar, Target, Award, ArrowRight, Plus } from 'lucide-react';

export default function UserHomePage() {
    const router = useRouter();
    
    const stats = [
        { 
            label: 'Active Projects', 
            value: '4', 
            icon: Target, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            change: '+2 this month'
        },
        { 
            label: 'Completed Tasks', 
            value: '18', 
            icon: Award, 
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            change: '+5 this week'
        },
        { 
            label: 'Total Resources', 
            value: '32', 
            icon: TrendingUp, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            change: '+8 recently'
        },
        { 
            label: 'Your Tags', 
            value: '6', 
            icon: Calendar, 
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            change: 'Organized'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <Card variant="gradient" className="lg:col-span-2 overflow-hidden">
                    <CardHeader>
                        <CardTitle size="lg">Welcome Back! 👋</CardTitle>
                        <CardDescription>Ready to tackle your DIY projects? Here's your activity overview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            You're making great progress on your projects. Keep up the momentum and turn your ideas into reality!
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                className="btn-enhanced btn-gradient flex items-center gap-2" 
                                onClick={() => router.push('/projects')}
                            >
                                <Target className="w-4 h-4" />
                                Go to Projects
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button 
                                className="btn-enhanced bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2" 
                                onClick={() => router.push('/tasks')}
                            >
                                <Plus className="w-4 h-4" />
                                New Task
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card variant="elevated">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Jump to your most used features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <button 
                                onClick={() => router.push('/projects/new')}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                            >
                                <div className="p-2 rounded-lg bg-blue-500 text-white">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">New Project</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Start fresh</p>
                                </div>
                            </button>
                            <button 
                                onClick={() => router.push('/tasks')}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                            >
                                <div className="p-2 rounded-lg bg-green-500 text-white">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">View Tasks</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Due soon</p>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} variant="default" className="hover:scale-105 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Performance Overview */}
            <Card variant="default" className="overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle size="lg">Your Performance</CardTitle>
                            <CardDescription>Track your project completion and productivity trends</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Projects</span>
                            <div className="w-3 h-3 rounded-full bg-green-500 ml-4"></div>
                            <span>Tasks</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Enhanced Chart Placeholder */}
                    <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                            }}></div>
                        </div>
                        
                        {/* Chart Content */}
                        <div className="relative z-10 text-center">
                            <div className="mb-4">
                                <TrendingUp className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Analytics Coming Soon
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                We're preparing beautiful charts to help you visualize your project progress and productivity trends.
                            </p>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"></div>
                        <div className="absolute top-1/2 left-8 w-6 h-6 bg-green-200 dark:bg-green-800 rounded-full opacity-20"></div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Last updated: Just now</span>
                        <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            View detailed analytics →
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
