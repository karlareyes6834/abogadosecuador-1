import React, { useState, useEffect, useRef } from 'react';
import { MessageIcon, FireIcon, SunIcon, SnowflakeIcon, SendIcon, WandIcon, MicIcon, WhatsAppIcon, CheckCircleIcon, CrmIcon } from '../components/icons/InterfaceIcons';
import { generateChatReply, extractLeadFromConversation } from '../services/geminiService';
import { useCredits } from '../context/CreditContext';
import AudioPlayer from '../components/AudioPlayer';
import { Page, PublicRoute, User, CrmData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type LeadTemperature = 'Hot' | 'Warm' | 'Cold';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface Message {
    id: number;
    text?: string;
    sender: 'user' | 'agent';
    timestamp: string;
    audio?: { url: string; }
}

interface Conversation {
    id: number;
    contactName: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    unreadCount: number;
    temperature: LeadTemperature;
    messages: Message[];
}

interface Toast {
    show: boolean;
    message: string;
    action?: { label: string; onClick: () => void; };
}

const USERS_KEY = 'nexuspro_users';
const DATABASE_KEY = 'nexuspro_database_collections';

const initialConversations: Conversation[] = [
    { id: 1, contactName: 'Ana García', lastMessage: '¡Perfecto! Lo reviso y te comento. Gracias.', timestamp: '10:45 AM', avatar: 'https://i.pravatar.cc/150?u=ana', unreadCount: 0, temperature: 'Hot', messages: [
        { id: 1, text: 'Hola, me gustaría saber más sobre el plan Business.', sender: 'user', timestamp: '10:40 AM' },
        { id: 2, text: '¡Claro, Ana! El plan Business incluye CRM ilimitado, IA avanzada y 5 usuarios. ¿Qué te gustaría saber en específico?', sender: 'agent', timestamp: '10:42 AM' },
        { id: 3, text: '¡Perfecto! Lo reviso y te comento. Gracias.', sender: 'user', timestamp: '10:45 AM' },
    ]},
    { id: 2, contactName: 'Carlos Rivas', lastMessage: 'Ok, gracias por la info.', timestamp: 'Ayer', avatar: 'https://i.pravatar.cc/150?u=carlos', unreadCount: 2, temperature: 'Warm', messages: [
        { id: 1, text: '¿Tienen alguna integración con Zapier?', sender: 'user', timestamp: 'Ayer' },
        { id: 2, text: 'Sí, Carlos. NexusPro se integra perfectamente con Zapier para conectar miles de apps.', sender: 'agent', timestamp: 'Ayer' },
        { id: 3, text: 'Ok, gracias por la info.', sender: 'user', timestamp: 'Ayer' },
    ]},
];

const MotionDiv = motion.div as any;

const TemperatureBadge = ({ score }: { score: LeadTemperature }) => {
    const config = {
        Hot: { icon: FireIcon, text: 'Hot', color: 'text-red-500 bg-red-100 dark:bg-red-900/50' },
        Warm: { icon: SunIcon, text: 'Warm', color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50' },
        Cold: { icon: SnowflakeIcon, text: 'Cold', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/50' },
    };
    const { icon: Icon, text, color } = config[score];
    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
            <Icon className="h-3.5 w-3.5" />
            <span>{text}</span>
        </div>
    );
};

const ConversationListItem = ({ conversation, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center p-3 cursor-pointer transition-colors ${isSelected ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/20'}`}
    >
        <img src={conversation.avatar} alt={conversation.contactName} className="h-12 w-12 rounded-full mr-3" />
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
                <p className="font-semibold truncate">{conversation.contactName}</p>
                <p className="text-xs text-gray-400 flex-shrink-0">{conversation.timestamp}</p>
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">{conversation.lastMessage}</p>
                {conversation.unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{conversation.unreadCount}</span>
                )}
            </div>
        </div>
        <div className="flex-shrink-0 ml-2">
            <TemperatureBadge score={conversation.temperature} />
        </div>
    </div>
);

interface ConversationsPageProps {
  onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
  navigationPayload: any;
  clearNavigationPayload: () => void;
}

const ConversationsPage: React.FC<ConversationsPageProps> = ({ onNavigate, navigationPayload, clearNavigationPayload }) => {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(1);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isAiReplying, setIsAiReplying] = useState(false);
    const { credits, deductCredits } = useCredits();
    const [toast, setToast] = useState<Toast>({ show: false, message: '' });
    const [users, setUsers] = useState<User[]>([]);
    const [crmData, setCrmData] = useState<CrmData[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [micPermissionError, setMicPermissionError] = useState('');

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const loadCrmData = () => {
        const usersStr = localStorage.getItem(USERS_KEY);
        setUsers(usersStr ? JSON.parse(usersStr) : []);

        const dbStr = localStorage.getItem(DATABASE_KEY);
        if (dbStr) {
            const db = JSON.parse(dbStr);
            const crmCollection = db.find(c => c.id === 'crmData');
            setCrmData(crmCollection ? crmCollection.data : []);
        }
    };
    
    useEffect(() => {
        loadCrmData();
    }, []);

     useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const updateConversation = (newMessage: Message) => {
        if (!selectedConversation) return;
        const updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage],
            lastMessage: newMessage.text || 'Mensaje de voz',
            timestamp: format(new Date(), 'p')
        };
        setConversations(convs => convs.map(c => c.id === selectedConversationId ? updatedConversation : c));
    };

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            text: currentMessage,
            sender: 'agent',
            timestamp: format(new Date(), 'p'),
        };
        updateConversation(newMessage);
        setCurrentMessage('');
    };

    const handleSendAudio = (audioUrl: string) => {
        const newMessage: Message = {
            id: Date.now(),
            sender: 'agent',
            timestamp: format(new Date(), 'p'),
            audio: { url: audioUrl }
        };
        updateConversation(newMessage);
    };

    const handleStartRecording = async () => {
        setMicPermissionError('');
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMicPermissionError('Tu navegador no soporta la grabación de audio.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                handleSendAudio(audioUrl);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            setMicPermissionError('Se necesita permiso para acceder al micrófono.');
            console.error("Mic permission error:", err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleGenerateReply = async () => {
        if (!selectedConversation || isAiReplying || credits < 5) return;

        setIsAiReplying(true);
        if (deductCredits(5)) {
            try {
                const history = selectedConversation.messages.map(m => `${m.sender === 'user' ? selectedConversation.contactName : 'Agente'}: ${m.text || '[Mensaje de voz]'}`).join('\n');
                const trainingContext = localStorage.getItem('ai_training_context') || undefined;
                const reply = await generateChatReply(history, trainingContext);
                const newMessage: Message = {
                    id: Date.now(),
                    text: reply,
                    sender: 'agent',
                    timestamp: format(new Date(), 'p'),
                };
                updateConversation(newMessage);
            } catch (error) {
                 setToast({ show: true, message: `Error de IA: ${error.message}` });
                 setTimeout(() => setToast({ show: false, message: '' }), 3000);
            }
        }
        setIsAiReplying(false);
    };
    
    const handleExtractLead = async (conversation: Conversation) => {
        if (credits < 25) {
            setToast({ show: true, message: 'Créditos insuficientes para extraer lead.' });
            setTimeout(() => setToast({ show: false, message: '' }), 3000);
            return;
        }

        setIsAiReplying(true);
        if (deductCredits(25)) {
            const history = conversation.messages.map(m => `${m.sender === 'user' ? conversation.contactName : 'Agente'}: ${m.text || '[Mensaje de voz]'}`).join('\n');
            const extractedData = await extractLeadFromConversation(history);
            
            if (extractedData) {
                const newUserId = `user_${Date.now()}`;
                const newUser: User = {
                    id: newUserId,
                    name: extractedData.name,
                    email: extractedData.email || 'no-email@via.chat',
                    phone: extractedData.phone,
                    source: 'Conversación',
                    registeredAt: new Date().toISOString(),
                    avatar: conversation.avatar,
                    company: extractedData.company,
                };
                const updatedUsers = [newUser, ...users];
                localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
                setUsers(updatedUsers);

                const newCrmEntry: CrmData = {
                    userId: newUserId,
                    value: extractedData.value,
                    status: 'new',
                    tags: [extractedData.score.toLowerCase()]
                };
                const updatedCrmData = [...crmData, newCrmEntry];
                const db = JSON.parse(localStorage.getItem(DATABASE_KEY) || '[]');
                const updatedDb = db.map(c => c.id === 'crmData' ? { ...c, data: updatedCrmData } : c);
                localStorage.setItem(DATABASE_KEY, JSON.stringify(updatedDb));
                setCrmData(updatedCrmData);

                setToast({
                    show: true, message: `¡Lead '${newUser.name}' creado en el CRM!`,
                    action: { label: 'Ver Lead', onClick: () => { onNavigate('crm', { contactName: newUser.name }); setToast({ show: false, message: '' }); } }
                });
                setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
            } else {
                setToast({ show: true, message: 'La IA no pudo extraer la información del lead.' });
                setTimeout(() => setToast(prev => ({...prev, show: false})), 5000);
            }
        }
        setIsAiReplying(false);
    };

    const isContactInCrm = selectedConversation ? users.some(user => user.name === selectedConversation.contactName) : false;
    
    const toastVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="h-full flex flex-col">
            <AnimatePresence>
                {toast.show && (
                    <MotionDiv
                        variants={toastVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4"
                    >
                        <span>{toast.message}</span>
                        {toast.action && <button onClick={toast.action.onClick} className="font-bold text-purple-300">{toast.action.label}</button>}
                    </MotionDiv>
                )}
            </AnimatePresence>
            <header className="flex-shrink-0 pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <MessageIcon className="h-8 w-8 mr-3"/> Conversaciones
                    </h1>
                </div>
            </header>
            
            <main className="flex-grow flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800/50">
                <aside className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold">Bandeja de Entrada</h2>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {conversations.map(conv => (
                            <ConversationListItem
                                key={conv.id}
                                conversation={conv}
                                isSelected={selectedConversationId === conv.id}
                                onClick={() => setSelectedConversationId(conv.id)}
                            />
                        ))}
                    </div>
                </aside>

                <section className="w-full md:w-2/3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                <img src={selectedConversation.avatar} className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                    <h3 className="font-bold">{selectedConversation.contactName}</h3>
                                    <p className="text-xs text-green-500">En línea</p>
                                </div>
                                 <div className="ml-auto flex items-center gap-2">
                                    {!isContactInCrm && (
                                        <button onClick={() => handleExtractLead(selectedConversation)} disabled={isAiReplying || credits < 25} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70 disabled:opacity-50">
                                            {isAiReplying ? <div className="h-4 w-4 border-2 border-t-purple-500 border-gray-200 rounded-full animate-spin mr-2"></div> : <WandIcon className="h-4 w-4 mr-2"/>}
                                            Extraer Lead (25)
                                        </button>
                                    )}
                                     <button onClick={() => onNavigate('crm', { contactName: selectedConversation.contactName })} className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"><CrmIcon className="h-4 w-4"/> Ver en CRM</button>
                                 </div>
                            </header>
                            
                            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                                {selectedConversation.messages.map(message => (
                                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                        {message.sender === 'user' && <img src={selectedConversation.avatar} className="h-8 w-8 rounded-full" />}
                                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${message.sender === 'agent' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
                                            {message.text && <p className="text-sm">{message.text}</p>}
                                            {message.audio && <AudioPlayer src={message.audio.url} />}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            
                            <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                {micPermissionError && <p className="text-xs text-red-500 mb-2">{micPermissionError}</p>}
                                <div className="flex items-center gap-2">
                                    <button onClick={handleGenerateReply} disabled={isAiReplying || credits < 5} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                                        <WandIcon className={`h-5 w-5 ${isAiReplying ? 'animate-pulse text-purple-500' : 'text-gray-500'}`} />
                                    </button>
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={e => setCurrentMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-grow px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {isRecording ? (
                                        <button onClick={handleStopRecording} className="p-2 rounded-full bg-red-500 text-white animate-pulse">
                                            <MicIcon className="h-5 w-5"/>
                                        </button>
                                    ) : (
                                        <button onClick={handleStartRecording} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                                            <MicIcon className="h-5 w-5"/>
                                        </button>
                                    )}
                                    <button onClick={handleSendMessage} className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700">
                                        <SendIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                       <div className="flex-grow flex items-center justify-center text-gray-400"><p>Selecciona una conversación</p></div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ConversationsPage;