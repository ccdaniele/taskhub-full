'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/templates/Card";
import { 
    Clock, DollarSign, Calendar, Tag, User, Edit, Trash2, 
    CheckCircle, AlertCircle, PlayCircle, ArrowLeft, Settings,
    Boxes, Wrench
} from "lucide-react";
import { cn } from "../../lib/utils";
import Link from 'next/link';
import SideBar from '../../components/templates/SideBar';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            icon: AlertCircle 
        },
        in_progress: { 
            color: 'bg-blue-100 text-blue-800 border-blue-200', 
            icon: PlayCircle 
        },
        completed: { 
            color: 'bg-green-100 text-green-800 border-green-200', 
            icon: CheckCircle 
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border", config.color)}>
            <Icon className="w-4 h-4 mr-2" />
            {status?.replace('_', ' ').toUpperCase() || 'PENDING'}
        </div>
    );
};

const ProgressBar = ({ value, total, className }) => { 
    const percentage = total === 0 ? 0 : Math.min(100, (value / total) * 100);
    return (
        <div className={cn("w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700", className)}>
            <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [resources, setResources] = useState([]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/tasks/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task');
            }
            const data = await response.json();
            setTask(data);
        } catch (error) {
            console.error('Error fetching task:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const response = await fetch(`http://localhost:3000/tasks/${params.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.push('/tasks');
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    const updateTaskStatus = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: { status: newStatus } })
            });
            if (response.ok) {
                const updatedTask = await response.json();
                setTask(updatedTask);
            } else {
                throw new Error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status');
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchTask();
            // TODO: Fetch associated projects and resources
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-base-100">
                <SideBar />
                <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg"></div>
                            <p className="mt-2 text-gray-600">Loading task details...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="flex min-h-screen bg-base-100">
                <SideBar />
                <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Task not found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            The task you're looking for doesn't exist or couldn't be loaded.
                        </p>
                        <Link href="/tasks" className="btn btn-primary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Tasks
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-base-100">
            <SideBar />
            <main className="flex-1 lg:ml-0 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/tasks" className="btn btn-ghost btn-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{task.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">Task Details</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/tasks/${task.id}/edit`} className="btn btn-outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                        <button onClick={deleteTask} className="btn btn-error btn-outline">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Task Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status and Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">Task Information</CardTitle>
                                    <StatusBadge status={task.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Quick Status Update */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Update Status:
                                    </p>
                                    <div className="flex gap-2">
                                        {['pending', 'in_progress', 'completed'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => updateTaskStatus(status)}
                                                className={cn(
                                                    "btn btn-sm",
                                                    task.status === status ? "btn-primary" : "btn-outline"
                                                )}
                                            >
                                                {status.replace('_', ' ').toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time and Cost */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">Estimated Time</span>
                                        </div>
                                        <p className="text-2xl font-bold">{task.time || 0} hours</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">Budget</span>
                                        </div>
                                        <p className="text-2xl font-bold">${task.cost || 0}</p>
                                    </div>
                                </div>

                                {/* Budget Progress */}
                                {(task.cost > 0 || task.spent > 0) && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Budget Progress
                                            </span>
                                            <span className="font-bold">
                                                ${task.spent || 0} / ${task.cost || 0}
                                            </span>
                                        </div>
                                        <ProgressBar value={task.spent || 0} total={task.cost || 1} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {task.cost > 0 
                                                ? `${Math.round(((task.spent || 0) / task.cost) * 100)}% of budget used`
                                                : 'No budget set'
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {task.starting_at && (
                                        <div>
                                            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">Start Date</span>
                                            </div>
                                            <p className="font-semibold">
                                                {new Date(task.starting_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {task.ending_at && (
                                        <div>
                                            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">End Date</span>
                                            </div>
                                            <p className="font-semibold">
                                                {new Date(task.ending_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Public indicator */}
                                {task.public && (
                                    <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <User className="w-5 h-5 mr-3 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                                Public Task
                                            </p>
                                            <p className="text-sm text-blue-700 dark:text-blue-200">
                                                This task is visible to other users in the community
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Associated Projects */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Boxes className="w-5 h-5 mr-2" />
                                    Associated Projects
                                </CardTitle>
                                <CardDescription>
                                    Projects that include this task
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {projects.length > 0 ? (
                                    <div className="space-y-2">
                                        {projects.map((project) => (
                                            <Link
                                                key={project.id}
                                                href={`/projects/${project.id}`}
                                                className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <p className="font-medium">{project.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {project.description}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Boxes className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            This task is not assigned to any project yet
                                        </p>
                                        <Link href="/projects" className="btn btn-sm btn-outline mt-2">
                                            Browse Projects
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link 
                                    href={`/tasks/${task.id}/edit`} 
                                    className="btn btn-outline w-full justify-start"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Task
                                </Link>
                                <button 
                                    onClick={deleteTask}
                                    className="btn btn-error btn-outline w-full justify-start"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Task
                                </button>
                            </CardContent>
                        </Card>

                        {/* Resources */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Wrench className="w-5 h-5 mr-2" />
                                    Resources
                                </CardTitle>
                                <CardDescription>
                                    Tools and materials for this task
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {resources.length > 0 ? (
                                    <div className="space-y-2">
                                        {resources.map((resource) => (
                                            <div
                                                key={resource.id}
                                                className="p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                            >
                                                <p className="font-medium text-sm">{resource.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    ${resource.price || 0}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Wrench className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            No resources assigned yet
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Task Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Task Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                    <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Visibility:</span>
                                    <span>{task.public ? 'Public' : 'Private'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 
