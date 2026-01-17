




import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, useEdgesState, useNodesState, addEdge } from 'reactflow';
import { 
    AutomationIcon, CrmIcon, ChatbotIcon, MessageIcon, PlusIcon, PlayIcon, SaveIcon, 
    ZapIcon, BranchIcon as LogicIcon, ClockIcon, DatabaseIcon, FinancialsIcon, 
    CodeIcon, SplitIcon, MergeIcon, CheckIcon, WandIcon, FileTextIcon, ChevronLeftIcon, EditIcon, TrashIcon
} from '../components/icons/InterfaceIcons';
import { generateAutomationFlow } from '../services/geminiService';
import { useCredits } from '../context/CreditContext';
import Card from '../components/Card';

interface Automation {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  isActive: boolean;
}

const AUTOMATIONS_STORAGE_KEY = 'nexuspro_automations';

const initialNodes = [
  { id: '1', type: 'input', data: { label: <div className="flex items-center"><CrmIcon className="h-5 w-5 mr-2 text-blue-400"/> Nuevo Lead en CRM</div> }, position: { x: 50, y: 150 }, className: '!border-2 !border-blue-500 !text-blue-500' },
  { id: '2', data: { label: <div className="flex items-center"><MessageIcon className="h-5 w-5 mr-2 text-[var(--accent-color)]"/> Enviar Email de Bienvenida</div> }, position: { x: 300, y: 150 } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--accent-color)', strokeWidth: 2 } }];

const initialAutomations: Automation[] = [{
  id: 'automation_default',
  name: 'Bienvenida a Nuevos Leads',
  nodes: initialNodes,
  edges: initialEdges,
  isActive: true,
}];


const DraggableNode = ({ type, label, icon, nodeData }) => {
    const onDragStart = (event, nodeType, nodeData) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({type: nodeType, data: nodeData}));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div 
            className="flex items-center p-3 mb-2 bg-[var(--background)] rounded-lg cursor-grab border border-[var(--border)] hover:bg-[var(--card)] transition-all duration-200"
            onDragStart={(event) => onDragStart(event, type, nodeData)}
            draggable
        >
           {icon} {label}
        </div>
    );
};

const AutomationEditor = ({ automation: initialAutomation, onSave, onBack }) => {
    const reactFlowWrapper = useRef(null);
    const [automation, setAutomation] = useState(initialAutomation);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialAutomation.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialAutomation.edges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    
    const { credits, deductCredits } = useCredits();
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--accent-color)', strokeWidth: 2 } }, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        if (!reactFlowWrapper.current || !reactFlowInstance) return;
        const dataStr = event.dataTransfer.getData('application/reactflow');
        if (!dataStr) return;
        const data = JSON.parse(dataStr);
        const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNode = { id: `dndnode_${+new Date()}`, type: data.type, position, data: { label: data.data.label }, className: data.data.className };
        setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance, setNodes]);
    
    const handleSave = () => {
        onSave({ ...automation, nodes, edges });
    };

    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim() || credits < 20) return;
        setIsAiLoading(true);
        if (deductCredits(20)) {
            const result = await generateAutomationFlow(aiPrompt);
            if (result && result.nodes && result.edges) {
                setNodes(result.nodes);
                setEdges(result.edges);
            } else {
                alert('La IA no pudo generar el flujo. Intenta refinar tu descripción.');
            }
        }
        setIsAiLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                     <button onClick={onBack} className="p-2 rounded-md hover:bg-[var(--background)]"><ChevronLeftIcon className="h-5 w-5"/></button>
                     <input type="text" value={automation.name} onChange={e => setAutomation({...automation, name: e.target.value})} className="text-xl font-bold bg-transparent focus:outline-none p-2 rounded-md focus:bg-[var(--background)]"/>
                </div>
                <button onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <SaveIcon className="h-5 w-5 mr-2"/> Guardar y Cerrar
                </button>
            </div>
             <div className="flex-grow flex mt-4 h-[calc(100vh-220px)] gap-4">
                <aside className="w-72 p-4 bg-[var(--card)] rounded-lg overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Nodos</h3>
                    <DraggableNode type="input" label="Nuevo Lead CRM" nodeData={{data: {label: <div className="flex items-center"><CrmIcon className="h-5 w-5 mr-2 text-blue-400"/>Nuevo Lead</div>, className: '!border-blue-500 !text-blue-500'}}} icon={<CrmIcon className="h-5 w-5 mr-2"/>} />
                    <DraggableNode type="default" label="Enviar Email" nodeData={{data: {label: <div className="flex items-center"><MessageIcon className="h-5 w-5 mr-2 text-[var(--accent-color)]"/>Enviar Email</div>}}} icon={<MessageIcon className="h-5 w-5 mr-2"/>}/>
                    <DraggableNode type="default" label="Retraso" nodeData={{data: {label: <div className="flex items-center"><ClockIcon className="h-5 w-5 mr-2 text-yellow-400"/>Retraso (Delay)</div>}}} icon={<ClockIcon className="h-5 w-5 mr-2"/>}/>
                    <DraggableNode type="output" label="Finalizar" nodeData={{data: {label: <div className="flex items-center">🏁 Finalizar Flujo</div>, className: '!border-red-500 !text-red-500'}}} icon={<span className="mr-2">🏁</span>}/>
                </aside>
                <div className="flex-1 h-full rounded-lg overflow-hidden" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                        onConnect={onConnect} onInit={setReactFlowInstance} onDrop={onDrop} onDragOver={onDragOver}
                        fitView className="bg-gray-100 dark:bg-gray-900"
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    </ReactFlow>
                </div>
                <aside className="w-80 p-4 bg-[var(--card)] rounded-lg flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Asistente IA</h3>
                     <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Describe tu automatización..." className="w-full flex-grow p-2 text-sm bg-[var(--background)] rounded-md border border-[var(--border)]"/>
                     <button onClick={handleGenerateWithAI} disabled={isAiLoading || credits < 20} className="w-full mt-2 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                        {isAiLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <><WandIcon className="h-5 w-5 mr-2"/> Generar (20 créd.)</>}
                     </button>
                </aside>
            </div>
        </div>
    )
};

const AutomationsPage = () => {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

    useEffect(() => {
        const savedAutomations = localStorage.getItem(AUTOMATIONS_STORAGE_KEY);
        setAutomations(savedAutomations ? JSON.parse(savedAutomations) : initialAutomations);
    }, []);

    const saveAutomations = (newAutomations: Automation[]) => {
        setAutomations(newAutomations);
        localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(newAutomations));
    };
    
    const handleNew = () => {
        const newAutomation: Automation = {
            id: `automation_${Date.now()}`,
            name: 'Nueva Automatización',
            nodes: [],
            edges: [],
            isActive: false,
        };
        setEditingAutomation(newAutomation);
    };

    const handleSave = (automationToSave: Automation) => {
        const exists = automations.some(a => a.id === automationToSave.id);
        const newAutomations = exists ? automations.map(a => a.id === automationToSave.id ? automationToSave : a) : [...automations, automationToSave];
        saveAutomations(newAutomations);
        setEditingAutomation(null);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta automatización?')) {
            saveAutomations(automations.filter(a => a.id !== id));
        }
    };
    
    const toggleActive = (id: string) => {
        saveAutomations(automations.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    };

    if (editingAutomation) {
        return (
             <ReactFlowProvider>
                <AutomationEditor automation={editingAutomation} onSave={handleSave} onBack={() => setEditingAutomation(null)} />
             </ReactFlowProvider>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center pb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><AutomationIcon className="h-8 w-8 mr-3"/> Automatizaciones</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Crea flujos de trabajo para automatizar tus tareas repetitivas.</p>
                </div>
                <button onClick={handleNew} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/> Nueva Automatización
                </button>
            </div>
            <div className="space-y-4">
                {automations.map(auto => (
                     <Card key={auto.id} className="!p-4 flex items-center justify-between">
                         <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-4 ${auto.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <div>
                                <p className="font-bold">{auto.name}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">{auto.nodes.length} pasos</p>
                            </div>
                         </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => toggleActive(auto.id)} className={`px-3 py-1 text-xs rounded-full ${auto.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{auto.isActive ? 'Activa' : 'Inactiva'}</button>
                             <button onClick={() => setEditingAutomation(auto)} className="p-2 hover:bg-[var(--background)] rounded-md"><EditIcon className="h-4 w-4"/></button>
                             <button onClick={() => handleDelete(auto.id)} className="p-2 hover:bg-[var(--background)] rounded-md"><TrashIcon className="h-4 w-4 text-red-500"/></button>
                        </div>
                     </Card>
                ))}
            </div>
        </div>
    );
};

export default AutomationsPage;