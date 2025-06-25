'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import SideBar from 'app/components/templates/SideBar';


// Temporary data for tags and resources
const tags = ['Urgent', 'Internal', 'Design'];
const resources = [
  { id: 1, name: 'AWS EC2' },
  { id: 2, name: 'PostgreSQL' },
  { id: 3, name: 'Figma' }
];

export default function Project({ project }) {

  // Set Tasks after fetching from the server
  const initialTasks = project.tasks;

  
  const [tasks, setTasks] = useState(initialTasks);


  // Drag and Drop Handlers
 const handleDragStart = (e, taskId) => {
  e.dataTransfer.setData("text/plain", taskId);
};

const handleDrop = (e, status) => {
  e.preventDefault();
  const taskId = parseInt(e.dataTransfer.getData("text/plain"));
  setTasks(prev =>
    prev.map(t =>
      t.id === taskId ? { ...t, status } : t
    )
  );
};

  const handleDragOver = (e) => e.preventDefault();


  // Group tasks by status
  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  // Calculate progress percentages based on the tasks Status
  const taskCompletionPercent = Math.round((groupedTasks.completed.length / tasks.length) * 100);
  
  
   // Displays the budget used percentage
  const budgetUsedPercent = Math.round((project.spent / project.budget) * 100);


const deadlineDate = new Date(project.deadline); // works with RFC2822 format
const formattedDeadline = deadlineDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

const today = new Date();
const totalDuration = (deadlineDate - new Date(today.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24);
const elapsed = (today - new Date(today.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24);
const timeProgress = Math.round((elapsed / totalDuration) * 100);

let deadlineColor = 'badge-success';
if (timeProgress > 75) {
  deadlineColor = 'badge-error';
} else if (timeProgress > 50) {
  deadlineColor = 'badge-warning';
}
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100">
      {/* Left Sidebar */}
      <aside className="w-full md:w-1/5 bg-base-200 p-4">
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <div className={`badge ${deadlineColor} p-3 text-white`}>
            Deadline: {formattedDeadline}
          </div>
        </div>

        {/* Progress Bars */}
        <div>
          <p className="font-semibold mb-1">Budget Used: {budgetUsedPercent}%</p>
          <progress className="progress progress-primary w-full" value={budgetUsedPercent} max="100"></progress>
        </div>
        <div>
          <p className="font-semibold mb-1">Tasks Completed: {taskCompletionPercent}%</p>
          <progress className="progress progress-secondary w-full" value={taskCompletionPercent} max="100"></progress>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tags</h2>
            <Link href="/tags/new" className="btn btn-secondary btn-xs">+ New Tag</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div key={index} className="badge badge-outline">{tag}</div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Resources</h2>
            <Link href="/resources/new" className="btn btn-accent btn-xs">+ New Resource</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {resources.map((res) => (
              <div key={res.id} className="badge badge-accent">{res.name}</div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Link href="/tasks/new" className="btn btn-primary btn-xs">+ New Task</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['pending', 'in_progress', 'completed'].map((status) => (
              <div
                key={status}
                onDrop={(e) => handleDrop(e, status)}
                onDragOver={handleDragOver}
                className="bg-base-200 p-4 rounded shadow min-h-[300px]"
              >
                <h3 className="text-xl font-bold capitalize mb-4">{status.replace('_', ' ')}</h3>
                {groupedTasks[status].map((task) => (
                  <div
                    key={task.id}
                    className="card bg-white shadow p-4 mb-4 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <h4 className="font-bold">{task.name}</h4>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="text-xs mt-2">
                      <p><strong>Budget:</strong> ${task.budget}</p>
                      <p><strong>Spent:</strong> ${task.spent}</p>
                    </div>
                  </div>
                ))}
                {groupedTasks[status].length === 0 && (
                  <p className="text-sm text-gray-400 italic">No tasks</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
