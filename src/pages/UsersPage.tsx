import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { UsersIcon, SearchIcon } from '../components/icons/InterfaceIcons';
import { User } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const USERS_KEY = 'nexuspro_users';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');

    useEffect(() => {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            // Add some initial data if none exists
            const initialUserData: User[] = [
              { id: 'user_1', name: 'Usuario de Ejemplo', email: 'ejemplo@nexuspro.io', source: 'Registro', registeredAt: new Date().toISOString(), avatar: 'https://i.pravatar.cc/150?u=ejemplo@nexuspro.io' }
            ];
            setUsers(initialUserData);
            localStorage.setItem(USERS_KEY, JSON.stringify(initialUserData));
        }
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = sourceFilter === 'all' || user.source === sourceFilter;
        return matchesSearch && matchesFilter;
    });

    const sources = ['all', ...Array.from(new Set(users.map(u => u.source)))];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <UsersIcon className="h-8 w-8 mr-3"/> Usuarios y Leads
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Una base de datos central de todos los usuarios registrados y leads capturados.</p>
            </div>
            
            <Card className="!p-4">
                 <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                     <div className="flex-shrink-0">
                         <select 
                            value={sourceFilter} 
                            onChange={e => setSourceFilter(e.target.value)} 
                            className="w-full md:w-auto px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                         >
                             {sources.map(source => (
                                 <option key={source} value={source}>
                                     {source === 'all' ? 'Todas las Fuentes' : source}
                                 </option>
                             ))}
                         </select>
                    </div>
                </div>
            </Card>

            <Card className="!p-0">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fuente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                            {user.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{format(new Date(user.registeredAt), 'Pp', { locale: es })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && <p className="text-center py-8 text-gray-500">No se encontraron usuarios.</p>}
                </div>
            </Card>

        </div>
    );
};

export default UsersPage;