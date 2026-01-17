




import React, { useState, useCallback, useEffect } from 'react';
import Card from '../components/Card';
import { ChatbotIcon, PlusIcon, MessageIcon, SendIcon, InstagramIcon, TikTokIcon, EditIcon, ChevronLeftIcon, BranchIcon, ButtonIcon, CrmIcon, SaveIcon, CheckIcon, TrashIcon } from '../components/icons/InterfaceIcons';
import { ReactFlow, Background, BackgroundVariant, Controls, ReactFlowProvider, useEdgesState, useNodesState, addEdge } from 'reactflow';

const CHATBOTS_STORAGE_KEY = 'nexuspro_chatbots';

interface Chatbot {
    id: string;
    name: string;
    platform: 'instagram' | 'tiktok';
    status: 'active' | 'inactive';
    nodes: any[];
    edges: any[];
}

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Usuario envía "hola"' }, position: { x: 250, y: 5 }, className: '!border-blue-500' },
  { id: '2', data: { label: 'Enviar: ¡Hola! 👋 ¿Cómo puedo ayudarte?' }, position: { x: 250, y: 125 } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

const initialChatbots: Chatbot[] = [
    { id: 'bot_1', name: 'Bot de bienvenida Instagram', platform: 'instagram', status: 'active', nodes: initialNodes, edges: initialEdges },
    { id: 'bot_2', name: 'Contestador de comentarios TikTok', platform: 'tiktok', status: 'inactive', nodes: [], edges: [] },
];

const ChatbotItem = ({ bot, onEdit, onDelete, onToggleStatus }) => (
    <Card className="!p-4 flex items-center">
        <div className="flex-shrink-0 mr-4">
            {bot.platform === 'instagram' && <InstagramIcon className="h-8 w-8 text-[var(--accent-color)]"/>}
            {bot.platform === 'tiktok' && <TikTokIcon className="h-8 w-8"/>}
        </div>
        <div className="flex-grow">
            <p className="font-bold">{bot.name}</p>
            <p className="text-sm text-[var(--muted-foreground)] capitalize">{bot.platform}</p>
        </div>
        <div className="flex items-center gap-2">
             <button onClick={() => onToggleStatus(bot.id)} className={`px-2 py-1 text-xs font-semibold rounded-full ${bot.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                {bot.status === 'active' ? 'Activo' : 'Inactivo'}
            </button>
            <button onClick={() => onEdit(bot)} className="p-2 rounded-md hover:bg-[var(--background)]">
                <EditIcon className="h-4 w-4 text-[var(--muted-foreground)]"/>
            </button>
            <button onClick={() => onDelete(bot.id)} className="p-2 rounded-md hover:bg-[var(--background)]">
                <TrashIcon className="h-4 w-4 text-red-500"/>
            </button>
        </div>
    </Card>
);

const ChatFlowEditor = ({ bot: initialBot, onSave, onBack }) => {
    const [bot, setBot] = useState(initialBot);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialBot.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialBot.edges);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
    
    const handleSave = () => {
        onSave({ ...bot, nodes, edges });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center pb-4">
                <div className="flex items-center gap-2">
                     <button onClick={onBack} className="p-2 rounded-md hover:bg-[var(--background)]"><ChevronLeftIcon className="h-5 w-5"/></button>
                     <input type="text" value={bot.name} onChange={e => setBot({...bot, name: e.target.value})} className="text-xl font-bold bg-transparent focus:outline-none p-2 rounded-md focus:bg-[var(--background)]"/>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSave} className="px-3 py-2 text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90 flex items-center gap-1"><SaveIcon className="h-4 w-4"/> Guardar y Cerrar</button>
                </div>
            </div>
            <div className="flex-grow flex gap-4">
                <aside className="w-64 p-4 bg-[var(--card)] rounded-lg overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Pasos de Flujo</h3>
                     <div className="space-y-2">
                         <div className="p-3 bg-[var(--background)] rounded-md cursor-grab"><MessageIcon className="h-4 w-4 inline mr-2"/>Enviar Mensaje</div>
                         <div className="p-3 bg-[var(--background)] rounded-md cursor-grab"><SendIcon className="h-4 w-4 inline mr-2"/>Esperar Respuesta</div>
                         <div className="p-3 bg-[var(--background)] rounded-md cursor-grab"><ButtonIcon className="h-4 w-4 inline mr-2"/>Mostrar Botones</div>
                         <div className="p-3 bg-[var(--background)] rounded-md cursor-grab"><BranchIcon className="h-4 w-4 inline mr-2"/>Condición</div>
                         <div className="p-3 bg-[var(--background)] rounded-md cursor-grab"><CrmIcon className="h-4 w-4 inline mr-2"/>Actualizar CRM</div>
                    </div>
                </aside>
                <main className="flex-1 h-full rounded-lg overflow-hidden border border-[var(--border)]">
                     <ReactFlow
                        nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView className="bg-gray-100 dark:bg-gray-900"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        <Controls />
                    </ReactFlow>
                </main>
            </div>
        </div>
    );
};

const ChatbotsPage: React.FC = () => {
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [editingBot, setEditingBot] = useState<Chatbot | null>(null);

    useEffect(() => {
        const savedBots = localStorage.getItem(CHATBOTS_STORAGE_KEY);
        setChatbots(savedBots ? JSON.parse(savedBots) : initialChatbots);
    }, []);

    const saveChatbots = (newBots: Chatbot[]) => {
        setChatbots(newBots);
        localStorage.setItem(CHATBOTS_STORAGE_KEY, JSON.stringify(newBots));
    };
    
    const handleCreate = () => {
        const newBot: Chatbot = {
            id: `bot_${Date.now()}`,
            name: 'Nuevo Bot',
            platform: 'instagram',
            status: 'inactive',
            nodes: [],
            edges: [],
        };
        setEditingBot(newBot);
    };

    const handleSave = (botToSave: Chatbot) => {
        const exists = chatbots.some(b => b.id === botToSave.id);
        const newBots = exists ? chatbots.map(b => b.id === botToSave.id ? botToSave : b) : [...chatbots, botToSave];
        saveChatbots(newBots);
        setEditingBot(null);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este chatbot?')) {
            saveChatbots(chatbots.filter(b => b.id !== id));
        }
    };
    
    const handleToggleStatus = (id: string) => {
        saveChatbots(chatbots.map(b => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    };

    if (editingBot) {
        return <ReactFlowProvider><ChatFlowEditor bot={editingBot} onSave={handleSave} onBack={() => setEditingBot(null)} /></ReactFlowProvider>;
    }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold flex items-center"><ChatbotIcon className="h-8 w-8 mr-3"/> Chatbots Omnicanal</h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Gestiona tus asistentes virtuales para todas tus plataformas.</p>
            </div>
            <button onClick={handleCreate} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                <PlusIcon className="h-5 w-5 mr-2"/>
                Crear Nuevo Bot
            </button>
        </div>
        <div className="space-y-4">
            {chatbots.map(bot => (
                <ChatbotItem key={bot.id} bot={bot} onEdit={setEditingBot} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
            ))}
        </div>
    </div>
  );
};

export default ChatbotsPage;