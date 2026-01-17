import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { FileTextIcon, PlusIcon, EditIcon, WandIcon, TrashIcon, DownloadIcon, BrainIcon } from '../components/icons/InterfaceIcons';
import DocumentEditor from '../components/documents/DocumentEditor';
import { DocumentTemplate, UserDocument, UserRole } from '../types';
import { useCredits } from '../context/CreditContext';
import { analyzeLegalDocument } from '../services/geminiService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Page, PublicRoute } from '../types';

// --- ADMIN VIEW: TEMPLATE MANAGEMENT ---

const initialTemplates: DocumentTemplate[] = [
    { id: 'inv-001', name: 'Factura Estándar', description: 'Plantilla de factura simple con logo y tabla de ítems.', content: '<h1>Factura</h1><p>Gracias por su compra.</p>' },
    { id: 'prop-001', name: 'Propuesta de Servicios', description: 'Plantilla para enviar propuestas comerciales a clientes.', content: '<h1>Propuesta</h1><p>Detalles del servicio...</p>' },
    { id: 'con-001', name: 'Contrato de Confidencialidad', description: 'Acuerdo de no divulgación (NDA) estándar.', content: '<h1>NDA</h1><p>Acuerdo de confidencialidad...</p>' },
];

const AdminDocumentsView: React.FC<{ onNavigate: (page: Page | PublicRoute | string) => void }> = ({ onNavigate }) => {
    const [templates, setTemplates] = useState<DocumentTemplate[]>(initialTemplates);
    const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

    const handleSaveTemplate = (updatedTemplate: DocumentTemplate) => {
        if (templates.find(t => t.id === updatedTemplate.id)) {
            setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        } else {
            setTemplates([...templates, { ...updatedTemplate, id: `tpl-${Date.now()}` }]);
        }
        setEditingTemplate(null);
    };

    const handleCreateNew = () => {
        setEditingTemplate({
            id: '',
            name: 'Nueva Plantilla',
            description: '',
            content: '<h1>Título del Documento</h1><p>Empieza a editar tu contenido aquí...</p>',
        });
    };

    if (editingTemplate) {
        return <DocumentEditor template={editingTemplate} onSave={handleSaveTemplate} onBack={() => setEditingTemplate(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FileTextIcon className="h-8 w-8 mr-3"/> Plantillas de Documentos
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Crea y gestiona plantillas para contratos, facturas y propuestas.</p>
                </div>
                <button onClick={handleCreateNew} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Crear Plantilla
                </button>
            </div>
            <div className="space-y-4">
                {templates.map(template => (
                    <Card key={template.id} className="!p-4 flex items-center">
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 mr-4">
                            <FileTextIcon className="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-gray-800 dark:text-gray-100">{template.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                        </div>
                        <button onClick={() => setEditingTemplate(template)} className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <EditIcon className="h-4 w-4 mr-2"/>
                            Editar
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};


// --- CLIENT VIEW: MY DOCUMENTS WORKSPACE ---

const USER_DOCUMENTS_KEY = 'nexuspro_user_documents';
const initialUserDocuments: UserDocument[] = [
    { id: 'user_doc_1', title: 'Mi Contrato de Arrendamiento', content: 'Este es un contrato de arrendamiento entre Juan Pérez y María Lopez...', createdAt: new Date().toISOString(), status: 'Borrador' },
    { id: 'user_doc_2', title: 'Acuerdo de Servicios Freelance', content: 'Acuerdo para la prestación de servicios de diseño gráfico para el cliente XYZ Corp. Incluye cláusulas de pago, propiedad intelectual y confidencialidad.', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Analizado' },
];

const AiAnalysisModal = ({ document, onClose, onAnalysisComplete }) => {
    const [analysis, setAnalysis] = useState<{ summary: string; risks: string[]; suggestions: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { credits, deductCredits } = useCredits();

    useEffect(() => {
        const performAnalysis = async () => {
            if (credits < 20) {
                setError('Créditos insuficientes para realizar el análisis.');
                setIsLoading(false);
                return;
            }
            if(deductCredits(20)) {
                const result = await analyzeLegalDocument(document.content);
                if (result) {
                    setAnalysis(result);
                    onAnalysisComplete();
                } else {
                    setError('La IA no pudo analizar el documento. Por favor, inténtalo de nuevo.');
                }
            }
            setIsLoading(false);
        };
        performAnalysis();
    }, [document.content, deductCredits, credits, onAnalysisComplete]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center"><BrainIcon className="h-6 w-6 mr-2 text-purple-500"/> Análisis con IA</h2>
                {isLoading && (
                    <div className="text-center p-8">
                        <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500">Analizando tu documento... Esto puede tardar unos segundos.</p>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {analysis && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <h3 className="font-semibold">Resumen Ejecutivo</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{analysis.summary}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-500">Posibles Riesgos</h3>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {analysis.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold text-green-500">Sugerencias de Mejora</h3>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {analysis.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Cerrar</button>
                </div>
            </Card>
        </div>
    );
};

const ClientDocumentsView: React.FC = () => {
    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [analyzingDoc, setAnalyzingDoc] = useState<UserDocument | null>(null);

    useEffect(() => {
        const storedDocs = localStorage.getItem(USER_DOCUMENTS_KEY);
        setDocuments(storedDocs ? JSON.parse(storedDocs) : initialUserDocuments);
    }, []);
    
    const saveDocs = (docs: UserDocument[]) => {
        setDocuments(docs);
        localStorage.setItem(USER_DOCUMENTS_KEY, JSON.stringify(docs));
    }

    const handleNewDocument = () => {
        const newDoc: UserDocument = {
            id: `user_doc_${Date.now()}`,
            title: 'Nuevo Documento Sin Título',
            content: '',
            createdAt: new Date().toISOString(),
            status: 'Borrador'
        };
        saveDocs([newDoc, ...documents]);
    };
    
    const handleUpdateContent = (id: string, content: string) => {
        saveDocs(documents.map(doc => doc.id === id ? { ...doc, content, status: 'Borrador' } : doc));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            saveDocs(documents.filter(doc => doc.id !== id));
        }
    };
    
    const handleAnalysisComplete = (docId: string) => {
        saveDocs(documents.map(doc => doc.id === docId ? { ...doc, status: 'Analizado' } : doc));
        setAnalyzingDoc(null);
    };

    return (
        <div className="space-y-6">
            {analyzingDoc && <AiAnalysisModal document={analyzingDoc} onClose={() => setAnalyzingDoc(null)} onAnalysisComplete={() => handleAnalysisComplete(analyzingDoc.id)} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FileTextIcon className="h-8 w-8 mr-3"/> Mis Documentos
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Tu espacio de trabajo personal para crear y analizar documentos.</p>
                </div>
                <button onClick={handleNewDocument} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Nuevo Documento
                </button>
            </div>

            {documents.map(doc => (
                <Card key={doc.id}>
                    <div className="flex justify-between items-start">
                        <div>
                            <input
                                type="text"
                                value={doc.title}
                                onChange={(e) => saveDocs(documents.map(d => d.id === doc.id ? {...d, title: e.target.value} : d))}
                                className="text-lg font-bold bg-transparent focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md px-2 -ml-2"
                            />
                            <p className="text-xs text-gray-400 mt-1">Creado: {format(new Date(doc.createdAt), 'Pp', { locale: es })}</p>
                        </div>
                         <div className="flex items-center gap-2">
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doc.status === 'Analizado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{doc.status}</span>
                             <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                         </div>
                    </div>
                    <textarea 
                        value={doc.content}
                        onChange={(e) => handleUpdateContent(doc.id, e.target.value)}
                        placeholder="Empieza a escribir o pega el contenido de tu documento aquí..."
                        rows={6}
                        className="w-full mt-4 p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                     <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setAnalyzingDoc(doc)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/70">
                            <WandIcon className="h-4 w-4 mr-2"/> Analizar con IA (20 Créditos)
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                             <DownloadIcon className="h-4 w-4 mr-2"/> Exportar
                        </button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

interface DocumentsPageProps {
    userRole: UserRole;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ userRole, onNavigate }) => {
    if (userRole === 'admin') {
        return <AdminDocumentsView onNavigate={onNavigate} />;
    }
    return <ClientDocumentsView />;
};

export default DocumentsPage;