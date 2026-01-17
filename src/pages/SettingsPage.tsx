import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { SettingsIcon, UserIcon, TeamIcon, BillingIcon, ApiIcon, PlusIcon, BranchIcon, EditIcon, TrashIcon, PaletteIcon, OpenAiIcon, SlackIcon, SupabaseIcon, FacebookIcon, InstagramIcon, XIcon, TikTokIcon, YoutubeIcon, LinkedInIcon, TelegramIcon, DiscordIcon, NotionIcon, AirtableIcon, GoogleIcon, TwitchIcon, KickIcon, GitHubIcon, GlobeIcon, ShieldCheckIcon, EmailIcon, KeyIcon, BellIcon, BrainIcon, DatabaseIcon, BookOpenIcon, SitesIcon, CreditCardIcon, PayPalIcon, CheckCircleIcon, UploadCloudIcon } from '../components/icons/InterfaceIcons';
import { Branch } from '../types';

type Tab = 'profile' | 'team' | 'billing' | 'branches' | 'integrations' | 'domains' | 'notifications';

interface IntegrationService {
    id: string;
    name: string;
    description: string;
    icon: React.FC<any>;
    category: 'social' | 'communication' | 'dev' | 'payment';
}

interface ConnectedAccount {
    id: string; 
    serviceId: string; 
    name: string;
    credentials?: Record<string, string>;
}

const services: IntegrationService[] = [
    // Social
    { id: 'facebook', name: 'Facebook', description: 'Conecta Páginas para publicar y analizar.', icon: FacebookIcon, category: 'social' },
    { id: 'instagram', name: 'Instagram', description: 'Publica en perfiles de empresa y mira stats.', icon: InstagramIcon, category: 'social' },
    { id: 'x', name: 'X (Twitter)', description: 'Programa posts y monitorea menciones.', icon: XIcon, category: 'social' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Para perfiles personales y páginas de empresa.', icon: LinkedInIcon, category: 'social' },
    { id: 'tiktok', name: 'TikTok', description: 'Programa videos y analiza tendencias.', icon: TikTokIcon, category: 'social' },
    { id: 'youtube', name: 'YouTube', description: 'Gestiona tu canal y sube videos.', icon: YoutubeIcon, category: 'social' },
    // Communication
    { id: 'slack', name: 'Slack', description: 'Recibe notificaciones en tus canales.', icon: SlackIcon, category: 'communication' },
    { id: 'discord', name: 'Discord', description: 'Integra con tu servidor para notificaciones.', icon: DiscordIcon, category: 'communication' },
    { id: 'google', name: 'Google', description: 'Conecta Gmail, Calendar y Drive.', icon: GoogleIcon, category: 'communication' },
    // Dev
    { id: 'openai', name: 'OpenAI', description: 'Usa tu propia API key para IA.', icon: OpenAiIcon, category: 'dev' },
    { id: 'supabase', name: 'Supabase', description: 'Conecta tu proyecto de Supabase.', icon: SupabaseIcon, category: 'dev' },
    { id: 'github', name: 'GitHub', description: 'Integra con tus repositorios.', icon: GitHubIcon, category: 'dev' },
    // Payment
    { id: 'stripe', name: 'Stripe', description: 'Conecta tu cuenta para procesar pagos.', icon: CreditCardIcon, category: 'payment' },
    { id: 'paypal', name: 'PayPal', description: 'Acepta pagos a través de PayPal.', icon: PayPalIcon, category: 'payment' },
];

const categories = {
    social: 'Redes Sociales',
    communication: 'Comunicación',
    dev: 'IA y Desarrollo',
    payment: 'Pagos',
};

const SettingTab = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full text-left ${
            isActive 
                ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--background)]'
        }`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </button>
);

const ProfileSettings = () => (
    <div className="space-y-6">
        <Card>
            <h2 className="text-xl font-bold mb-4">Perfil</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Nombre Completo</label>
                    <input type="text" defaultValue="Juan Pérez" className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" defaultValue="demo@nexuspro.io" className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90">Guardar Cambios</button>
            </div>
        </Card>
         <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center"><KeyIcon className="h-5 w-5 mr-2"/> Seguridad y Contraseña</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Contraseña Actual</label>
                    <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Confirmar Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                <button onClick={() => alert('Contraseña actualizada (simulación)')} className="px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90">Actualizar Contraseña</button>
            </div>
        </Card>
        <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center"><PaletteIcon className="h-5 w-5 mr-2"/> Apariencia</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
                El tema visual (claro/oscuro) se puede cambiar usando el ícono de sol/luna en la barra de navegación superior.
            </p>
        </Card>
    </div>
);

const TeamSettings = () => (
    <div className="space-y-6">
        <Card>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Equipo</h2>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-4 w-4 mr-2"/>
                    Invitar Miembro
                </button>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-2 mb-4">Gestiona los miembros de tu equipo y sus permisos.</p>
            <div className="space-y-3">
                <div className="p-3 flex items-center justify-between bg-[var(--background)] rounded-md border border-[var(--border)]">
                    <div>
                        <p className="font-semibold">Juan Pérez (Tú)</p>
                        <p className="text-xs text-[var(--muted-foreground)]">demo@nexuspro.io</p>
                    </div>
                    <span className="text-sm font-medium text-[var(--accent-color)]">Propietario</span>
                </div>
                <div className="p-3 flex items-center justify-between bg-[var(--background)] rounded-md border border-[var(--border)]">
                     <div>
                        <p className="font-semibold">Ana García</p>
                        <p className="text-xs text-[var(--muted-foreground)]">ana@nexuspro.io</p>
                    </div>
                    <span className="text-sm">Admin</span>
                </div>
            </div>
        </Card>
    </div>
);

const BillingSettings = () => (
    <div className="space-y-6">
        <Card>
            <h2 className="text-xl font-bold mb-4">Facturación</h2>
            <div className="p-4 bg-[var(--accent-color)]/10 border-l-4 border-[var(--accent-color)] rounded-r-lg">
                <h3 className="font-semibold">Plan Business</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Tu plan se renueva el 1 de Agosto, 2024.</p>
                <button className="mt-2 text-sm font-semibold text-[var(--accent-color)]">Gestionar Suscripción</button>
            </div>
        </Card>
        <Card>
            <h2 className="text-xl font-bold mb-4">Métodos de Pago</h2>
             <div className="space-y-2">
                 <div className="p-3 flex items-center justify-between bg-[var(--background)] rounded-md">
                     <span>Visa terminada en •••• 4242</span>
                     <span className="text-xs text-white bg-blue-500 px-1.5 py-0.5 rounded-full ml-2">Primario</span>
                 </div>
            </div>
        </Card>
         <Card>
            <h2 className="text-xl font-bold mb-4">Historial de Facturas</h2>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded-md hover:bg-[var(--background)]">
                    <span>Factura #INV-2024-005 - 1 de Julio, 2024</span>
                    <a href="#" className="font-semibold text-[var(--accent-color)]">Descargar</a>
                </div>
                 <div className="flex justify-between p-2 rounded-md hover:bg-[var(--background)]">
                    <span>Factura #INV-2024-004 - 1 de Junio, 2024</span>
                    <a href="#" className="font-semibold text-[var(--accent-color)]">Descargar</a>
                </div>
            </div>
        </Card>
    </div>
);

const BranchesSettings: React.FC<{ branches: Branch[] }> = ({ branches }) => (
     <div className="space-y-6">
        <Card>
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Sucursales</h2>
                 <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-4 w-4 mr-2"/>
                    Añadir Sucursal
                </button>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-2 mb-4">Gestiona las diferentes localizaciones o entidades de tu negocio.</p>
            <div className="space-y-3">
                {branches.map(branch => (
                    <div key={branch.id} className="p-3 flex items-center justify-between bg-[var(--background)] rounded-md border border-[var(--border)]">
                        <div>
                            <p className="font-semibold">{branch.name}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{branch.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button className="p-1.5 rounded-md hover:bg-[var(--card)]"><EditIcon className="h-4 w-4"/></button>
                             <button className="p-1.5 rounded-md hover:bg-[var(--card)]"><TrashIcon className="h-4 w-4 text-red-500"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const DomainsSettings = () => {
    type DomainStatus = 'verified' | 'pending';
    interface Domain {
        id: string;
        name: string;
        isPrimary: boolean;
        dns: DomainStatus;
        ssl: DomainStatus;
        cdn: DomainStatus;
    }

    const [domains, setDomains] = useState<Domain[]>([
        { id: '1', name: 'nexuspro.io', isPrimary: true, dns: 'verified', ssl: 'verified', cdn: 'verified' },
        { id: '2', name: 'mi-otra-empresa.com', isPrimary: false, dns: 'pending', ssl: 'pending', cdn: 'pending' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDomainName, setNewDomainName] = useState('');
    const [modalStep, setModalStep] = useState(1);

    const handleAddDomain = () => {
        if (!newDomainName.trim()) return;
        const newDomain: Domain = {
            id: Date.now().toString(),
            name: newDomainName,
            isPrimary: false,
            dns: 'pending',
            ssl: 'pending',
            cdn: 'pending',
        };
        setDomains([...domains, newDomain]);
        setModalStep(2);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDomainName('');
        setModalStep(1);
    }
    
    const StatusBadge = ({ status }: { status: DomainStatus }) => {
        const isVerified = status === 'verified';
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                {isVerified ? 'Activo' : 'Pendiente'}
            </span>
        );
    };
    
    const AddDomainModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Añadir Dominio Personalizado</h2>
                {modalStep === 1 ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleAddDomain(); }} className="space-y-4">
                        <p className="text-sm text-[var(--muted-foreground)]">Conecta tu propio dominio a NexusPro.</p>
                        <div>
                            <label className="block text-sm font-medium">Nombre de Dominio</label>
                            <input type="text" value={newDomainName} onChange={e => setNewDomainName(e.target.value)} placeholder="ejemplo.com" required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                            <button type="submit" className="px-4 py-2 text-sm rounded text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Añadir Dominio</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4">Para verificar tu dominio, añade los siguientes registros en tu proveedor de dominio (ej. GoDaddy, Namecheap).</p>
                        <div className="space-y-3 text-sm p-4 bg-[var(--background)] rounded-lg font-mono">
                            <div><strong>Tipo:</strong> A <br/> <strong>Host:</strong> @ <br/> <strong>Valor:</strong> 76.76.21.21</div>
                            <div className="border-t border-[var(--border)] pt-3"><strong>Tipo:</strong> CNAME <br/> <strong>Host:</strong> www <br/> <strong>Valor:</strong> {newDomainName}</div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={closeModal} className="px-4 py-2 text-sm rounded text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Hecho</button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            {isModalOpen && <AddDomainModal />}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gestión de Dominios</h2>
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                        <PlusIcon className="h-4 w-4 mr-2"/>
                        Añadir Dominio
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Dominio</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">DNS</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">SSL</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">CDN</th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map(domain => (
                                <tr key={domain.id} className="border-b border-[var(--border)]">
                                    <td className="px-4 py-3 font-semibold">{domain.name} {domain.isPrimary && <span className="text-xs text-white bg-blue-500 px-1.5 py-0.5 rounded-full ml-2">Primario</span>}</td>
                                    <td className="px-4 py-3"><StatusBadge status={domain.dns} /></td>
                                    <td className="px-4 py-3"><StatusBadge status={domain.ssl} /></td>
                                    <td className="px-4 py-3"><StatusBadge status={domain.cdn} /></td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="p-1.5 rounded-md hover:bg-[var(--background)]" title="Gestionar"><EditIcon className="h-4 w-4"/></button>
                                        <button className="p-1.5 rounded-md hover:bg-[var(--background)]" title="Eliminar"><TrashIcon className="h-4 w-4 text-red-500"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">Gestión de Correo</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Configura reenvíos para tus dominios conectados.</p>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 items-center p-2 rounded-md">
                        <span className="font-semibold">Alias de Correo</span>
                        <span>&rarr;</span>
                        <span className="font-semibold">Reenviar a</span>
                    </div>
                    <div className="grid grid-cols-3 items-center p-2 bg-[var(--background)] rounded-md">
                        <span>ventas@nexuspro.io</span>
                        <span>&rarr;</span>
                        <span>juan.perez@nexuspro.io</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};


const NotificationsSettings = () => (
     <Card>
        <h2 className="text-xl font-bold mb-4">Configuración de Notificaciones</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">Elige qué notificaciones importantes quieres recibir.</p>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">Notificaciones por Email</h3>
                <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-[var(--background)] rounded-md">
                        <label htmlFor="email_sale">Nueva Venta Realizada</label>
                        <input type="checkbox" id="email_sale" defaultChecked className="toggle-checkbox"/>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[var(--background)] rounded-md">
                        <label htmlFor="email_lead">Nuevo Lead Calificado como 'Hot'</label>
                        <input type="checkbox" id="email_lead" defaultChecked className="toggle-checkbox"/>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="font-semibold">Notificaciones Push</h3>
                 <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-[var(--background)] rounded-md">
                        <label htmlFor="push_sale">Nueva Venta Realizada</label>
                        <input type="checkbox" id="push_sale" className="toggle-checkbox"/>
                    </div>
                </div>
            </div>
        </div>
        <style>{`.toggle-checkbox { accent-color: var(--accent-color); }`}</style>
    </Card>
);

const ConnectAccountModal = ({ service, onClose, onSave }) => {
    const [step, setStep] = useState(service.category === 'social' ? 'authenticating' : 'credentials');
    const [credentials, setCredentials] = useState({});
    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        if (service.category === 'social') {
            const timer = setTimeout(() => setStep('confirmed'), 1500);
            return () => clearTimeout(timer);
        }
    }, [service.category]);

    const handleCredentialChange = (key: string, value: string) => {
        setCredentials(prev => ({...prev, [key]: value }));
    };

    const handleConnect = () => {
        if (!accountName.trim()) {
            alert('Por favor, asigna un nombre a la cuenta.');
            return;
        }
        onSave({
            id: `${service.id}-${Date.now()}`,
            serviceId: service.id,
            name: accountName,
            credentials,
        });
    };
    
    const fieldsConfig = {
        openai: [{ name: 'apiKey', label: 'API Key', type: 'password' }],
        supabase: [{ name: 'projectUrl', label: 'Project URL', type: 'text' }, { name: 'anonKey', label: 'Anon Key', type: 'password' }],
        stripe: [{ name: 'publishableKey', label: 'Publishable Key', type: 'text' }, { name: 'secretKey', label: 'Secret Key', type: 'password' }],
        paypal: [{ name: 'clientId', label: 'Client ID', type: 'text' }, { name: 'clientSecret', label: 'Client Secret', type: 'password' }],
    };
    
    const requiredFields = fieldsConfig[service.id] || [];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 flex items-center"><service.icon className="h-6 w-6 mr-2" /> Conectar {service.name}</h2>
                {step === 'authenticating' && (
                    <div className="text-center p-8">
                        <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-[var(--accent-color)] rounded-full animate-spin"></div>
                        <p className="mt-4 text-[var(--muted-foreground)]">Redirigiendo a {service.name}...</p>
                    </div>
                )}
                {(step === 'credentials' || step === 'confirmed') && (
                     <div className="space-y-4">
                        {step === 'confirmed' && <p className="text-sm text-green-600 dark:text-green-400">¡Conexión exitosa! Ahora, configura la cuenta.</p>}
                        
                        {requiredFields.map(field => (
                            <div key={field.name}>
                                <label className="text-sm font-medium">{field.label}</label>
                                <input 
                                    type={field.type}
                                    value={credentials[field.name] || ''}
                                    onChange={e => handleCredentialChange(field.name, e.target.value)}
                                    className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="text-sm font-medium">Nombre de la Cuenta (interno)</label>
                            <input 
                                type="text"
                                value={accountName}
                                onChange={e => setAccountName(e.target.value)}
                                className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"
                                placeholder={`ej: Cuenta de ${service.name}`}
                                required
                            />
                        </div>

                         <div className="flex justify-end gap-3 pt-6">
                            <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Cancelar</button>
                            <button onClick={handleConnect} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Guardar Conexión</button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};


const IntegrationsSettings = () => {
    type RagSource = { id: string, name: string, type: 'file' | 'url', status: 'indexed' | 'processing' };
    const INTEGRATIONS_KEY = 'nexuspro_connected_accounts';

    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
    const [modalService, setModalService] = useState<IntegrationService | null>(null);
    const [ragSources, setRagSources] = useState<RagSource[]>([
        { id: '1', name: 'Base de Datos de Productos', type: 'url', status: 'indexed' },
        { id: '2', name: 'Entradas del Blog', type: 'url', status: 'indexed' },
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        const storedAccounts = localStorage.getItem(INTEGRATIONS_KEY);
        setConnectedAccounts(storedAccounts ? JSON.parse(storedAccounts) : []);
    }, []);

    const saveAccounts = (accounts: ConnectedAccount[]) => {
        setConnectedAccounts(accounts);
        localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(accounts));
    }

    const handleSaveAccount = (newAccount: ConnectedAccount) => {
        saveAccounts([...connectedAccounts, newAccount]);
        setModalService(null);
    };
    
    const handleDisconnect = (accountId: string) => {
        saveAccounts(connectedAccounts.filter(acc => acc.id !== accountId));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newSource: RagSource = {
                id: Date.now().toString(),
                name: file.name,
                type: 'file',
                status: 'processing'
            };
            setRagSources(prev => [...prev, newSource]);

            // Simulate processing and indexing
            setTimeout(() => {
                setRagSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: 'indexed' } : s));
            }, 2000);
        }
    };
    
    const handleReTrain = () => {
        alert("Simulación: Re-entrenando el asistente con todas las fuentes de datos actualizadas.");
    }


    return (
        <div className="space-y-6">
            {modalService && <ConnectAccountModal service={modalService} onClose={() => setModalService(null)} onSave={handleSaveAccount} />}
             <Card>
                <h2 className="text-xl font-bold mb-2 flex items-center"><BrainIcon className="h-5 w-5 mr-2 text-[var(--accent-color)]" /> Fuentes de Datos para IA (RAG)</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Conecta tus datos para que los asistentes de IA ofrezcan respuestas más precisas y contextualizadas.</p>
                
                 <div className="space-y-2 mb-4">
                    {ragSources.map(source => (
                        <div key={source.id} className="flex justify-between items-center p-3 bg-[var(--background)] rounded-md">
                            <div className="flex items-center gap-2">
                                {source.status === 'indexed' ? <CheckCircleIcon className="h-4 w-4 text-green-500"/> : <div className="h-4 w-4 border-2 border-t-transparent border-yellow-500 rounded-full animate-spin"></div>}
                                <span className="text-sm">{source.name}</span>
                            </div>
                            <button onClick={() => setRagSources(prev => prev.filter(s => s.id !== source.id))}><TrashIcon className="h-4 w-4 text-red-500"/></button>
                        </div>
                    ))}
                </div>
                
                 <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple={false} accept=".pdf,.txt,.md"/>
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-dashed border-[var(--border)] text-sm font-medium rounded-md text-[var(--muted-foreground)] hover:bg-[var(--background)]">
                        <UploadCloudIcon className="h-4 w-4 mr-2"/> Subir Archivo
                    </button>
                    <button onClick={handleReTrain} className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                        <BrainIcon className="h-4 w-4 mr-2"/> Re-entrenar Asistente
                    </button>
                </div>
            </Card>

             <Card>
                <h2 className="text-xl font-bold mb-4">Integraciones y Cuentas Conectadas</h2>
                {Object.entries(categories).map(([catKey, catName]) => (
                    <div key={catKey} className="mb-6">
                        <h3 className="font-semibold mb-2">{catName}</h3>
                        <div className="space-y-3">
                            {services.filter(s => s.category === catKey).map(service => {
                                const connected = connectedAccounts.filter(acc => acc.serviceId === service.id);
                                return (
                                    <div key={service.id} className="p-3 flex items-center justify-between bg-[var(--background)] rounded-md border border-[var(--border)]">
                                        <div className="flex items-center">
                                            <service.icon className="h-6 w-6 mr-3"/>
                                            <div>
                                                <p className="font-semibold">{service.name}</p>
                                                <p className="text-xs text-[var(--muted-foreground)]">{service.description}</p>
                                            </div>
                                        </div>
                                        {connected.length > 0 ? (
                                            <div className="text-right">
                                                {connected.map(acc => (
                                                    <div key={acc.id} className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{acc.name}</span>
                                                        <button onClick={() => handleDisconnect(acc.id)} className="text-xs text-red-500 hover:underline">Desconectar</button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <button onClick={() => setModalService(service)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Conectar</button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};

interface SettingsPageProps {
  branches: Branch[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ branches }) => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const tabs = [
        { id: 'profile', label: 'Perfil', icon: <UserIcon /> },
        { id: 'team', label: 'Equipo', icon: <TeamIcon /> },
        { id: 'billing', label: 'Facturación', icon: <BillingIcon /> },
        { id: 'branches', label: 'Sucursales', icon: <BranchIcon /> },
        { id: 'integrations', label: 'Integraciones', icon: <ApiIcon /> },
        { id: 'domains', label: 'Dominios y Email', icon: <GlobeIcon /> },
        { id: 'notifications', label: 'Notificaciones', icon: <BellIcon /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'team': return <TeamSettings />;
            case 'billing': return <BillingSettings />;
            case 'branches': return <BranchesSettings branches={branches} />;
            case 'integrations': return <IntegrationsSettings />;
            case 'domains': return <DomainsSettings />;
            case 'notifications': return <NotificationsSettings />;
            default: return <ProfileSettings />;
        }
    };
    
    return (
         <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center"><SettingsIcon className="h-8 w-8 mr-3"/> Configuración</h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Gestiona la configuración de tu cuenta y espacio de trabajo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="md:col-span-1">
                    <Card className="!p-2">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <SettingTab 
                                    key={tab.id}
                                    label={tab.label}
                                    icon={tab.icon}
                                    isActive={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                />
                            ))}
                        </nav>
                    </Card>
                </aside>
                <main className="md:col-span-3">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
