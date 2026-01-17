import React, { useState } from 'react';
import Card from '../components/Card';
import { KanbanIcon, PlusIcon, UserIcon, ChevronDownIcon } from '../components/icons/InterfaceIcons';
import { Task } from '../types';
import { initialTasks } from '../data/projectsData';


type TaskStatus = 'todo' | 'in_progress' | 'done';

const statusConfig: Record<TaskStatus, { title: string; color: string }> = {
  todo: { title: 'Por Hacer', color: 'bg-gray-400' },
  in_progress: { title: 'En Progreso', color: 'bg-blue-500' },
  done: { title: 'Hecho', color: 'bg-green-500' },
};

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void; onClick: () => void; }> = ({ task, onDragStart, onClick }) => (
  <div
    draggable
    onClick={onClick}
    onDragStart={(e) => onDragStart(e, task.id)}
    className="p-3 mb-3 bg-[var(--card)] rounded-lg shadow-md cursor-pointer active:cursor-grabbing border-l-4 border-gray-300 dark:border-gray-600 hover:border-[var(--accent-color)] transition-colors"
  >
    <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full">{task.project}</span>
    <p className="font-semibold mt-2">{task.title}</p>
    <div className="flex items-center justify-end mt-3">
      <img src={task.assignee.avatar} alt={task.assignee.name} className="h-6 w-6 rounded-full" title={task.assignee.name} />
    </div>
  </div>
);

const KanbanColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onTaskClick: (task: Task) => void;
}> = ({ status, tasks, onDrop, onDragOver, onDragStart, onTaskClick }) => (
  <div
    className="w-80 flex-shrink-0 bg-[var(--background)] rounded-xl p-3"
    onDrop={(e) => onDrop(e, status)}
    onDragOver={onDragOver}
  >
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${statusConfig[status].color}`}></div>
        <h3 className="font-semibold">{statusConfig[status].title}</h3>
      </div>
      <span className="text-sm font-medium text-[var(--muted-foreground)] bg-[var(--card)] rounded-full px-2 py-0.5">{tasks.length}</span>
    </div>
    <div className="overflow-y-auto h-[calc(100vh-320px)] pr-1">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDragStart={onDragStart} onClick={() => onTaskClick(task)} />
      ))}
    </div>
  </div>
);

const TaskDetailModal = ({ task, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                <span>Asignado a:</span>
                <img src={task.assignee.avatar} alt={task.assignee.name} className="h-6 w-6 rounded-full" />
                <span>{task.assignee.name}</span>
            </div>
            <p className="mb-6">{task.description}</p>
            
            <h3 className="font-semibold mb-2">Comentarios</h3>
            <div className="space-y-4">
                <div className="text-sm">Simulación de comentarios...</div>
                 <textarea placeholder="Añadir un comentario..." className="w-full p-2 text-sm rounded-md bg-[var(--background)] border border-[var(--border)]"></textarea>
            </div>
            
            <div className="flex justify-end mt-6">
                 <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cerrar</button>
            </div>
        </Card>
    </div>
);

const NewTaskModal = ({ onClose, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<TaskStatus>('todo');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!title.trim()) return;
        onAddTask({
            id: Date.now(),
            title,
            description: "Nueva tarea sin descripción.",
            status,
            project: 'General',
            assignee: { name: 'Sin Asignar', avatar: 'https://i.pravatar.cc/150?u=unassigned' }
        });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Nueva Tarea</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">Título</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                     </div>
                      <div>
                        <label className="block text-sm font-medium">Estado</label>
                        <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]">
                           {Object.entries(statusConfig).map(([key, value]) => (
                               <option key={key} value={key}>{value.title}</option>
                           ))}
                        </select>
                     </div>
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Crear Tarea</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const ProjectsPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('All');

  const projects = ['All', ...Array.from(new Set(tasks.map(t => t.project)))];

  const filteredTasks = projectFilter === 'All' ? tasks : tasks.filter(t => t.project === projectFilter);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('taskId', id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const handleAddTask = (newTask: Task) => {
      setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="h-full flex flex-col">
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onAddTask={handleAddTask} />}

      <header className="flex-shrink-0 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center"><KanbanIcon className="h-8 w-8 mr-3"/> Proyectos</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">Organiza tus tareas y colabora con tu equipo.</p>
          </div>
          <div className="flex items-center gap-4">
              <select 
                value={projectFilter} 
                onChange={e => setProjectFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-md bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              >
                {projects.map(p => <option key={p} value={p}>{p === 'All' ? 'Todos los proyectos' : p}</option>)}
              </select>
              <button onClick={() => setIsNewTaskModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                <PlusIcon className="h-5 w-5 mr-2"/>
                Nueva Tarea
              </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-hidden">
        <div className="flex space-x-4 h-full overflow-x-auto pb-4">
          {Object.keys(statusConfig).map((statusKey) => {
            const status = statusKey as TaskStatus;
            return (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filteredTasks.filter((t) => t.status === status)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onTaskClick={setSelectedTask}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;