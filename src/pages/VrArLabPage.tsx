

import React, { useState } from 'react';
import Card from '../components/Card';
import { ArIcon, PackageIcon, UploadCloudIcon, PlusIcon, ChatbotIcon, CrmIcon, AutomationIcon, AnalyticsIcon } from '../components/icons/InterfaceIcons';

type VrTab = 'showroom' | 'office' | 'analytics';
type ItemType = 'product' | 'media' | 'bot';
type SceneItem = { id: number; name: string; type: ItemType; icon: React.FC<React.SVGProps<SVGSVGElement>> };

const initialSceneItems: SceneItem[] = [
    { id: 1, name: 'Producto Destacado', type: 'product', icon: CrmIcon },
    { id: 2, name: 'Video Demostrativo', type: 'media', icon: UploadCloudIcon },
    { id: 3, name: 'Bot de Bienvenida', type: 'bot', icon: ChatbotIcon },
];

const typeConfig = {
    product: { icon: CrmIcon, label: 'Producto del CRM' },
    media: { icon: UploadCloudIcon, label: 'Archivo Multimedia' },
    bot: { icon: ChatbotIcon, label: 'Asistente de Chatbot' }
};

const AddElementModal = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<ItemType>('product');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd({
                id: Date.now(),
                name,
                type,
                icon: typeConfig[type].icon
            });
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Añadir Elemento a la Escena</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Elemento</label>
                        <select value={type} onChange={(e) => setType(e.target.value as ItemType)} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                            <option value="product">Producto del CRM</option>
                            <option value="media">Archivo Multimedia</option>
                            <option value="bot">Asistente de Chatbot</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Elemento</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Zapatilla Modelo X" className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">Añadir</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const VrTabButton = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? 'bg-white dark:bg-gray-800 border-b-2 border-purple-500 text-purple-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
        {label}
    </button>
);

const VrArLabPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<VrTab>('showroom');
    const [sceneItems, setSceneItems] = useState<SceneItem[]>(initialSceneItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddElement = (newItem: SceneItem) => {
        setSceneItems(prev => [...prev, newItem]);
    };

  return (
    <div className="h-full flex flex-col">
       {isModalOpen && <AddElementModal onClose={() => setIsModalOpen(false)} onAdd={handleAddElement} />}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center"><ArIcon className="h-8 w-8 mr-3"/> VR & AR Lab</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Crea, gestiona y monetiza tus experiencias virtuales inmersivas.</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                <PackageIcon className="h-5 w-5 mr-2"/>
                Entrar en Modo VR
            </button>
        </div>

        <div className="flex-grow flex gap-6 mt-6">
            <aside className="w-1/3">
                <Card className="h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Configuración de Escena</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Añade elementos a tu espacio virtual actual.</p>
                    <div className="space-y-3 flex-grow overflow-y-auto">
                        {sceneItems.map(item => (
                            <div key={item.id} className="p-3 flex items-center bg-gray-50 dark:bg-gray-800/70 rounded-md border border-gray-200 dark:border-gray-700">
                                <item.icon className="h-5 w-5 mr-3 text-gray-500"/>
                                <span className="flex-grow font-medium text-sm">{item.name}</span>
                            </div>
                        ))}
                    </div>
                     <button onClick={() => setIsModalOpen(true)} className="w-full mt-4 inline-flex justify-center items-center px-3 py-1.5 border border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <PlusIcon className="h-4 w-4 mr-2"/>
                        Añadir Elemento
                    </button>
                </Card>
            </aside>
            <main className="w-2/3">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                        <VrTabButton label="Showroom de Productos" isActive={activeTab === 'showroom'} onClick={() => setActiveTab('showroom')} />
                        <VrTabButton label="Oficina Virtual" isActive={activeTab === 'office'} onClick={() => setActiveTab('office')} />
                        <VrTabButton label="Analíticas VR" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                    </nav>
                </div>
                <div className="mt-4">
                    {activeTab === 'showroom' && (
                        <Card>
                            <h2 className="text-xl font-bold mb-4">Previsualización del Showroom</h2>
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <PackageIcon className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 animate-pulse"/>
                                    <p className="mt-2">Simulación de entorno 3D de productos.</p>
                                </div>
                            </div>
                        </Card>
                    )}
                     {activeTab === 'office' && (
                        <Card>
                            <h2 className="text-xl font-bold mb-4">Previsualización de Oficina Virtual</h2>
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <PackageIcon className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600"/>
                                    <p className="mt-2">Simulación de sala de reuniones y colaboración.</p>
                                </div>
                            </div>
                        </Card>
                    )}
                    {activeTab === 'analytics' && (
                         <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center"><AnalyticsIcon className="h-5 w-5 mr-2"/> Analíticas de la Experiencia VR</h2>
                            <p className="text-gray-500">Métricas de interacción de las últimas 24 horas.</p>
                            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                <div>
                                    <p className="text-3xl font-bold">142</p>
                                    <p className="text-sm text-gray-500">Visitas Únicas</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">8</p>
                                    <p className="text-sm text-gray-500">Demos Solicitadas</p>
                                </div>
                                 <div>
                                    <p className="text-3xl font-bold">3m 12s</p>
                                    <p className="text-sm text-gray-500">Tiempo Promedio</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    </div>
  );
};

export default VrArLabPage;