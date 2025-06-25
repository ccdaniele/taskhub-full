'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../templates/Card"
import { Clock, DollarSign, Calendar, Tag, User, Plus, Filter, CheckCircle, AlertCircle, PlayCircle } from "lucide-react"
import { cn } from "../../lib/utils";
import Link from 'next/link';

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
        <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.color)}>
            <Icon className="w-3 h-3 mr-1" />
            {status?.replace('_', ' ').toUpperCase() || 'PENDING'}
        </div>
    );
};

const ProgressBar = ({ value, total, className }) => { 
    const percentage = total === 0 ? 0 : Math.min(100, (value / total) * 100);
    return (
        <div className={cn("w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700", className)}>
            <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default function TasksIndex() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusCounts = () => {
        return {
            all: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            completed: tasks.filter(t => t.status === 'completed').length
        };
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-2 text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage and track your DIY project tasks</p>
                </div>
                <Link href="/tasks/new" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="flex gap-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "btn btn-sm",
                                filter === status ? "btn-primary" : "btn-outline"
                            )}
                        >
                            {status.replace('_', ' ').toUpperCase()} ({count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {searchTerm ? 'No tasks found' : 'No tasks yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchTerm 
                            ? 'Try adjusting your search terms or filters' 
                            : 'Create your first task to get started with your DIY projects'
                        }
                    </p>
                    {!searchTerm && (
                        <Link href="/tasks/new" className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Task
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-semibold line-clamp-2">
                                        {task.name}
                                    </CardTitle>
                                    <StatusBadge status={task.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Time and Cost Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center text-sm">
                                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                        <span>{task.time || 0}h</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                        <span>${task.cost || 0}</span>
                                    </div>
                                </div>

                                {/* Budget Progress */}
                                {(task.cost > 0 || task.spent > 0) && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Budget Progress</span>
                                            <span className="font-medium">
                                                ${task.spent || 0} / ${task.cost || 0}
                                            </span>
                                        </div>
                                        <ProgressBar value={task.spent || 0} total={task.cost || 1} />
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="space-y-2">
                                    {task.starting_at && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>Start: {new Date(task.starting_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {task.ending_at && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>End: {new Date(task.ending_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Public indicator */}
                                {task.public && (
                                    <div className="flex items-center text-sm text-blue-600">
                                        <User className="w-4 h-4 mr-2" />
                                        <span>Public Task</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Link 
                                        href={`/tasks/${task.id}`} 
                                        className="btn btn-sm btn-outline flex-1"
                                    >
                                        View Details
                                    </Link>
                                    <Link 
                                        href={`/tasks/${task.id}/edit`} 
                                        className="btn btn-sm btn-ghost"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
