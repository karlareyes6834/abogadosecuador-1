import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, PublicRoute, WebAppComponent } from '../types';
import { 
    TextIcon, ImageIcon, ButtonIcon, ColumnsIcon, PlusIcon, DesktopIcon, TabletIcon, 
    MobileIcon, UndoIcon, RedoIcon, TrashIcon, WandIcon, SaveIcon, XIcon, EyeIcon, 
    ChevronLeftIcon, TestimonialIcon, VideoIcon, CardIcon, MessageIcon, LayoutIcon,
    TypographyIcon, PaintBrushIcon, ShadowIcon, UploadCloudIcon, ChatbotIcon, SparklesIcon, SendIcon
} from '../components/icons/InterfaceIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { generateComponentText, modifyWebAppPage } from '../services/geminiService';
import { SitePage } from './SitesPage';
import { useCredits } from '../context/CreditContext';

// --- TYPE DEFINITIONS ---
interface StyleProperties {
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    borderRadius?: string;
    boxShadow?: string;
    textAlign?: 'left' | 'center' | 'right';
    [key: string]: any;
}

// In this file, SiteComponent is an alias for WebAppComponent
type SiteComponent = WebAppComponent;

const MotionDiv = motion.div as any;

// --- COMPONENT LIBRARY ---
const componentLibrary = {
    blocks: [
        { type: 'Text', icon: <TextIcon className="w-6 h-6"/>, label: 'Texto', defaultProps: { text: 'Haz clic para editar este texto...', style: { padding: '20px' } } },
        { type: 'Button', icon: <ButtonIcon className="w-6 h-6"/>, label: 'Botón', defaultProps: { text: 'Haz Clic', ctaLink: '#', style: { padding: '20px', textAlign: 'center' } } },
        { type: 'Image', icon: <ImageIcon className="w-6 h-6"/>, label: 'Imagen', defaultProps: { src: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=800', alt: 'Placeholder', style: { padding: '10px' } } },
        { type: 'Video', icon: <VideoIcon className="w-6 h-6"/>, label: 'Video', defaultProps: { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", style: { padding: '1rem', aspectRatio: '16/9' } } },
    ],
    sections: [
        { type: 'Header', icon: <div className="w-6 h-6 border-b-2 border-current"></div>, label: 'Header', defaultProps: { title: 'Tu Logo', style: { padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg, #ffffff)' } } },
        { type: 'Hero', icon: <ImageIcon className="w-6 h-6"/>, label: 'Hero', defaultProps: { title: 'Título Impactante', subtitle: 'Un subtítulo que engancha', cta: 'Llamada a la Acción', ctaLink: '#', style: { padding: '6rem 2rem', backgroundImage: 'url(https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center', color: '#ffffff', textAlign: 'center' } as React.CSSProperties } },
        { type: 'FeatureGrid', icon: <ColumnsIcon className="w-6 h-6"/>, label: 'Rejilla', defaultProps: { title: 'Nuestras Características', features: [{ title: 'Característica 1', description: 'Descripción breve.' }, { title: 'Característica 2', description: 'Descripción breve.' }, { title: 'Característica 3', description: 'Descripción breve.' }], style: { padding: '4rem 2rem', textAlign: 'center' } } },
        { type: 'Testimonials', icon: <TestimonialIcon className="w-6 h-6"/>, label: 'Testimonios', defaultProps: { title: 'Lo que dicen nuestros clientes', quote: 'Este producto cambió mi forma de trabajar.', author: 'Cliente Satisfecho', style: { padding: '4rem 2rem', backgroundColor: 'var(--section-bg, #f9fafb)', textAlign: 'center' } as React.CSSProperties } },
        { type: 'ContactForm', icon: <MessageIcon className="h-6 w-6"/>, label: 'Formulario', defaultProps: { title: 'Contáctanos', style: { padding: '4rem 2rem' } } },
        { type: 'Footer', icon: <div className="w-6 h-6 border-t-2 border-current"></div>, label: 'Footer', defaultProps: { text: `© ${new Date().getFullYear()} Tu Empresa.`, style: { padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', backgroundColor: 'var(--section-bg, #f9fafb)' } as React.CSSProperties } },
    ]
};
const allComponents = [...componentLibrary.blocks, ...componentLibrary.sections];

// --- EDITOR SUB-COMPONENTS ---
const EditorToolbar = ({ onSave, onNavigate, onUndo, onRedo, canUndo, canRedo, deviceView, setDeviceView, togglePreview }) => (
    <div className="h-16 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('sites')} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeftIcon className="w-5 h-5"/>
            </button>
            <div className="p-1 bg-gray-200 dark:bg-gray-900 rounded-lg flex items-center">
                <button onClick={() => setDeviceView('desktop')} className={`p-1.5 rounded-md ${deviceView === 'desktop' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}><DesktopIcon className="w-5 h-5"/></button>
                <button onClick={() => setDeviceView('tablet')} className={`p-1.5 rounded-md ${deviceView === 'tablet' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}><TabletIcon className="w-5 h-5"/></button>
                <button onClick={() => setDeviceView('mobile')} className={`p-1.5 rounded-md ${deviceView === 'mobile' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}><MobileIcon className="w-5 h-5"/></button>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={onUndo} disabled={!canUndo} className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"><UndoIcon className="w-5 h-5"/></button>
                <button onClick={onRedo} disabled={!canRedo} className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"><RedoIcon className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={togglePreview} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <EyeIcon className="w-5 h-5"/> Vista Previa
            </button>
            <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <SaveIcon className="w-5 h-5"/> Guardar
            </button>
        </div>
    </div>
);

const BlocksPanel = ({ handleDragStart }) => {
    const [activeTab, setActiveTab] = useState('sections');
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex">
                    <button onClick={() => setActiveTab('sections')} className={`flex-1 py-1 text-sm rounded-md ${activeTab==='sections' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>Secciones</button>
                    <button onClick={() => setActiveTab('blocks')} className={`flex-1 py-1 text-sm rounded-md ${activeTab==='blocks' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>Bloques</button>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {componentLibrary[activeTab].map(comp => (
                        <div key={comp.type} onDragStart={(e) => handleDragStart(e, comp.type)} draggable
                             className="p-2 flex flex-col items-center text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            {comp.icon}
                            <span className="text-xs mt-1">{comp.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

const StyleAccordion = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    {icon} {title}
                </div>
                <ChevronLeftIcon className={`w-4 h-4 transition-transform ${isOpen ? '-rotate-90' : 'rotate-0'}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <MotionDiv initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50">
                            {children}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    )
}

const InspectorPanel = ({ selectedComponent, updateComponentProp, deleteComponent, handleGenerateAiText, isAiLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fontFamilies = ['Inter', 'Poppins', 'Roboto', 'Arial', 'Georgia', 'Times New Roman'];

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
    
    if (!selectedComponent) return (
      <div className="p-4">
        <h2 className="text-lg font-bold">Inspector</h2>
        <p className="text-sm text-gray-500 mt-2">Selecciona un componente para editar sus propiedades.</p>
        </div>
    );

    const { id, props } = selectedComponent;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                updateComponentProp(id, 'style.backgroundImage', `url(${reader.result})`);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
         <div className="flex flex-col h-full">
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                <h3 className="text-lg font-bold">Contenido</h3>
                {Object.entries(props).map(([key, value]) => {
                    if (key === 'style' || key === 'features' || typeof value !== 'string') return null;
                    return (
                         <div key={key}>
                            <label className="text-xs font-medium capitalize">{key}</label>
                            <div className="relative">
                                 <input type="text" value={value} onChange={e => updateComponentProp(id, key, e.target.value)} className="w-full text-sm mt-1 p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                                 <button onClick={() => handleGenerateAiText(id, key)} disabled={isAiLoading} className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
                                    <WandIcon className={`w-4 h-4 ${isAiLoading ? 'animate-pulse text-purple-500' : ''}`}/>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex-shrink-0">
                <h3 className="text-lg font-bold p-4">Estilo</h3>
                 <StyleAccordion title="Layout" icon={<LayoutIcon className="w-4 h-4"/>}>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={getNestedValue(props, 'style.padding') || ''} onChange={e => updateComponentProp(id, 'style.padding', e.target.value)} placeholder="Padding" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <input type="text" value={getNestedValue(props, 'style.margin') || ''} onChange={e => updateComponentProp(id, 'style.margin', e.target.value)} placeholder="Margin" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <input type="text" value={getNestedValue(props, 'style.width') || ''} onChange={e => updateComponentProp(id, 'style.width', e.target.value)} placeholder="Ancho" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <input type="text" value={getNestedValue(props, 'style.height') || ''} onChange={e => updateComponentProp(id, 'style.height', e.target.value)} placeholder="Alto" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                    </div>
                </StyleAccordion>
                <StyleAccordion title="Tipografía" icon={<TypographyIcon className="w-4 h-4"/>}>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input type="text" value={getNestedValue(props, 'style.fontSize') || ''} onChange={e => updateComponentProp(id, 'style.fontSize', e.target.value)} placeholder="Tamaño" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <input type="color" value={getNestedValue(props, 'style.color') || '#000000'} onChange={e => updateComponentProp(id, 'style.color', e.target.value)} className="w-full h-10 p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={getNestedValue(props, 'style.lineHeight') || ''} onChange={e => updateComponentProp(id, 'style.lineHeight', e.target.value)} placeholder="Interlineado" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                    </div>
                    <select value={getNestedValue(props, 'style.fontFamily') || ''} onChange={e => updateComponentProp(id, 'style.fontFamily', e.target.value)} className="w-full text-sm mt-2 p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        <option value="">Fuente por defecto</option>
                        {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                </StyleAccordion>
                <StyleAccordion title="Fondo" icon={<PaintBrushIcon className="w-4 h-4"/>}>
                    <div className="flex items-center gap-2">
                        <input type="color" value={getNestedValue(props, 'style.backgroundColor') || '#ffffff'} onChange={e => updateComponentProp(id, 'style.backgroundColor', e.target.value)} className="w-10 h-10 p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-gray-200 dark:bg-gray-600 rounded-md"><UploadCloudIcon className="w-5 h-5"/></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                    </div>
                     <input type="text" value={(getNestedValue(props, 'style.backgroundImage') || '').replace(/url\((['"]?)(.*?)\1\)/gi, '$2')} onChange={e => updateComponentProp(id, 'style.backgroundImage', e.target.value ? `url(${e.target.value})` : '')} placeholder="URL de imagen" className="w-full text-sm p-2 mt-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                </StyleAccordion>
                 <StyleAccordion title="Bordes y Sombra" icon={<ShadowIcon className="w-4 h-4"/>}>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={getNestedValue(props, 'style.borderRadius') || ''} onChange={e => updateComponentProp(id, 'style.borderRadius', e.target.value)} placeholder="Radio" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        <input type="text" value={getNestedValue(props, 'style.boxShadow') || ''} onChange={e => updateComponentProp(id, 'style.boxShadow', e.target.value)} placeholder="Sombra" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                    </div>
                    <div className="mt-2">
                        <label className="text-xs font-medium">Borde</label>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                            <input type="text" value={getNestedValue(props, 'style.borderWidth') || ''} onChange={e => updateComponentProp(id, 'style.borderWidth', e.target.value)} placeholder="Ancho" className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            <select value={getNestedValue(props, 'style.borderStyle') || ''} onChange={e => updateComponentProp(id, 'style.borderStyle', e.target.value)} className="w-full text-sm p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <option value="">Estilo</option>
                                <option value="solid">Sólido</option>
                                <option value="dashed">Guiones</option>
                                <option value="dotted">Puntos</option>
                            </select>
                            <input type="color" value={getNestedValue(props, 'style.borderColor') || '#000000'} onChange={e => updateComponentProp(id, 'style.borderColor', e.target.value)} className="w-full h-10 p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        </div>
                    </div>
                </StyleAccordion>
            </div>
            <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => deleteComponent(id)} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50">
                    <TrashIcon className="w-4 h-4"/> Eliminar Componente
                </button>
            </div>
         </div>
    );
};

const ChatPanel = ({ history, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                           <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                           </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Cambia el título a..." className="flex-grow px-3 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <button type="submit" disabled={isLoading} className="p-2 rounded-full bg-purple-600 text-white disabled:bg-gray-400">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

const RightPanel = ({ activeTab, setActiveTab, inspectorProps, chatProps }) => (
     <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex">
                <button onClick={() => setActiveTab('inspector')} className={`flex-1 py-1 text-sm rounded-md flex items-center justify-center gap-2 ${activeTab==='inspector' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>
                    <SparklesIcon className="w-4 h-4" /> Inspector
                </button>
                <button onClick={() => setActiveTab('chat')} className={`flex-1 py-1 text-sm rounded-md flex items-center justify-center gap-2 ${activeTab==='chat' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>
                    <ChatbotIcon className="w-4 h-4" /> AI Chat
                </button>
            </div>
        </div>
        <div className="flex-grow overflow-hidden">
            {activeTab === 'inspector' ? <InspectorPanel {...inspectorProps} /> : <ChatPanel {...chatProps} />}
        </div>
    </aside>
);


const Canvas = ({ page, deviceView, renderComponent, dragOverIndex, handleDrop, setDragOverIndex }) => (
    <main className="flex-1 bg-gray-100 dark:bg-gray-900/50 flex justify-center items-start p-8 overflow-y-auto">
        <MotionDiv
            layout
            className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 origin-top ${
                deviceView === 'desktop' ? 'w-full' :
                deviceView === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            } ${
                deviceView !== 'desktop' ? 'h-[812px] border-8 border-gray-800 dark:border-gray-600 rounded-3xl overflow-hidden' : ''
            }`}
        >
            <div
                className="w-full h-full overflow-y-auto"
                onDragOver={(e) => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const children = Array.from(target.children).filter(c => c.id.startsWith('comp-wrapper-'));
                    const dropY = e.clientY;
                    
                    if (children.length === 0) {
                        setDragOverIndex(0);
                        return;
                    }
                    
                    let closestIndex = -1;
                    let smallestDistance = Infinity;

                    children.forEach((child, index) => {
                        const childRect = child.getBoundingClientRect();
                        const midY = childRect.top + childRect.height / 2;
                        const distance = Math.abs(dropY - midY);

                        if (distance < smallestDistance) {
                            smallestDistance = distance;
                            closestIndex = dropY < midY ? index : index + 1;
                        }
                    });
                    if (closestIndex === -1) {
                         closestIndex = children.length;
                    }
                    setDragOverIndex(closestIndex);
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, dragOverIndex !== null ? dragOverIndex : (page?.components.length || 0))}
            >
                {page?.components.map((comp, index) => (
                    <React.Fragment key={comp.id}>
                         {dragOverIndex === index && <div className="h-2 bg-purple-500 my-2 rounded-full mx-4"/>}
                         <div id={`comp-wrapper-${comp.id}`}>{renderComponent(comp)}</div>
                    </React.Fragment>
                ))}
                {dragOverIndex === (page?.components.length || 0) && <div className="h-2 bg-purple-500 my-2 rounded-full mx-4"/>}
                 {(!page || page.components.length === 0) &&
                    <div className="flex items-center justify-center h-full text-gray-400 p-8">
                        {dragOverIndex !== null ? <div className="h-2 bg-purple-500 my-2 rounded-full w-full"/> : 'Arrastra un bloque para empezar'}
                    </div>
                 }
            </div>
        </MotionDiv>
    </main>
);

const Preview = ({ page, renderComponent, togglePreview }) => (
    <div className="absolute inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto">
        {page?.components.map(comp => renderComponent(comp, true))}
        <button
            onClick={togglePreview}
            className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-800/80 backdrop-blur-sm hover:bg-black"
        >
            <XIcon className="w-5 h-5"/> Salir de Vista Previa
        </button>
    </div>
);

const SaveConfirmationToast = ({ show }) => {
    return (
        <AnimatePresence>
            {show && (
                <MotionDiv
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full shadow-lg">
                        ¡Página guardada con éxito!
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};


// --- MAIN PAGE COMPONENT ---
interface SiteEditorProps {
    siteId: string;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

const SiteEditorPage: React.FC<SiteEditorProps> = ({ siteId, onNavigate }) => {
    const [page, setPage] = useState<SitePage | null>(null);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [history, setHistory] = useState<SitePage[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const [activeTab, setActiveTab] = useState('inspector');
    const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    // --- State & History Management ---
    const updatePageAndHistory = useCallback((newPage: SitePage) => {
        setPage(newPage);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newPage);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);
    
    useEffect(() => {
        const allPages: SitePage[] = JSON.parse(localStorage.getItem('sitePages') || '[]');
        const currentPage = allPages.find(p => p.id === siteId);
        if (currentPage) {
            const sanitizedComponents = (currentPage.components || []).map(comp => {
                if (!comp) return null;
                return { ...comp, id: String(comp.id), props: comp.props || {} };
            }).filter(Boolean) as SiteComponent[];
            const sanitizedPage = { ...currentPage, components: sanitizedComponents };
            setPage(sanitizedPage);
            setHistory([sanitizedPage]);
            setHistoryIndex(0);
        }
    }, [siteId]);

    const handleSavePage = () => {
        if (!page) return;
        const updatedPage = { ...page, lastModified: new Date().toISOString() };
        const allPages: SitePage[] = JSON.parse(localStorage.getItem('sitePages') || '[]');
        const newPages = allPages.map(p => p.id === siteId ? updatedPage : p);
        localStorage.setItem('sitePages', JSON.stringify(newPages));
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 2000);
    };

    const handleUndo = () => historyIndex > 0 && setHistoryIndex(prev => prev - 1);
    const handleRedo = () => historyIndex < history.length - 1 && setHistoryIndex(prev => prev + 1);

    useEffect(() => {
        if (history[historyIndex]) setPage(history[historyIndex]);
    }, [history, historyIndex]);

    // --- Component Logic ---
    const updateComponentProp = (id: string, propPath: string, value: any) => {
        if (!page) return;
        const newComponents = page.components.map(c => {
            if (c.id === id) {
                const newProps = JSON.parse(JSON.stringify(c.props));
                const keys = propPath.split('.');
                let current = newProps;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]] = current[keys[i]] || {};
                }
                current[keys[keys.length - 1]] = value;
                return { ...c, props: newProps };
            }
            return c;
        });
        updatePageAndHistory({ ...page, components: newComponents });
    };

    const addComponent = (type: string, index: number) => {
        if (!page) return;
        const compInfo = allComponents.find(c => c.type === type);
        const newComponent: SiteComponent = {
            id: String(Date.now()), type, props: JSON.parse(JSON.stringify(compInfo?.defaultProps || {}))
        };
        const newComponents = [...page.components];
        newComponents.splice(index, 0, newComponent);
        updatePageAndHistory({ ...page, components: newComponents });
    };

    const deleteComponent = (id: string) => {
        if (!page) return;
        const newComponents = page.components.filter(c => c.id !== id);
        updatePageAndHistory({ ...page, components: newComponents });
        setSelectedComponentId(null);
    };

    const handleDragStart = (e: React.DragEvent, type: string) => e.dataTransfer.setData('text/plain', type);
    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        if (type && allComponents.some(c => c.type === type)) addComponent(type, index);
        setDragOverIndex(null);
    };

    const { deductCredits, credits } = useCredits();
    const handleGenerateAiText = async (componentId: string, propKey: string) => {
        if (!page) return;
        const component = page.components.find(c => c.id === componentId);
        if (!component) return;

        setIsAiLoading(true);
        const originalText = component.props[propKey];
        const prompt = `Rewrite or improve this text for a website. The business is about '${page.name}'. Current text: "${originalText}"`;

        try {
            if(deductCredits(2)) {
                const newText = await generateComponentText(prompt, originalText);
                updateComponentProp(componentId, propKey, newText);
            }
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSendChatMessage = async (message: string) => {
        if (!page || credits < 5) {
            setChatHistory(prev => [...prev, { sender: 'ai', text: 'Créditos insuficientes.' }]);
            return;
        }

        setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
        setIsChatLoading(true);

        if (deductCredits(5)) {
            try {
                const result = await modifyWebAppPage(message, page.components);
                if ('error' in result) {
                    throw new Error(result.error.message);
                }
                updatePageAndHistory({ ...page, components: result.components });
                setChatHistory(prev => [...prev, { sender: 'ai', text: result.reply }]);
            } catch (error) {
                console.error("Chat AI error:", error);
                setChatHistory(prev => [...prev, { sender: 'ai', text: `Lo siento, ocurrió un error: ${error.message}` }]);
            }
        }
        setIsChatLoading(false);
    };
    
    // --- Rendering Logic ---
    const renderComponent = (comp: SiteComponent, isPreview = false) => {
        const isSelected = selectedComponentId === comp.id;
        const wrapperProps = isPreview ? {} : {
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); setSelectedComponentId(comp.id); },
            className: `relative group transition-all duration-200 ${isSelected ? 'ring-2 ring-offset-2 ring-purple-500' : 'hover:ring-2 hover:ring-dashed hover:ring-gray-400'}`
        };
        
        const isDarkTheme = document.documentElement.classList.contains('dark');
        const dynamicStyles = {
            '--section-bg': isDarkTheme ? '#1f2937' : '#f9fafb',
            '--card-bg': isDarkTheme ? '#374151' : '#ffffff',
            ...comp.props.style
        };

        let content;
        switch(comp.type) {
            case 'Header': content = <header style={dynamicStyles}><h1 className="text-xl font-bold">{comp.props.title}</h1><a href="#" className="text-sm">Contacto</a></header>; break;
            case 'Hero': content = <section style={dynamicStyles}><div className="bg-black/40 p-8 rounded-lg inline-block"><h2 className="text-4xl font-bold">{comp.props.title}</h2><p className="text-lg mt-2">{comp.props.subtitle}</p><a href={comp.props.ctaLink || '#'} className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-md">{comp.props.cta}</a></div></section>; break;
            case 'Text': content = <div className={`prose dark:prose-invert max-w-none p-4`} style={dynamicStyles}><p>{comp.props.text}</p></div>; break;
            case 'Image': content = <div style={dynamicStyles}><img src={comp.props.src} alt={comp.props.alt} className="max-w-full h-auto"/></div>; break;
            case 'FeatureGrid': content = <div style={dynamicStyles}><h2 className="text-3xl font-bold mb-8">{comp.props.title}</h2><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">{comp.props.features.map((f, i) => <div key={i}><h3>{f.title}</h3><p>{f.description}</p></div>)}</div></div>; break;
            case 'Testimonials': content = <div style={dynamicStyles}><h2 className="text-3xl font-bold mb-8">{comp.props.title}</h2><blockquote className="text-xl italic">"{comp.props.quote}"</blockquote><cite className="block mt-4">- {comp.props.author}</cite></div>; break;
            case 'Video': content = <div style={dynamicStyles}><iframe width="100%" height="100%" src={comp.props.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>; break;
            case 'ContactForm': content = <form style={dynamicStyles} className="max-w-md mx-auto space-y-4"><h2 className="text-3xl font-bold text-center mb-6">{comp.props.title}</h2><input type="text" placeholder="Nombre" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/><input type="email" placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/><textarea placeholder="Mensaje" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea><button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded w-full">Enviar</button></form>; break;
            case 'Button': content = <div style={dynamicStyles}><a href={comp.props.ctaLink} className="inline-block px-8 py-3 bg-purple-600 text-white rounded-md font-semibold">{comp.props.text}</a></div>; break;
            case 'Footer': content = <footer style={dynamicStyles}><p>{comp.props.text}</p></footer>; break;
            default: content = <div className="p-4 bg-gray-200">Componente no reconocido: {comp.type}</div>;
        }

        return <div {...wrapperProps}>{content}</div>;
    };
    
    if (!page) return <div>Cargando...</div>;
    
    const inspectorProps = {
        selectedComponent: page?.components.find(c => c.id === selectedComponentId),
        updateComponentProp: updateComponentProp,
        deleteComponent: deleteComponent,
        handleGenerateAiText: handleGenerateAiText,
        isAiLoading: isAiLoading,
    };
    const chatProps = {
        history: chatHistory,
        onSendMessage: handleSendChatMessage,
        isLoading: isChatLoading,
    };

    return (
        <div className="h-screen flex flex-col bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <AnimatePresence>
                {isPreviewing && <Preview page={page} renderComponent={renderComponent} togglePreview={() => setIsPreviewing(false)} />}
            </AnimatePresence>

            <div className={`flex flex-col h-full ${isPreviewing ? 'hidden' : ''}`}>
                <EditorToolbar
                    onSave={handleSavePage} onNavigate={onNavigate} onUndo={handleUndo} onRedo={handleRedo}
                    canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}
                    deviceView={deviceView} setDeviceView={setDeviceView} togglePreview={() => setIsPreviewing(true)}
                />
                <div className="flex-grow flex overflow-hidden">
                    <BlocksPanel handleDragStart={handleDragStart} />
                    <Canvas 
                        page={page} deviceView={deviceView} renderComponent={renderComponent} dragOverIndex={dragOverIndex}
                        handleDrop={handleDrop} setDragOverIndex={setDragOverIndex}
                    />
                    <RightPanel
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        inspectorProps={inspectorProps}
                        chatProps={chatProps}
                    />
                </div>
            </div>
             <SaveConfirmationToast show={showSaveConfirmation} />
        </div>
    );
};

export default SiteEditorPage;