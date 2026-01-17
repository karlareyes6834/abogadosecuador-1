import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Page, PublicRoute, Branch, UserRole } from '../../types';
import { SunIcon, MoonIcon, SearchIcon, BellIcon, UserIcon, LogOutIcon, ChevronDownIcon, BranchIcon, CreditsIcon } from '../icons/InterfaceIcons';
import { useCredits } from '../../context/CreditContext';

interface HeaderProps {
    currentPage: Page;
    onLogout: () => void;
    branches: Branch[];
    currentBranch: Branch;
    setCurrentBranch: (branch: Branch) => void;
    onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
    userRole: UserRole;
}

const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    crm: 'CRM',
    users: 'Usuarios y Leads',
    sales: 'Ventas',
    automations: 'Automatizaciones',
    chatbots: 'Chatbots',
    publisher: 'Gestionar Blog',
    analytics: 'Analíticas',
    vrar: 'VR & AR Lab',
    sites: 'Creador Web/App',
    courses: 'Cursos',
    'manage-courses': 'Gestionar Cursos',
    'course-detail': 'Detalle del Curso',
    calendar: 'Calendario y Citas',
    media: 'Biblioteca Multimedia',
    financials: 'Finanzas',
    database: 'Base de Datos',
    documents: 'Documentos',
    assistants: 'Asistentes y Llamadas',
    settings: 'Configuración',
    'site-editor': 'Editor Visual',
    'course-editor': 'Editor de Cursos',
    projects: 'Proyectos',
    credits: 'Créditos',
    'content-studio': 'Estudio de Contenido IA',
    campaigns: 'Campañas',
    conversations: 'Conversaciones',
    forms: 'Formularios',
    'form-editor': 'Editor de Formularios',
    'form-submissions': 'Respuestas de Formulario',
    catalogo: 'Catálogo',
    'website-editor': 'Editor de Sitio Web',
    affiliates: 'Afiliados',
    games: 'Gamificación / Juegos',
    services: 'Servicios Legales',
    'service-detail': 'Detalle del Servicio',
    blog: 'Blog Legal',
    'blog-post': 'Artículo del Blog',
    forum: 'Foro de la Comunidad',
    checkout: 'Finalizar Compra',
    plans: 'Planes y Suscripción',
    contact: 'Contacto',
    rewards: 'Recompensas',
    ebooks: 'eBooks y Guías',
    consultas: 'Consultas Online',
    'my-courses': 'Mis Cursos',
    'my-purchases': 'Mis Compras',
    products: 'Catálogo',
};

const Header: React.FC<HeaderProps> = ({ currentPage, onLogout, branches, currentBranch, setCurrentBranch, onNavigate, userRole }) => {
    const { theme, toggleTheme } = useTheme();
    const { credits } = useCredits();
    const [isBranchSwitcherOpen, setIsBranchSwitcherOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const title = (currentPage === 'projects' && userRole === 'client') ? 'Mis Casos' : (pageTitles[currentPage] || 'NexusPro');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onNavigate('catalogo', { searchTerm });
        }
    };

    return (
        <header className="flex-shrink-0 bg-[var(--card)] border-b border-[var(--border)]">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold capitalize">{title}</h1>
                    
                    <div className="relative ml-4">
                        <button onClick={() => setIsBranchSwitcherOpen(!isBranchSwitcherOpen)} className="flex items-center px-3 py-1.5 text-sm rounded-md bg-[var(--background)] hover:bg-opacity-80 transition-colors">
                            <BranchIcon className="h-4 w-4 mr-2 text-[var(--muted-foreground)]"/>
                            <span className="font-medium">{currentBranch.name}</span>
                            <ChevronDownIcon className="h-4 w-4 ml-2 text-[var(--muted-foreground)]"/>
                        </button>
                        {isBranchSwitcherOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-[var(--card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                {branches.map(branch => (
                                    <a href="#" key={branch.id} onClick={(e) => { e.preventDefault(); setCurrentBranch(branch); setIsBranchSwitcherOpen(false); }} className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)]">
                                        {branch.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                     <form onSubmit={handleSearch} className="relative hidden md:block">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--background)] border border-transparent focus:bg-[var(--card)] focus:outline-none focus:ring-1 transition-colors border-[var(--border)] focus:border-[var(--accent-color)]"
                        />
                    </form>

                    <div 
                      onClick={() => onNavigate('credits')}
                      className="flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-yellow-800 dark:text-yellow-300 bg-yellow-400/20 dark:bg-yellow-400/10 cursor-pointer hover:bg-yellow-400/30 transition-colors"
                    >
                      <CreditsIcon className="h-4 w-4 mr-1.5" />
                      {credits.toLocaleString()}
                    </div>
                
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-colors focus:ring-[var(--accent-color)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                    </button>

                    <button className="p-2 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-colors focus:ring-[var(--accent-color)]" aria-label="Notifications">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    
                    <div className="relative">
                      <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center p-1 rounded-full bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card)] focus:ring-[var(--accent-color)]">
                           <UserIcon className="h-7 w-7 text-[var(--muted-foreground)]"/>
                      </button>
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('settings'); setIsProfileOpen(false);}} className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)]">Mi Perfil</a>
                            <a href="#/plans" onClick={(e) => { e.preventDefault(); onNavigate('plans'); setIsProfileOpen(false); }} className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)]">Planes</a>
                            <div className="border-t border-[var(--border)] my-1"></div>
                            <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[var(--background)]">
                                <LogOutIcon className="mr-2 h-4 w-4"/>
                                Cerrar Sesión
                            </button>
                        </div>
                       )}
                   </div>
                </div>
            </div>
        </header>
    );
};

export default Header;