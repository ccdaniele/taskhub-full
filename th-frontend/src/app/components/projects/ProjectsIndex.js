'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../templates/Card"
import { ArrowRight, Calendar, DollarSign, Clock, Target, TrendingUp, AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"; 
import Link from 'next/link';

const ProgressBar = ({ value, total, className, label, showPercentage = true }) => { 
    const percentage = total === 0 ? 0 : Math.min(100, (value / total) * 100);
    const isOverBudget = value > total;
    
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
                    {showPercentage && (
                        <span className={cn(
                            "font-semibold",
                            isOverBudget ? "text-red-600" : "text-gray-700 dark:text-gray-300"
                        )}>
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                </div>
            )}
            <div className={cn("progress-enhanced", className)}>
                <div
                    className={cn(
                        "progress-bar",
                        isOverBudget ? "!bg-red-500" : ""
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status = "active", className }) => {
    const statusConfig = {
        active: {
            color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
            icon: Target
        },
        planning: {
            color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
            icon: Clock
        },
        completed: {
            color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
            icon: TrendingUp
        },
        on_hold: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
            icon: AlertCircle
        }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
        <div className={cn("status-badge border", config.color, className)}>
            <Icon className="w-3 h-3 mr-1" />
            {status.replace('_', ' ').toUpperCase()}
        </div>
    );
};

export default function ProjectsIndex(){
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects/getAllProjects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} variant="default">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                    <div className="loading-skeleton h-6 w-3/4"></div>
                                    <div className="loading-skeleton h-4 w-1/2"></div>
                                </div>
                                <div className="loading-skeleton h-6 w-20"></div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="loading-skeleton h-4 w-full"></div>
                                <div className="loading-skeleton h-4 w-full"></div>
                                <div className="loading-skeleton h-10 w-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <Card variant="gradient" className="text-center py-16">
                <CardContent>
                    <div className="mb-6">
                        <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    </div>
                    <CardTitle size="lg" className="mb-4">No Projects Yet</CardTitle>
                    <CardDescription className="text-base mb-6 max-w-md mx-auto">
                        Get started by creating your first DIY project. Organize your tasks, track your budget, and bring your ideas to life!
                    </CardDescription>
                    <Link href="/projects/new" className="btn-enhanced btn-gradient inline-flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Create Your First Project
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid-enhanced">
            {projects.map((project) => (
                <Card key={project.id} variant="default" className="group">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {project.name}
                                </CardTitle>
                                <CardDescription className="mt-1 line-clamp-2">
                                    {project.description}
                                </CardDescription>
                            </div>
                            <StatusBadge status={project.status || 'active'} />
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Budget Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            ${project.budget?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        ${project.spent?.toLocaleString() || '0'}
                                    </p>
                                </div>
                            </div>
                            <ProgressBar 
                                value={project.spent || 0} 
                                total={project.budget || 1}
                                label="Budget Usage"
                            />
                        </div>

                        {/* Timeline Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadline</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {project.finish ? new Date(project.finish).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Not set'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Project Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {project.task_count || 0}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tasks</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {project.completed_tasks || 0}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Done</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {project.resources_count || 0}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Resources</p>
                            </div>
                        </div>
                    </CardContent>
                    
                    <CardFooter>
                        <Link 
                            href={`/projects/${project.id}`} 
                            className="btn-enhanced btn-gradient w-full group/button"
                        >
                            <span>View Project Details</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
