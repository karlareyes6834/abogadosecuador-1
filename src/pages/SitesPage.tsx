import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { SitesIcon, PlusIcon, GlobeIcon, EditIcon, TrashIcon, WandIcon } from '../components/icons/InterfaceIcons';
import { Page, PublicRoute, Site, WebApp, WebAppComponent } from '../types';
import { generateWebApp } from '../services/geminiService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export interface SitePage {
    id: string;
    name: string;
    status: 'published' | 'draft';
    components: WebAppComponent[];
    lastModified: string;
}

const WEBSITES_KEY = 'siteWebsites';
const WEBAPPS_DATA_KEY = 'nexuspro_webapps_data';
const PAGES_KEY = 'sitePages';


const CreateModal = ({ onClose, onNavigate }) => {
    const [mode, setMode] = useState<'ai' | 'manual'>('ai');
    const [aiPrompt, setAiPrompt] = useState('');
    const [appName, setAppName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleCreateAppWithAI = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;
        setIsLoading(true);
        try {
            const webApp: WebApp | any = await generateWebApp(aiPrompt);
            if (webApp.error) {
                alert(`Error de IA: ${webApp.error.title} - ${webApp.error.message}`);
                setIsLoading(false);
                return;
            }

            const newSite: Site = {
                id: `webapp_${Date.now()}`,
                name: webApp.name,
                slug: webApp.name.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
                status: 'draft',
                lastModified: new Date().toISOString(),
                pageIds: []
            };

            const newPages: SitePage[] = [];
            if (webApp.pages) {
                newSite.pageIds = [];
                Object.entries(webApp.pages).forEach(([pageKey, pageData]: [string, any]) => {
                    const newPageId = `page_${newSite.id}_${pageKey}`;
                    const newPage: SitePage = {
                        id: newPageId,
                        name: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
                        status: 'draft',
                        components: pageData.components || [],
                        lastModified: new Date().toISOString(),
                    };
                    newPages.push(newPage);
                    newSite.pageIds.push(newPageId);
                });
            }

            const existingSites: Site[] = JSON.parse(localStorage.getItem(WEBSITES_KEY) || '[]');
            localStorage.setItem(WEBSITES_KEY, JSON.stringify([...existingSites, newSite]));

            const existingWebApps: Record<string, WebApp> = JSON.parse(localStorage.getItem(WEBAPPS_DATA_KEY) || '{}');
            existingWebApps[newSite.id] = webApp;
            localStorage.setItem(WEBAPPS_DATA_KEY, JSON.stringify(existingWebApps));

            const existingPages: SitePage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
            localStorage.setItem(PAGES_KEY, JSON.stringify([...existingPages, ...newPages]));

            onNavigate(`website-editor/${newSite.id}`);

        } catch (error) {
            console.error("Failed to create site with AI", error);
            alert("Ocurrió un error al generar la aplicación. Revisa la consola para más detalles.");
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleCreateManualApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appName.trim()) return;
        setIsLoading(true);

        const newSite: Site = {
            id: `webapp_${Date.now()}`,
            name: appName,
            slug: appName.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
            status: 'draft',
            lastModified: new Date().toISOString(),
            pageIds: []
        };
        
        const newWebApp: WebApp = {
            name: appName,
            theme: { primaryColor: '#D4AF37', font: 'Inter' },
            dataModels: {},
            pages: {}
        };

        const existingSites: Site[] = JSON.parse(localStorage.getItem(WEBSITES_KEY) || '[]');
        localStorage.setItem(WEBSITES_KEY, JSON.stringify([...existingSites, newSite]));

        const existingWebApps: Record<string, WebApp> = JSON.parse(localStorage.getItem(WEBAPPS_DATA_KEY) || '{}');
        existingWebApps[newSite.id] = newWebApp;
        localStorage.setItem(WEBAPPS_DATA_KEY, JSON.stringify(existingWebApps));

        setIsLoading(false);
        onNavigate(`website-editor/${newSite.id}`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                 <h2 className="text-xl font-bold mb-2">Crear Nueva Aplicación Web</h2>
                 <div className="flex border-b border-[var(--border)] mb-4">
                     <button onClick={() => setMode('ai')} className={`px-4 py-2 text-sm font-medium ${mode === 'ai' ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--muted-foreground)]'}`}>
                         Crear con IA
                     </button>
                     <button onClick={() => setMode('manual')} className={`px-4 py-2 text-sm font-medium ${mode === 'manual' ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--muted-foreground)]'}`}>
                         Empezar desde Cero
                     </button>
                 </div>
                 
                 {mode === 'ai' ? (
                    <form onSubmit={handleCreateAppWithAI} className="flex flex-col gap-4">
                        <p className="text-sm text-[var(--muted-foreground)]">Describe tu idea, y la IA construirá una aplicación funcional con páginas de inicio, registro, login y un dashboard.</p>
                        <textarea 
                            value={aiPrompt} 
                            onChange={(e) => setAiPrompt(e.target.value)} 
                            placeholder="Ej: Un dashboard para una startup de SaaS que rastrea métricas de usuarios y suscripciones." 
                            className="w-full flex-grow p-3 text-sm bg-[var(--background)] rounded-md border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent-color)] focus:outline-none"
                            rows={4}
                        />
                         <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => onClose(false)} disabled={isLoading} className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                            <button type="submit" disabled={isLoading || !aiPrompt.trim()} className="px-4 py-2 text-sm rounded text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center min-w-[120px] justify-center">
                                {isLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <><WandIcon className="h-5 w-5 mr-2"/>Generar App</>}
                            </button>
                        </div>
                    </form>
                 ) : (
                    <form onSubmit={handleCreateManualApp} className="flex flex-col gap-4">
                        <p className="text-sm text-[var(--muted-foreground)]">Crea una nueva aplicación en blanco para construirla desde cero.</p>
                        <div>
                            <label className="block text-sm font-medium">Nombre de la Aplicación</label>
                            <input type="text" value={appName} onChange={e => setAppName(e.target.value)} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => onClose(false)} disabled={isLoading} className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                            <button type="submit" disabled={isLoading || !appName.trim()} className="px-4 py-2 text-sm rounded text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center min-w-[120px] justify-center">
                                {isLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'Crear Aplicación'}
                            </button>
                        </div>
                    </form>
                 )}
            </Card>
        </div>
    );
};


const SitesPage: React.FC<{onNavigate: (page: Page | PublicRoute | string) => void}> = ({ onNavigate }) => {
    const [sites, setSites] = useState<Site[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = () => {
        const storedSites = localStorage.getItem(WEBSITES_KEY);
        setSites(storedSites ? JSON.parse(storedSites) : []);
    };

    useEffect(() => {
        loadData();
    }, []);
    
    const closeModal = (reloadData: boolean) => {
        setIsModalOpen(false);
        if (reloadData) {
            loadData();
        }
    };
    
    const handleDeleteSite = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta aplicación web? Esta acción no se puede deshacer.')) {
            const newSites = sites.filter(s => s.id !== id);
            setSites(newSites);
            localStorage.setItem(WEBSITES_KEY, JSON.stringify(newSites));
            
            const webapps = JSON.parse(localStorage.getItem(WEBAPPS_DATA_KEY) || '{}');
            delete webapps[id];
            localStorage.setItem(WEBAPPS_DATA_KEY, JSON.stringify(webapps));
        }
    };

    const filteredSites = sites.filter(site => site.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
       {isModalOpen && <CreateModal onClose={closeModal} onNavigate={onNavigate}/>}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center"><SitesIcon className="h-8 w-8 mr-3"/> Creador Web/App Profesional</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">Crea sitios y aplicaciones con nuestro editor visual y la potencia de la IA.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
          <PlusIcon className="h-5 w-5 mr-2"/>
          Crear Nueva App
        </button>
      </div>
      
      <Card className="!p-0">
         <div className="p-4 border-b border-[var(--border)]">
             <input type="text" placeholder="Buscar aplicaciones..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-1/3 px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
         </div>
         <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-[var(--border)]">
                 <thead className="bg-[var(--background)]">
                     <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre de la App</th>
                         <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                         <th className="px-6 py-3 text-left text-xs font-medium uppercase">Última Modificación</th>
                         <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
                     </tr>
                 </thead>
                 <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                     {filteredSites.map(site => (
                         <tr key={site.id}>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium">{site.name}</div>
                                <div className="text-sm text-[var(--muted-foreground)]">/{site.slug}</div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${site.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{site.status === 'published' ? 'Publicado' : 'Borrador'}</span></td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">{format(new Date(site.lastModified), "d LLL yyyy, HH:mm", { locale: es })}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <button onClick={() => onNavigate(`website-editor/${site.id}`)} className="text-[var(--accent-color)] hover:opacity-80 p-2">Administrar</button>
                                 <button onClick={() => handleDeleteSite(site.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2">Eliminar</button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             {filteredSites.length === 0 && <p className="text-center py-8 text-[var(--muted-foreground)]">No se encontraron aplicaciones web.</p>}
         </div>
      </Card>
    </div>
  );
};

export default SitesPage;