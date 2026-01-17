import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate } from '../../types';
import Card from '../Card';
import { SaveIcon, ChevronLeftIcon, DatabaseIcon, UserIcon, ShoppingCartIcon } from '../icons/InterfaceIcons';

interface DocumentEditorProps {
    template: DocumentTemplate;
    onSave: (template: DocumentTemplate) => void;
    onBack: () => void;
}

const dynamicVariables = {
    'Cliente': [
        { placeholder: '{{customer.name}}', label: 'Nombre del Cliente' },
        { placeholder: '{{customer.email}}', label: 'Email del Cliente' },
        { placeholder: '{{customer.company}}', label: 'Empresa del Cliente' },
    ],
    'Pedido': [
        { placeholder: '{{order.id}}', label: 'ID del Pedido' },
        { placeholder: '{{order.date}}', label: 'Fecha del Pedido' },
        { placeholder: '{{order.total}}', label: 'Total del Pedido' },
    ],
     'General': [
        { placeholder: '{{current.date}}', label: 'Fecha Actual' },
    ],
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({ template, onSave, onBack }) => {
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = template.content;
        }
    }, [template.content]);

    const handleSave = () => {
        if (contentRef.current) {
            onSave({
                ...template,
                name,
                description,
                content: contentRef.current.innerHTML,
            });
        }
    };
    
    const insertVariable = (placeholder: string) => {
        if (contentRef.current) {
            contentRef.current.focus();
            document.execCommand('insertHTML', false, ` <span style="color: hsl(var(--accent-hue) var(--accent-saturation) var(--accent-lightness)); background-color: rgba(139, 92, 246, 0.1); padding: 2px 4px; border-radius: 4px;">${placeholder}</span>&nbsp;`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                     <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                        <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Documentos
                     </button>
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-lg font-bold bg-transparent focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md px-2" />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSave} className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                        <SaveIcon className="h-5 w-5 mr-2"/> Guardar Plantilla
                    </button>
                </div>
            </header>

            <div className="flex-grow flex overflow-hidden">
                <main className="flex-1 flex justify-center p-8 bg-gray-100 dark:bg-gray-900/50 overflow-y-auto">
                    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl p-12" style={{aspectRatio: '210 / 297'}}>
                        <div
                            ref={contentRef}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            className="h-full w-full focus:outline-none prose dark:prose-invert max-w-none"
                        >
                            {/* The initial content is set by useEffect */}
                        </div>
                    </div>
                </main>
                <aside className="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Variables Dinámicas</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Haz clic para insertar variables que se rellenarán automáticamente.</p>
                    
                    <div className="space-y-4">
                        {Object.entries(dynamicVariables).map(([group, vars]) => (
                            <div key={group}>
                                <h4 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-300 flex items-center">
                                    {group === 'Cliente' && <UserIcon className="h-4 w-4 mr-2"/>}
                                    {group === 'Pedido' && <ShoppingCartIcon className="h-4 w-4 mr-2"/>}
                                    {group === 'General' && <DatabaseIcon className="h-4 w-4 mr-2"/>}
                                    {group}
                                </h4>
                                <div className="space-y-1">
                                    {vars.map(v => (
                                        <button key={v.placeholder} onClick={() => insertVariable(v.placeholder)} className="w-full text-left text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700">
                                            {v.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DocumentEditor;