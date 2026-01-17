import React, { useState } from 'react';
import { Task } from '../types';
import Card from './Card';
import { CheckIcon, PlusIcon } from './icons/InterfaceIcons';

interface TasksCardProps {
    tasks: Task[];
    onToggleTask: (id: number) => void;
}

const TaskItem: React.FC<{ task: Task; onToggle: () => void }> = ({ task, onToggle }) => (
    <li
        className="flex items-center py-3 px-2 rounded-md transition-colors duration-200 hover:bg-[var(--background)] cursor-pointer group"
        onClick={onToggle}
        role="button"
        aria-pressed={task.status === 'done'}
        tabIndex={0}
    >
        <div
            className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200 mr-4 ${
                task.status === 'done'
                    ? 'bg-primary border-primary'
                    : 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 group-hover:border-[var(--accent-color)]'
            }`}
        >
            {task.status === 'done' && <CheckIcon className="w-4 h-4 text-primary-foreground" />}
        </div>
        <span
            className={`flex-grow text-[var(--foreground)] transition-colors duration-200 ${
                task.status === 'done' ? 'line-through text-[var(--muted-foreground)]' : ''
            }`}
        >
            {task.title}
        </span>
    </li>
);

const TasksCard: React.FC<TasksCardProps> = ({ tasks, onToggleTask }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a simulation. In a real app, this would update state via a callback.
        if (newTaskTitle.trim()) {
            console.log("Adding new task:", newTaskTitle);
            setNewTaskTitle('');
        }
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-1">
                 <h2 className="text-xl font-bold">Metas de Hoy</h2>
                 <p className="text-sm text-[var(--muted-foreground)]">{`${completedTasks} de ${totalTasks} completadas`}</p>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 my-4">
              <div 
                className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}>
              </div>
            </div>

            <ul className="space-y-1">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />
                ))}
            </ul>

            <form onSubmit={handleAddTask} className="mt-4 flex items-center gap-2">
                <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Añadir nueva meta..."
                    className="flex-grow px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition"
                />
                <button type="submit" className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:bg-gray-400 transition" disabled={!newTaskTitle.trim()}>
                    <PlusIcon className="h-5 w-5"/>
                </button>
            </form>
        </Card>
    );
};

export default TasksCard;