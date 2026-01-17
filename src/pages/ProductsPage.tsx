import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute } from '../types';
import { CatalogItem, CatalogItemType, Module, Lesson, Resource } from '../types';
import { PackageIcon, PlusIcon, SearchIcon, EditIcon, TrashIcon, XIcon, BookOpenIcon, ChevronDownIcon, CheckIcon } from '../components/icons/InterfaceIcons';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const CATALOG_KEY = 'nexuspro_catalog';

const LessonEditor = ({ lesson, onUpdate, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleUpdateField = (field: keyof Lesson, value: any) => {
        onUpdate({ ...lesson, [field]: value });
    };

    const handleAddResource = () => {
        const newResource: Resource = { name: 'Nuevo Recurso', url: '' };
        handleUpdateField('resources', [...(lesson.resources || []), newResource]);
    };
    
    const handleUpdateResource = (index: number, updatedResource: Resource) => {
        const updatedResources = (lesson.resources || []).map((r, i) => i === index ? updatedResource : r);
        handleUpdateField('resources', updatedResources);
    };

    const handleDeleteResource = (index: number) => {
        const updatedResources = (lesson.resources || []).filter((_, i) => i !== index);
        handleUpdateField('resources', updatedResources);
    };

    return (
        <div className="bg-[var(--background)]/50 p-3 rounded-md border border-[var(--border)]">
            <div className="flex items-center">
                <input 
                    value={lesson.title} 
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    className="text-sm flex-grow bg-transparent focus:outline-none focus:bg-white dark:focus:bg-gray-700 rounded p-1 font-medium"
                />
                <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="p-1"><ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></button>
                <button type="button" onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-3 w-3"/></button>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <MotionDiv initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-2 pt-2 border-t border-[var(--border)] space-y-2">
                            <select value={lesson.type} onChange={e => handleUpdateField('type', e.target.value)} className="w-full text-xs p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                <option value="text">Texto</option>
                                <option value="video">Video</option>
                                <option value="pdf">PDF</option>
                                <option value="evaluation">Evaluación</option>
                            </select>
                            <textarea value={lesson.content} onChange={e => handleUpdateField('content', e.target.value)} rows={3} placeholder={lesson.type === 'video' || lesson.type === 'pdf' ? 'URL del contenido...' : 'Escribe el contenido (Markdown)...'} className="w-full text-xs p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                            
                            <h5 className="text-xs font-semibold pt-2">Recursos Adjuntos</h5>
                            <div className="space-y-1">
                                {(lesson.resources || []).map((res, index) => (
                                    <div key={index} className="flex gap-1 items-center">
                                        <input value={res.name} onChange={e => handleUpdateResource(index, {...res, name: e.target.value})} placeholder="Nombre" className="w-1/2 text-xs p-1 rounded bg-white dark:bg-gray-700 border" />
                                        <input value={res.url} onChange={e => handleUpdateResource(index, {...res, url: e.target.value})} placeholder="URL" className="w-1/2 text-xs p-1 rounded bg-white dark:bg-gray-700 border" />
                                        <button type="button" onClick={() => handleDeleteResource(index)} className="p-1"><TrashIcon className="h-3 w-3 text-red-500"/></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={handleAddResource} className="text-xs text-[var(--accent-color)] mt-1">+ Añadir Recurso</button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

const ModuleEditor = ({ module, onUpdate, onDelete }) => {
    const handleAddLesson = () => {
        const newLesson: Lesson = { id: `les_${Date.now()}`, title: 'Nueva Lección', type: 'text', content: '', resources: [] };
        onUpdate({ ...module, lessons: [...module.lessons, newLesson] });
    };
    
    const handleUpdateLesson = (lessonId: string, updatedLesson: Lesson) => {
        const updatedLessons = module.lessons.map(l => l.id === lessonId ? updatedLesson : l);
        onUpdate({ ...module, lessons: updatedLessons });
    };
    
    const handleDeleteLesson = (lessonId: string) => {
        const updatedLessons = module.lessons.filter(l => l.id !== lessonId);
        onUpdate({ ...module, lessons: updatedLessons });
    };

    return (
        <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center justify-between">
                <input 
                    type="text" 
                    value={module.title} 
                    onChange={(e) => onUpdate({ ...module, title: e.target.value })}
                    className="font-semibold bg-transparent focus:outline-none focus:bg-white dark:focus:bg-gray-800 rounded px-1 w-full"
                />
                <button type="button" onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
            </div>
            <div className="mt-2 pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
                {module.lessons.map(lesson => (
                    <LessonEditor 
                        key={lesson.id}
                        lesson={lesson}
                        onUpdate={(updatedLesson) => handleUpdateLesson(lesson.id, updatedLesson)}
                        onDelete={() => handleDeleteLesson(lesson.id)}
                    />
                ))}
                <button type="button" onClick={handleAddLesson} className="text-xs text-[var(--accent-color)] mt-2">+ Añadir Lección</button>
            </div>
        </div>
    );
};

const EditModal = ({ item, type, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<CatalogItem>>({});

    useEffect(() => {
        const initialData = { ...item };
        if (type === 'course' || type === 'masterclass') {
             if (!initialData.modules) initialData.modules = [];
             else initialData.modules = initialData.modules.map(m => ({ ...m, lessons: m.lessons || [] }));
        }
        if (type === 'consulta') {
            if (!initialData.attention) initialData.attention = { modalities: [], canSchedule: true };
        }
        setFormData(initialData);
    }, [item, type]);

    const handleChange = (field: keyof CatalogItem, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
    };
    
     const handleAttentionChange = (field: 'modalities' | 'canSchedule', value: any) => {
        const currentAttention = formData.attention || { modalities: [], canSchedule: true };
        let newAttention;
        if (field === 'modalities') {
            const currentModalities = currentAttention.modalities || [];
            const newModalities = currentModalities.includes(value)
                ? currentModalities.filter(m => m !== value)
                : [...currentModalities, value];
            newAttention = { ...currentAttention, modalities: newModalities };
        } else {
            newAttention = { ...currentAttention, canSchedule: value };
        }
        handleChange('attention', newAttention);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleAddModule = () => {
        const newModule: Module = { id: `mod_${Date.now()}`, title: 'Nuevo Módulo', lessons: [] };
        handleChange('modules', [...(formData.modules || []), newModule]);
    };

    const handleUpdateModule = (moduleId: string, updatedModule: Module) => {
        handleChange('modules', (formData.modules || []).map(m => m.id === moduleId ? updatedModule : m));
    };

    const handleDeleteModule = (moduleId: string) => {
        handleChange('modules', (formData.modules || []).filter(m => m.id !== moduleId));
    };
    
    const allModalities = ['chat', 'videollamada', 'presencial', 'correo'];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{item.id ? 'Editar' : 'Crear'} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--background)]"><XIcon className="h-5 w-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    {/* Common Fields */}
                    <div><label className="text-sm font-medium">Nombre</label><input type="text" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                    <div><label className="text-sm font-medium">Descripción</label><textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={3} className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">Precio</label><input type="number" step="0.01" value={formData.price || 0} onChange={e => handleChange('price', parseFloat(e.target.value))} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                        <div><label className="text-sm font-medium">Categoría</label><input type="text" value={formData.category || ''} onChange={e => handleChange('category', e.target.value)} className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                    </div>
                    <div><label className="text-sm font-medium">URL de Imagen</label><input type="text" value={formData.imageUrl || ''} onChange={e => handleChange('imageUrl', e.target.value)} className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                    
                    {/* Type-Specific Fields */}
                    {type === 'product' && <div><label className="text-sm font-medium">Stock</label><input type="number" value={formData.stock || 0} onChange={e => handleChange('stock', parseInt(e.target.value))} className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>}
                    {type === 'service' && <div><label className="text-sm font-medium">Duración (min)</label><input type="number" value={formData.duration || 0} onChange={e => handleChange('duration', parseInt(e.target.value))} className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>}
                    {type === 'consulta' && (
                        <div className="grid grid-cols-2 gap-4">
                             <div><label className="text-sm font-medium">Duración (texto)</label><input type="text" value={formData.durationText || ''} onChange={e => handleChange('durationText', e.target.value)} placeholder="Ej: 30 minutos" className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/></div>
                             <div className="pt-6 flex items-center">
                                <input type="checkbox" id="canSchedule" checked={formData.attention?.canSchedule || false} onChange={e => handleAttentionChange('canSchedule', e.target.checked)} className="h-4 w-4 rounded mr-2"/>
                                <label htmlFor="canSchedule" className="text-sm font-medium">Permitir Agendar</label>
                             </div>
                             <div className="col-span-2">
                                <label className="text-sm font-medium">Modalidades de Atención</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {allModalities.map(modality => (
                                        <label key={modality} className="flex items-center text-sm p-2 rounded-md bg-[var(--background)]">
                                            <input type="checkbox" checked={(formData.attention?.modalities || []).includes(modality)} onChange={() => handleAttentionChange('modalities', modality)} className="h-4 w-4 rounded mr-2"/>
                                            <span className="capitalize">{modality}</span>
                                        </label>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Course/Masterclass Specific Module Editor */}
                    {(type === 'course' || type === 'masterclass') && (
                        <div>
                            <h3 className="text-lg font-semibold mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-2"><BookOpenIcon className="h-5 w-5"/>Módulos</h3>
                            <div className="space-y-3 mt-2">
                                {(formData.modules || []).map(module => (
                                    <ModuleEditor 
                                        key={module.id} 
                                        module={module}
                                        onUpdate={(updatedModule) => handleUpdateModule(module.id, updatedModule)}
                                        onDelete={() => handleDeleteModule(module.id)}
                                    />
                                ))}
                            </div>
                            <button type="button" onClick={handleAddModule} className="w-full mt-3 text-sm py-2 rounded-md border-2 border-dashed border-[var(--border)] hover:bg-[var(--background)]">+ Añadir Módulo</button>
                        </div>
                    )}
                </form>
                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--background)] hover:opacity-80">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Guardar</button>
                </div>
            </Card>
        </div>
    );
}

interface ProductsPageProps {
    onNavigate: (page: Page | PublicRoute | string) => void;
    initialFilter?: CatalogItemType;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate, initialFilter }) => {
    const [allItems, setAllItems] = useState<CatalogItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<CatalogItem> | null>(null);
    const [newItemType, setNewItemType] = useState<CatalogItemType>('product');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const addMenuRef = useRef(null);

    const loadData = () => {
        setAllItems(JSON.parse(localStorage.getItem(CATALOG_KEY) || '[]'));
    };
    
    useEffect(loadData, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
                setIsAddMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const saveData = (newItems: CatalogItem[]) => {
         localStorage.setItem(CATALOG_KEY, JSON.stringify(newItems));
         loadData();
    };

    const handleOpenModal = (item: Partial<CatalogItem> | null, type?: CatalogItemType) => {
        setEditingItem(item || {});
        if (type) setNewItemType(type);
        else if (item?.type) setNewItemType(item.type);
        setIsModalOpen(true);
        setIsAddMenuOpen(false);
    };

    const handleSave = (itemToSave: Partial<CatalogItem>) => {
        const finalItem = {
            ...itemToSave,
            type: itemToSave.id ? itemToSave.type : newItemType,
            status: itemToSave.status || 'active'
        };

        const newItems = finalItem.id 
            ? allItems.map(p => p.id === finalItem.id ? finalItem as CatalogItem : p)
            : [...allItems, { ...finalItem, id: `${newItemType}_${Date.now()}` } as CatalogItem];
        saveData(newItems);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            saveData(allItems.filter(p => p.id !== id));
        }
    };
    
    const itemsToDisplay = allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemTypes: {id: CatalogItemType, label: string}[] = [
        {id: 'product', label: 'Producto'},
        {id: 'service', label: 'Servicio'},
        {id: 'course', label: 'Curso'},
        {id: 'masterclass', label: 'Masterclass'},
        {id: 'ebook', label: 'Ebook'},
        {id: 'consulta', label: 'Consulta'},
    ];

    return (
        <div className="space-y-6">
            {isModalOpen && <EditModal item={editingItem} type={editingItem?.type || newItemType} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><PackageIcon className="h-8 w-8 mr-3"/> Gestión de Catálogo</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Gestiona todos tus productos, servicios, cursos y ebooks.</p>
                </div>
                <div className="relative" ref={addMenuRef}>
                    <button onClick={() => setIsAddMenuOpen(prev => !prev)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Añadir
                        <ChevronDownIcon className="h-4 w-4 ml-1"/>
                    </button>
                     <AnimatePresence>
                        {isAddMenuOpen && (
                            <MotionDiv initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -5}} className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                {itemTypes.map(type => (
                                    <a key={type.id} href="#" onClick={(e) => { e.preventDefault(); handleOpenModal(null, type.id); }} className="block px-4 py-2 text-sm hover:bg-[var(--background)] capitalize">{type.label}</a>
                                ))}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Card className="!p-0">
                <div className="p-4 border-b border-[var(--border)]">
                    <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            {itemsToDisplay.map(item => (
                                <tr key={item.id} className="hover:bg-[var(--background)]">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-[var(--muted-foreground)]">{item.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{item.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-[var(--accent-color)] hover:opacity-80"><EditIcon className="h-4 w-4"/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon className="h-4 w-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {itemsToDisplay.length === 0 && <p className="text-center py-8 text-[var(--muted-foreground)]">No se encontraron elementos.</p>}
                </div>
            </Card>
        </div>
    );
};

export default ProductsPage;