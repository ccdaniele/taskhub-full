'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../templates/Card"; // Adjusted import
import { useRouter } from 'next/navigation';


export default function UserHomePage() {
    const router = useRouter();
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Welcome Card */}
                <Card className=""> {/* Added className for background */}
                    <CardHeader>
                        <CardTitle>Welcome Back, [User Name]</CardTitle>
                        <CardDescription>Here's an overview of your recent activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>You can quickly access your projects, tasks, and resources below.</p>
                        {/*You can also pass children*/}
                        <p> Some extra content </p>
                        <div className="mt-4 flex gap-4">
                            <button key="projects" className="btn btn-primary" onClick={() => router.push('/projects')} >Go to Projects</button>
                            <button key="tasks" className="btn btn-outline">View Tasks</button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Stats</CardTitle>
                        <CardDescription>Your project statistics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Active Projects
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Completed Tasks
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Resources
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Your Tags
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Performance Overview */}
            <Card className="mt-8 bg-base-100 shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Your Performance</CardTitle>
                    <CardDescription>Overview of your project performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for the chart */}
                    <div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">Chart Placeholder</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
