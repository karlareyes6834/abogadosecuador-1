import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute } from '../types';
import { Site, WebApp } from '../types';
import { SitePage } from './SitesPage';
import { SaveIcon, ChevronLeftIcon, GlobeIcon, PlusIcon, EditIcon, TrashIcon, LinkIcon, SettingsIcon, FileTextIcon, PaletteIcon, CheckCircleIcon } from '../components/icons/InterfaceIcons';

const WEBSITES_KEY = 'siteWebsites';
const PAGES_KEY = 'sitePages';
const WEBAPPS_DATA_KEY = 'nexuspro_webapps_data';

const NewPageModal = ({ onClose, onCreate }) => {
    const [pageName, setPageName] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (pageName.trim()) {
            onCreate(pageName.trim());
        }
    };

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Añadir Nueva Página</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre de la Página</label>
                        <input type="text" value={pageName} onChange={e => setPageName(e.target.value)} required placeholder="Ej: Sobre Nosotros" className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                    </div>
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">Crear Página</button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full text-left ${
            isActive 
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' 
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
    >
        {React.cloneElement(icon, { className: "h-5 w-5 mr-3" })}
        <span>{label}</span>
    </button>
);

interface WebsiteEditorPageProps {
    siteId: string;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

const WebsiteEditorPage: React.FC<WebsiteEditorPageProps> = ({ siteId, onNavigate }) => {
    const [site, setSite] = useState<Site | null>(null);
    const [webApp, setWebApp] = useState<WebApp | null>(null);
    const [allPages, setAllPages] = useState<SitePage[]>([]);
    const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pages' | 'settings' | 'domains' | 'seo'>('pages');
    const [newDomain, setNewDomain] = useState('');

    useEffect(() => {
        const sites: Site[] = JSON.parse(localStorage.getItem(WEBSITES_KEY) || '[]');
        setSite(sites.find(s => s.id === siteId) || null);

        const pages: SitePage[] = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
        setAllPages(pages);

        const webApps: Record<string, WebApp> = JSON.parse(localStorage.getItem(WEBAPPS_DATA_KEY) || '{}');
        setWebApp(webApps[siteId] || null);
    }, [siteId]);

    const handleSave = () => {
        if (!site || !webApp) return;
        
        const sites: Site[] = JSON.parse(localStorage.getItem(WEBSITES_KEY) || '[]');
        const updatedSites = sites.map(s => s.id === siteId ? { ...site, name: webApp.name } : s);
        localStorage.setItem(WEBSITES_KEY, JSON.stringify(updatedSites));

        const webApps: Record<string, WebApp> = JSON.parse(localStorage.getItem(WEBAPPS_DATA_KEY) || '{}');
        webApps[siteId] = webApp;
        localStorage.setItem(WEBAPPS_DATA_KEY, JSON.stringify(webApps));

        alert('Sitio guardado con éxito');
    };
    
    const handleUpdateWebApp = (field: keyof WebApp, value: any) => {
        if (webApp) setWebApp({ ...webApp, [field]: value });
    };

    const handleUpdateNested = (prop: 'theme' | 'seo', field: string, value: string) => {
        if (webApp) {
            setWebApp(prev => ({ ...prev, [prop]: { ...prev[prop], [field]: value }}));
        }
    };
    
    const handleCreatePage = (pageName: string) => {
        if (!site) return;
        const newPageId = `page_${Date.now()}`;
        const newPage: SitePage = {
            id: newPageId,
            name: pageName,
            status: 'draft',
            components: [],
            lastModified: new Date().toISOString(),
        };
        
        const newAllPages = [...allPages, newPage];
        setAllPages(newAllPages);
        localStorage.setItem(PAGES_KEY, JSON.stringify(newAllPages));
        
        const updatedSite = { ...site, pageIds: [...(site.pageIds || []), newPageId] };
        setSite(updatedSite);

        setIsNewPageModalOpen(false);
    };
    
    const handleAddDomain = (e: React.FormEvent) => {
        e.preventDefault();
        if (webApp && newDomain.trim()) {
            const newDomainEntry = { name: newDomain, isPrimary: false, status: 'pending' as const };
            const updatedDomains = [...(webApp.domains || []), newDomainEntry];
            handleUpdateWebApp('domains', updatedDomains);
            setNewDomain('');
        }
    };
    
    const sitePages = allPages.filter(p => site?.pageIds?.includes(p.id));

    if (!site || !webApp) return <div>Cargando sitio web...</div>;
    
    const renderContent = () => {
        switch (activeTab) {
            case 'pages':
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Páginas del Sitio ({sitePages.length})</h2>
                            <button onClick={() => setIsNewPageModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                <PlusIcon className="h-4 w-4"/> Añadir Página
                            </button>
                        </div>
                        <div className="space-y-3">
                            {sitePages.map(page => (
                                <div key={page.id} className="p-3 flex items-center bg-gray-50 dark:bg-gray-800/70 rounded-md border border-gray-200 dark:border-gray-700">
                                    <span className="flex-grow font-medium">{page.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onNavigate(`site-editor/${page.id}`)} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" title="Editar Página"><EditIcon className="h-4 w-4"/></button>
                                        <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" title="Eliminar del sitio"><TrashIcon className="h-4 w-4 text-red-500"/></button>
                                    </div>
                                </div>
                            ))}
                            {sitePages.length === 0 && <p className="text-center text-sm text-gray-500 py-8">Este sitio aún no tiene páginas.</p>}
                        </div>
                    </Card>
                );
            case 'settings':
                 return (
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Configuración General</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nombre del Sitio</label>
                                <input type="text" value={webApp.name} onChange={e => handleUpdateWebApp('name', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Color Primario</label>
                                <input type="color" value={webApp.theme.primaryColor} onChange={e => handleUpdateNested('theme', 'primaryColor', e.target.value)} className="w-full mt-1 p-1 h-10 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                        </div>
                    </Card>
                 );
            case 'domains':
                return (
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Dominios</h2>
                        <div className="space-y-2 mb-4">
                           {(webApp.domains || []).map((domain, index) => (
                               <div key={index} className="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/70 rounded-md">
                                   <span className="font-mono">{domain.name}</span>
                                   <span className={`text-xs px-2 py-0.5 rounded-full ${domain.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{domain.status}</span>
                               </div>
                           ))}
                        </div>
                        <form onSubmit={handleAddDomain} className="flex gap-2">
                            <input type="text" value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="ejemplo.com" className="flex-grow p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                            <button type="submit" className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-600">Añadir</button>
                        </form>
                    </Card>
                );
            case 'seo':
                 return (
                    <Card>
                        <h2 className="text-xl font-bold mb-4">SEO Global</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Plantilla de Título</label>
                                <input type="text" value={webApp.seo?.titleTemplate || ''} onChange={e => handleUpdateNested('seo', 'titleTemplate', e.target.value)} placeholder="Mi Sitio | {{page_title}}" className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Meta Descripción por Defecto</label>
                                <textarea value={webApp.seo?.metaDescription || ''} onChange={e => handleUpdateNested('seo', 'metaDescription', e.target.value)} rows={3} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                        </div>
                    </Card>
                 );
            default: return null;
        }
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
             {isNewPageModalOpen && <NewPageModal onClose={() => setIsNewPageModalOpen(false)} onCreate={handleCreatePage} />}
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button onClick={() => onNavigate('sites')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Aplicaciones
                </button>
                <div className="flex items-center gap-2">
                    <GlobeIcon className="h-5 w-5" />
                    <h1 className="text-lg font-bold">{webApp.name}</h1>
                </div>
                <button onClick={handleSave} className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                    <SaveIcon className="h-5 w-5 mr-2"/> Guardar Cambios
                </button>
            </header>
            <main className="flex-grow flex gap-6 p-6 overflow-hidden">
                <aside className="w-64 flex-shrink-0">
                    <Card className="!p-2">
                         <nav className="space-y-1">
                            <TabButton label="Páginas" icon={<FileTextIcon />} isActive={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
                            <TabButton label="General" icon={<SettingsIcon />} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                            <TabButton label="Dominios" icon={<LinkIcon />} isActive={activeTab === 'domains'} onClick={() => setActiveTab('domains')} />
                            <TabButton label="SEO" icon={<GlobeIcon />} isActive={activeTab === 'seo'} onClick={() => setActiveTab('seo')} />
                         </nav>
                    </Card>
                </aside>
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default WebsiteEditorPage;