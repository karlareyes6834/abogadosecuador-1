import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { ClipboardListIcon, PlusIcon, EditIcon, FileTextIcon, TrashIcon } from '../components/icons/InterfaceIcons';
import { Page, PublicRoute, Form, FormSubmission } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const FORMS_KEY = 'nexuspro_forms';
const SUBMISSIONS_KEY = 'nexuspro_form_submissions';

const initialForms: Form[] = [
    {
        id: 'form_1',
        name: 'Formulario de Contacto Principal',
        description: 'Formulario usado en la página de contacto para consultas generales.',
        fields: [
            { id: 'name', label: 'Nombre Completo', type: 'text', required: true, placeholder: 'Juan Pérez' },
            { id: 'email', label: 'Correo Electrónico', type: 'email', required: true, placeholder: 'tu@email.com' },
            { id: 'message', label: 'Mensaje', type: 'textarea', required: true, placeholder: '¿En qué podemos ayudarte?' },
        ],
        createdAt: new Date().toISOString()
    }
];

const FormCard = ({ form, submissionCount, onEdit, onViewSubmissions, onDelete }) => (
    <Card className="flex flex-col">
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold">{form.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">{form.description}</p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>{submissionCount}</strong> {submissionCount === 1 ? 'Respuesta' : 'Respuestas'}</p>
                <p>Creado el {format(new Date(form.createdAt), 'd LLL yyyy', { locale: es })}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => onDelete(form.id)} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                <button onClick={() => onViewSubmissions(form.id)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4"/> Ver Respuestas
                </button>
                <button onClick={() => onEdit(form.id)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2">
                    <EditIcon className="h-4 w-4"/> Editar
                </button>
            </div>
        </div>
    </Card>
);


const FormsPage: React.FC<{ onNavigate: (page: Page | PublicRoute | string) => void }> = ({ onNavigate }) => {
    const [forms, setForms] = useState<Form[]>([]);
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

    useEffect(() => {
        const storedForms = localStorage.getItem(FORMS_KEY);
        setForms(storedForms ? JSON.parse(storedForms) : initialForms);

        const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
        setSubmissions(storedSubmissions ? JSON.parse(storedSubmissions) : []);
    }, []);

    const handleCreateForm = () => {
        const newFormId = `form_${Date.now()}`;
        const newForm: Form = {
            id: newFormId,
            name: 'Nuevo Formulario Sin Título',
            description: 'Añade una descripción para tu nuevo formulario.',
            fields: [],
            createdAt: new Date().toISOString()
        };
        const updatedForms = [...forms, newForm];
        setForms(updatedForms);
        localStorage.setItem(FORMS_KEY, JSON.stringify(updatedForms));
        onNavigate(`form-editor/${newFormId}`);
    };

    const handleDeleteForm = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este formulario y todas sus respuestas?')) {
            const updatedForms = forms.filter(f => f.id !== id);
            setForms(updatedForms);
            localStorage.setItem(FORMS_KEY, JSON.stringify(updatedForms));

            const updatedSubmissions = submissions.filter(s => s.formId !== id);
            setSubmissions(updatedSubmissions);
            localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <ClipboardListIcon className="h-8 w-8 mr-3"/> Formularios
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Crea y gestiona formularios para capturar leads e información.</p>
                </div>
                <button onClick={handleCreateForm} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[hsl(var(--accent-hue)_var(--accent-saturation)_var(--accent-lightness))] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Crear Formulario
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {forms.map(form => (
                    <FormCard
                        key={form.id}
                        form={form}
                        submissionCount={submissions.filter(s => s.formId === form.id).length}
                        onEdit={() => onNavigate(`form-editor/${form.id}`)}
                        onViewSubmissions={() => onNavigate(`form-submissions/${form.id}`)}
                        onDelete={handleDeleteForm}
                    />
                ))}
            </div>
        </div>
    );
};

export default FormsPage;
