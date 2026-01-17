import React from 'react';
import Card from '../components/Card';
import { ForumIcon, PlusIcon, MessageIcon } from '../components/icons/InterfaceIcons';

const forumCategories = [
    { name: 'Derecho Penal', topics: 12, posts: 153, description: 'Discusiones sobre casos, leyes y procedimientos penales.' },
    { name: 'Derecho Civil', topics: 25, posts: 312, description: 'Consultas sobre contratos, herencias, propiedad y más.' },
    { name: 'Derecho Laboral', topics: 18, posts: 201, description: 'Todo sobre despidos, contratos de trabajo y derechos laborales.' },
    { name: 'Consultas Generales', topics: 42, posts: 560, description: 'Espacio para preguntas legales que no encajan en otras categorías.' },
];

const recentTopics = [
    { title: '¿Cómo proceder con una demanda por despido intempestivo?', author: 'Ana G.', category: 'Derecho Laboral', replies: 5, date: 'Hace 2 horas' },
    { title: 'Dudas sobre la posesión efectiva de un bien inmueble', author: 'Carlos R.', category: 'Derecho Civil', replies: 2, date: 'Hace 5 horas' },
    { title: 'Plazos para apelar una sentencia penal', author: 'Luis F.', category: 'Derecho Penal', replies: 8, date: 'Hace 1 día' },
];

const ForumPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <ForumIcon className="h-8 w-8 mr-3 text-[var(--accent-color)]"/> Foro de la Comunidad
                    </h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Discute temas, haz preguntas y conecta con otros miembros.</p>
                </div>
                 <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Nueva Discusión
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {forumCategories.map(cat => (
                    <Card key={cat.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold">{cat.name}</h2>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">{cat.description}</p>
                        <div className="mt-4 flex gap-4 text-sm">
                            <span><strong>{cat.topics}</strong> Temas</span>
                            <span><strong>{cat.posts}</strong> Mensajes</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <h2 className="text-2xl font-bold mb-4">Discusiones Recientes</h2>
                <div className="space-y-4">
                    {recentTopics.map(topic => (
                        <div key={topic.title} className="p-4 flex items-center bg-[var(--background)] rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer">
                            <MessageIcon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0"/>
                            <div className="flex-grow">
                                <p className="font-semibold">{topic.title}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                    por {topic.author} en <span className="font-medium text-[var(--accent-color)]">{topic.category}</span>
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="font-semibold">{topic.replies} respuestas</p>
                                <p className="text-xs text-[var(--muted-foreground)]">{topic.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
};

export default ForumPage;