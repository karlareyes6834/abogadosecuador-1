import React, { useState } from 'react';
import { NexusProIcon, GoogleIcon, AppleIcon } from '../components/icons/InterfaceIcons';
import { User, CrmData } from '../types';

interface RegistrationPageProps {
    onRegister: () => void;
    onNavigate: (page: string) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Save to user database simulation
        const existingUsers: User[] = JSON.parse(localStorage.getItem('nexuspro_users') || '[]');
        const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            email,
            source: 'Registro',
            registeredAt: new Date().toISOString(),
            avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        localStorage.setItem('nexuspro_users', JSON.stringify([newUser, ...existingUsers]));

        // Create corresponding CRM data
        const dbCollections = JSON.parse(localStorage.getItem('nexuspro_database_collections') || '[]');
        const crmCollection = dbCollections.find(c => c.id === 'crmData');
        if (crmCollection) {
            const newCrmEntry: CrmData = {
                userId: newUser.id,
                value: 0,
                status: 'new',
                tags: ['registro-web']
            };
            crmCollection.data.push(newCrmEntry);
            localStorage.setItem('nexuspro_database_collections', JSON.stringify(dbCollections));
        }

        onRegister();
    };


    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-[var(--card)] backdrop-blur-sm border border-[var(--border)] rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <NexusProIcon className="h-12 w-auto text-[var(--accent-color)]" />
                        <h1 className="text-3xl font-black ml-3 tracking-tighter text-[var(--foreground)] font-serif">Cree su cuenta</h1>
                    </div>
                    <p className="text-[var(--muted-foreground)]">Únase a nuestro portal para gestionar sus servicios legales.</p>
                </div>
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-[var(--foreground)]">
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                             className="mt-1 block w-full px-4 py-3 rounded-md bg-[var(--background)] border-[var(--border)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 transition focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                            placeholder="Juan Pérez"
                        />
                    </div>
                     <div>
                        <label htmlFor="email-register" className="text-sm font-medium text-[var(--foreground)]">
                            Email
                        </label>
                        <input
                            id="email-register"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                             className="mt-1 block w-full px-4 py-3 rounded-md bg-[var(--background)] border-[var(--border)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 transition focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-register"className="text-sm font-medium text-[var(--foreground)]">
                            Contraseña
                        </label>
                        <input
                            id="password-register"
                            name="password"
                            type="password"
                            required
                             className="mt-1 block w-full px-4 py-3 rounded-md bg-[var(--background)] border-[var(--border)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 transition focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-[var(--primary)]"
                        >
                            Crear Cuenta
                        </button>
                    </div>
                </form>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border)]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[var(--card)] text-[var(--muted-foreground)]">O regístrate con</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                        onClick={onRegister}
                        className="w-full flex items-center justify-center py-3 px-4 border border-[var(--border)] rounded-md shadow-sm text-sm font-medium text-[var(--foreground)] bg-[var(--background)] hover:bg-opacity-80 transition"
                    >
                       <GoogleIcon className="h-5 w-5 mr-2" /> Google
                    </button>
                     <button
                        onClick={onRegister}
                        className="w-full flex items-center justify-center py-3 px-4 border border-[var(--border)] rounded-md shadow-sm text-sm font-medium text-[var(--foreground)] bg-[var(--background)] hover:bg-opacity-80 transition"
                    >
                       <AppleIcon className="h-5 w-5 mr-2" /> Apple
                    </button>
                </div>
                 <p className="text-center text-sm text-[var(--muted-foreground)]">
                    ¿Ya tienes una cuenta? <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="font-medium text-[var(--accent-color)] hover:opacity-80">Inicia sesión</a>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;