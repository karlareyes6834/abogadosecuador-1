import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute } from '../types';
import { Form, FormSubmission, User } from '../types';
import { ChevronLeftIcon, FileTextIcon } from '../components/icons/InterfaceIcons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const FORMS_KEY = 'nexuspro_forms';
const SUBMISSIONS_KEY = 'nexuspro_form_submissions';
const USERS_KEY = 'nexuspro_users';

interface FormSubmissionsPageProps {
    formId: string;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

const FormSubmissionsPage: React.FC<FormSubmissionsPageProps> = ({ formId, onNavigate }) => {
    const [form, setForm] = useState<Form | null>(null);
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

    useEffect(() => {
        const allForms: Form[] = JSON.parse(localStorage.getItem(FORMS_KEY) || '[]');
        const currentForm = allForms.find(f => f.id === formId);
        setForm(currentForm || null);

        const allSubmissions: FormSubmission[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        const formSubmissions = allSubmissions.filter(s => s.formId === formId);
        setSubmissions(formSubmissions);
        
        // --- Logic to add submissions to the user database ---
        if (formSubmissions.length > 0 && currentForm) {
            const existingUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const newUsers: User[] = [];

            formSubmissions.forEach(sub => {
                // Avoid duplicating users based on submission ID
                if (!existingUsers.some(u => u.id === `form_sub_${sub.id}`)) {
                    const nameField = currentForm.fields.find(f => f.label.toLowerCase().includes('nombre'));
                    const emailField = currentForm.fields.find(f => f.type === 'email');
                    const email = emailField ? sub.data[emailField.id] : `no-email-${sub.id}`;
                    
                    const newUser: User = {
                        id: `form_sub_${sub.id}`,
                        name: nameField ? sub.data[nameField.id] : 'Lead de Formulario',
                        email: emailField ? sub.data[emailField.id] : 'No proporcionado',
                        source: 'Formulario de Contacto',
                        registeredAt: sub.submittedAt,
                        avatar: `https://i.pravatar.cc/150?u=${email}`
                    };
                    newUsers.push(newUser);
                }
            });

            if (newUsers.length > 0) {
                const updatedUsers = [...newUsers, ...existingUsers];
                localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            }
        }
    }, [formId]);

    if (!form) return <div>Cargando respuestas...</div>;

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                 <button onClick={() => onNavigate('forms')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Formularios
                 </button>
                <div className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    <h1 className="text-lg font-bold">Respuestas: {form.name}</h1>
                </div>
                <button className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
                    Exportar a CSV
                </button>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
                <Card className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha de Envío</th>
                                    {form.fields.map(field => (
                                        <th key={field.id} className="px-6 py-3 text-left text-xs font-medium uppercase">{field.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
                                {submissions.map(submission => (
                                    <tr key={submission.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(submission.submittedAt), 'Pp', { locale: es })}</td>
                                        {form.fields.map(field => (
                                            <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm">{submission.data[field.id] || '-'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {submissions.length === 0 && (
                            <p className="text-center py-8 text-gray-500">Aún no hay respuestas para este formulario.</p>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default FormSubmissionsPage;