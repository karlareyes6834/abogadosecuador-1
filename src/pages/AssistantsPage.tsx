import React, { useState, useCallback, useRef } from 'react';
import Card from '../components/Card';
import { AssistantsIcon, PlusIcon, PhoneCallIcon, ZapIcon, SettingsIcon, MicIcon, PlayIcon, VoicemailIcon, SentimentPositiveIcon, SentimentNegativeIcon, BrainIcon, LinkIcon, UploadCloudIcon, TrashIcon } from '../components/icons/InterfaceIcons';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, useEdgesState, useNodesState, addEdge } from 'reactflow';

// Add type declarations for Web Speech API to fix TypeScript errors
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

type Tab = 'dashboard' | 'training' | 'live_test' | 'call_flow' | 'history';

const initialCallNodes = [
  { id: '1', type: 'input', data: { label: 'Inicio de Llamada' }, position: { x: 250, y: 5 }, className: '!border-green-500 !text-green-500' },
  { id: '2', data: { label: 'Saludar y presentar' }, position: { x: 250, y: 100 } },
  { id: '3', data: { label: 'Presentar Opciones' }, position: { x: 250, y: 200 } },
  { id: '4', data: { label: 'Transferir a Ventas' }, position: { x: 100, y: 300 } },
  { id: '5', data: { label: 'Agendar Cita' }, position: { x: 400, y: 300 } },
];

const initialCallEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: 'Opción 1' },
  { id: 'e3-5', source: '3', target: '5', label: 'Opción 2' },
];

const VoiceAssistant = () => {
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('...');
    const [isListening, setIsListening] = useState(false);

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
    }

    const handleListen = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Tu navegador no soporta el reconocimiento de voz.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        setResponse('Escuchando...');

        recognition.onresult = (event) => {
            const receivedTranscript = event.results[0][0].transcript;
            setTranscript(receivedTranscript);
            // Simulate AI response
            setTimeout(() => {
                const aiResponse = `Entendido. Procesando tu solicitud para: "${receivedTranscript}".`;
                setResponse(aiResponse);
                speak(aiResponse);
            }, 1000);
        };

        recognition.onspeechend = () => {
            recognition.stop();
            setIsListening(false);
        };
        
        recognition.onerror = (event) => {
            setResponse('Hubo un error al escuchar. Inténtalo de nuevo.');
            setIsListening(false);
        }

        recognition.start();
    };

    return (
        <Card className="flex-1">
            <h3 className="font-bold text-lg mb-4">Asistente de Voz Interactivo</h3>
            <div className="space-y-4">
                <button onClick={handleListen} disabled={isListening} className={`w-full flex items-center justify-center p-4 rounded-lg text-[var(--primary-foreground)] bg-[var(--primary)] transition-all duration-300 ${isListening ? 'animate-pulse' : 'hover:opacity-90'}`}>
                    <MicIcon className="h-6 w-6 mr-3" />
                    <span className="text-lg font-semibold">{isListening ? 'Escuchando...' : 'Hablar con el Asistente'}</span>
                </button>
                <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Tú dijiste:</p>
                    <p className="font-medium min-h-[24px]">{transcript}</p>
                </div>
                <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Respuesta de IA:</p>
                    <p className="font-medium min-h-[24px]">{response}</p>
                </div>
            </div>
        </Card>
    );
}

const CallFlowBuilder = () => {
  const [nodes, , onNodesChange] = useNodesState(initialCallNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialCallEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
      <Card className="h-[500px] w-full !p-0">
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-[var(--background)] rounded-lg"
          >
              <Background />
              <Controls />
              <MiniMap />
          </ReactFlow>
      </Card>
  );
};

const TrainingCenter = () => {
    const [faqs, setFaqs] = useState<{q: string, a: string}[]>([{q: '¿Cuál es el precio?', a: 'Ofrecemos planes desde $0 (Free) hasta $39 (Business).'}]);
    const [newFaq, setNewFaq] = useState({q: '', a: ''});
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [trainingStatus, setTrainingStatus] = useState(localStorage.getItem('ai_training_status') || 'Sin entrenar');
    const [isTraining, setIsTraining] = useState(false);

    const addFaq = () => {
        if(newFaq.q.trim() && newFaq.a.trim()) {
            setFaqs([...faqs, newFaq]);
            setNewFaq({q: '', a: ''});
        }
    };
    
    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleTrain = () => {
        setIsTraining(true);
        setTrainingStatus('Entrenando...');
        
        const faqContext = faqs.map(f => `P: ${f.q}\nR: ${f.a}`).join('\n\n');
        const webContext = `Información del sitio web (${websiteUrl}): [Contenido simulado del sitio web aquí]`;
        
        const fullContext = `${faqContext}\n\n${websiteUrl ? webContext : ''}`;
        
        // Simulate training process
        setTimeout(() => {
            localStorage.setItem('ai_training_context', fullContext);
            const newStatus = `Entrenado (${new Date().toLocaleString()})`;
            localStorage.setItem('ai_training_status', newStatus);
            setTrainingStatus(newStatus);
            setIsTraining(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <Card className="flex justify-between items-center bg-[var(--accent-color)]/10 border-[var(--accent-color)]/20">
                <div>
                    <h3 className="text-lg font-bold">Estado del Asistente</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">Último entrenamiento: <span className="font-semibold text-[var(--accent-color)]">{trainingStatus}</span></p>
                </div>
                <button onClick={handleTrain} disabled={isTraining} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                    {isTraining ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div> : <BrainIcon className="h-5 w-5 mr-2"/>}
                    {isTraining ? 'Entrenando...' : 'Re-entrenar Asistente'}
                </button>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold mb-4">Base de Conocimiento (FAQs)</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-2 bg-[var(--background)] rounded-md relative group">
                                <p className="text-xs font-semibold">{faq.q}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">{faq.a}</p>
                                <button onClick={() => removeFaq(index)} className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100"><TrashIcon className="h-3 w-3 text-red-500"/></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
                        <input type="text" value={newFaq.q} onChange={e => setNewFaq({...newFaq, q: e.target.value})} placeholder="Pregunta" className="w-full p-2 text-sm rounded bg-[var(--background)] border border-[var(--border)]"/>
                        <textarea value={newFaq.a} onChange={e => setNewFaq({...newFaq, a: e.target.value})} placeholder="Respuesta" rows={2} className="w-full p-2 text-sm rounded bg-[var(--background)] border border-[var(--border)]"/>
                        <button onClick={addFaq} className="w-full text-sm py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Añadir FAQ</button>
                    </div>
                </Card>
                <div className="space-y-6">
                    <Card>
                         <h3 className="font-bold mb-2 flex items-center"><LinkIcon className="h-4 w-4 mr-2"/> Entrenamiento por URL</h3>
                         <p className="text-xs text-[var(--muted-foreground)] mb-3">La IA usará el contenido de esta URL para responder preguntas.</p>
                         <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://tuempresa.com" className="w-full p-2 text-sm rounded bg-[var(--background)] border border-[var(--border)]"/>
                    </Card>
                     <Card>
                         <h3 className="font-bold mb-2 flex items-center"><UploadCloudIcon className="h-4 w-4 mr-2"/> Subir Documentos</h3>
                         <p className="text-xs text-[var(--muted-foreground)] mb-3">Sube PDFs o archivos de texto con información de tu negocio.</p>
                         <button className="w-full py-2 border-2 border-dashed border-[var(--border)] rounded text-sm text-[var(--muted-foreground)] hover:bg-[var(--background)]">Haz clic para subir</button>
                    </Card>
                </div>
            </div>
        </div>
    );
};


const AssistantsPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('training');
    
    const TabButton = ({ tabId, label, icon }) => (
        <button onClick={() => setActiveTab(tabId)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><AssistantsIcon className="h-8 w-8 mr-3"/> Asistentes y Llamadas</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Crea, gestiona y automatiza tus agentes de voz y flujos de llamadas.</p>
                </div>
                 <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Crear Nuevo Asistente
                </button>
            </div>
            
             <div className="p-1 bg-[var(--background)] rounded-lg inline-flex items-center gap-1 flex-wrap">
                <TabButton tabId="dashboard" label="Dashboard" icon={<AssistantsIcon className="h-4 w-4"/>}/>
                <TabButton tabId="training" label="Entrenamiento" icon={<BrainIcon className="h-4 w-4"/>}/>
                <TabButton tabId="live_test" label="Prueba en Vivo" icon={<MicIcon className="h-4 w-4"/>}/>
                <TabButton tabId="call_flow" label="Flujo de Llamadas" icon={<ZapIcon className="h-4 w-4"/>}/>
                <TabButton tabId="history" label="Historial" icon={<VoicemailIcon className="h-4 w-4"/>}/>
            </div>

            {activeTab === 'dashboard' && 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <Card>
                        <h3 className="font-semibold">Llamadas Hoy</h3>
                        <p className="text-3xl font-bold">124</p>
                    </Card>
                    <Card>
                        <h3 className="font-semibold">Duración Promedio</h3>
                        <p className="text-3xl font-bold">2m 45s</p>
                    </Card>
                     <Card>
                        <h3 className="font-semibold">Tasa de Éxito</h3>
                        <p className="text-3xl font-bold">89%</p>
                    </Card>
                </div>
            }

            {activeTab === 'training' && <TrainingCenter />}

            {activeTab === 'live_test' &&
                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 lg:w-2/3">
                        <VoiceAssistant />
                    </div>
                     <div className="md:w-1/2 lg:w-1/3">
                        <Card>
                             <h3 className="font-bold text-lg mb-4">Agentes Disponibles</h3>
                             <div className="space-y-3">
                                 <div className="p-3 bg-[var(--background)] rounded-lg">Agente de Ventas</div>
                                 <div className="p-3 bg-[var(--background)] rounded-lg">Agente de Soporte</div>
                                 <div className="p-3 bg-[var(--background)] rounded-lg">Agente de Bienvenida</div>
                             </div>
                        </Card>
                    </div>
                 </div>
            }
            
            {activeTab === 'call_flow' && 
                <div>
                     <h2 className="text-xl font-bold mb-4">Editor de Flujo de Llamadas</h2>
                     <ReactFlowProvider><CallFlowBuilder /></ReactFlowProvider>
                </div>
            }

            {activeTab === 'history' &&
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Historial de Llamadas</h2>
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead><tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Contacto</th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Duración</th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sentimiento</th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Acción</th>
                        </tr></thead>
                         <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            <tr>
                                <td className="px-4 py-3">Alice Johnson</td>
                                <td className="px-4 py-3">3m 15s</td>
                                <td className="px-4 py-3"><SentimentPositiveIcon className="h-5 w-5 text-green-500"/></td>
                                <td className="px-4 py-3"><button className="text-sm text-[var(--accent-color)]">Ver Detalles</button></td>
                            </tr>
                              <tr>
                                <td className="px-4 py-3">Bob Williams</td>
                                <td className="px-4 py-3">1m 02s</td>
                                <td className="px-4 py-3"><SentimentNegativeIcon className="h-5 w-5 text-red-500"/></td>
                                <td className="px-4 py-3"><button className="text-sm text-[var(--accent-color)]">Ver Detalles</button></td>
                            </tr>
                        </tbody>
                    </table>
                 </Card>
            }
        </div>
    );
};

export default AssistantsPage;