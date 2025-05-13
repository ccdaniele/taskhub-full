'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "app/components/templates/Card"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"; 
import Link from 'next/link';


const ProgressBar = ({ value, total, className }) => { 
    const percentage = total === 0 ? 0 : Math.min(100, (value / total) * 100); // Cap at 100%
    return (
        <div className={cn("w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700", className)}>
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default function ProjectsIndex(){
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {

        const response = await fetch('/api/projects/getAllProjects');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.data);
    };


    React.useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="space-y-6">
            {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="text-lg font-bold">${project.budget.toLocaleString()}</p>
                            <ProgressBar value={project.spent} total={project.budget} />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {/* Spent: ${project.spent.toLocaleString()} */}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</p>
                            {/* <p className="text-lg font-bold">{new Date(project.finish).toLocaleDateString()}</p> */}
                            <p className="text-lg font-bold">{project.finish}</p>
                            {/* <ProgressBar value={project.timeLeft} total={180} className="mt-2" /> Assuming a rough max of 180 days for the progress */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {/* Time Left: {project.timeLeft} days */}
                            </p>
                        </div>
                        <Link href={`/projects/${project.id}`} className="btn w-full">
                            View Project <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
