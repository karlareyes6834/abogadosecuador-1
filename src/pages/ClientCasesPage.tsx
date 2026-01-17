import React from 'react';
import Card from '../components/Card';
import { KanbanIcon } from '../components/icons/InterfaceIcons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const mockCases = [
    { id: 1, title: 'Caso de Divorcio', status: 'En Progreso', lastUpdate: new Date(Date.now() - 2 * 24 * 3600 * 1000) },
    { id: 2, title: 'Revisión de Contrato de Arrendamiento', status: 'Finalizado', lastUpdate: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
    { id: 3, title: 'Constitución de Empresa', status: 'Por Iniciar', lastUpdate: new Date(Date.now() - 4 * 24 * 3600 * 1000) },
];

const ClientCasesPage = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center">
                    <KanbanIcon className="h-8 w-8 mr-3"/> Mis Casos
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Aquí puede ver el estado y seguimiento de sus casos legales.</p>
            </header>
            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Título del Caso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Última Actualización</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            {mockCases.map(caseItem => (
                                <tr key={caseItem.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{caseItem.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            caseItem.status === 'Finalizado' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                            caseItem.status === 'En Progreso' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">{format(caseItem.lastUpdate, 'd LLL, yyyy', { locale: es })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
export default ClientCasesPage;
