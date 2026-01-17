
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute } from '../types';
import { Form, FormField, FormFieldType } from '../types';
import { SaveIcon, ChevronLeftIcon, PlusIcon, TrashIcon } from '../components/icons/InterfaceIcons';

const FORMS_KEY = 'nexuspro_forms';

interface FormEditorPageProps {
    formId: string;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

const FormEditorPage: React.FC<FormEditorPageProps> = ({ formId, onNavigate }) => {
    const [form, setForm] = useState<Form | null>(null);

    useEffect(() => {
        const allForms: Form[] = JSON.parse(localStorage.getItem(FORMS_KEY) || '[]');
        const currentForm = allForms.find(f => f.id === formId);
        if (currentForm) {
            setForm(currentForm);
        }
    }, [formId]);

    const handleSaveForm = () => {
        if (!form) return;
        const allForms: Form[] = JSON.parse(localStorage.getItem(FORMS_KEY) || '[]');
        const newForms = allForms.map(f => f.id === formId ? form : f);
        localStorage.setItem(FORMS_KEY, JSON.stringify(newForms));
        alert('¡Formulario guardado!');
    };

    const handleUpdateField = (field: keyof Form, value: any) => {
        if (form) {
            setForm({ ...form, [field]: value });
        }
    };
    
    const handleAddField = () => {
        if (!form) return;
        const newField: FormField = {
            id: `field_${Date.now()}`,
            label: 'Nuevo Campo',
            type: 'text',
            required: false,
            placeholder: ''
        };
        setForm({ ...form, fields: [...form.fields, newField] });
    };

    const handleUpdateFormField = (fieldId: string, prop: keyof FormField, value: any) => {
        if (!form) return;
        setForm({
            ...form,
            fields: form.fields.map(f => f.id === fieldId ? { ...f, [prop]: value } : f)
        });
    };
    
    const handleDeleteField = (fieldId: string) => {
        if (!form) return;
        setForm({ ...form, fields: form.fields.filter(f => f.id !== fieldId) });
    }

    if (!form) return <div>Cargando formulario...</div>;

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                 <button onClick={() => onNavigate('forms')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Formularios
                 </button>
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold">{form.name}</h1>
                </div>
                <button onClick={handleSaveForm} className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                    <SaveIcon className="h-5 w-5 mr-2"/> Guardar Formulario
                </button>
            </header>
            <div className="flex-grow flex overflow-hidden">
                <main className="flex-1 p-6 overflow-y-auto space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Configuración General</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nombre del Formulario</label>
                                <input type="text" value={form.name} onChange={e => handleUpdateField('name', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                             <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <textarea value={form.description} onChange={e => handleUpdateField('description', e.target.value)} rows={2} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Campos del Formulario</h3>
                        <div className="space-y-4">
                            {form.fields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="text" value={field.label} onChange={e => handleUpdateFormField(field.id, 'label', e.target.value)} placeholder="Etiqueta del campo" className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                                        <select value={field.type} onChange={e => handleUpdateFormField(field.id, 'type', e.target.value as FormFieldType)} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                            <option value="text">Texto</option>
                                            <option value="email">Email</option>
                                            <option value="tel">Teléfono</option>
                                            <option value="textarea">Área de texto</option>
                                        </select>
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center text-sm">
                                                <input type="checkbox" checked={field.required} onChange={e => handleUpdateFormField(field.id, 'required', e.target.checked)} className="mr-2"/>
                                                Requerido
                                            </label>
                                            <button onClick={() => handleDeleteField(field.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button onClick={handleAddField} className="w-full mt-4 flex items-center justify-center gap-2 text-sm py-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                            <PlusIcon className="h-5 w-5"/> Añadir Campo
                        </button>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default FormEditorPage;