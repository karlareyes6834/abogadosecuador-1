import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import { CrmIcon, PlusIcon, WandIcon, FireIcon, SunIcon, SnowflakeIcon, CheckCircleIcon, MessageIcon, TagIcon, UsersIcon, KanbanIcon } from '../components/icons/InterfaceIcons';
import { useCredits } from '../context/CreditContext';
import { analyzeLead } from '../services/geminiService';
import { Page, PublicRoute, Contact, PipelineStatus, User, CrmData } from '../types';

type Tab = 'contacts' | 'pipeline';

const USERS_KEY = 'nexuspro_users';
const DATABASE_KEY = 'nexuspro_database_collections';

const statusConfig: Record<PipelineStatus, { title: string; color: string; icon: React.FC<any> }> = {
    new: { title: 'Nuevos Leads', color: 'bg-blue-500', icon: CrmIcon },
    qualifying: { title: 'Calificación con IA', color: 'bg-purple-500', icon: WandIcon },
    nurturing: { title: 'Nutrición', color: 'bg-yellow-500', icon: SunIcon },
    agent_review: { title: 'Revisión del Agente', color: 'bg-orange-500', icon: UsersIcon },
    proposal: { title: 'Propuesta Enviada', color: 'bg-indigo-500', icon: CrmIcon },
    won: { title: 'Cerrado-Ganado', color: 'bg-green-500', icon: CheckCircleIcon },
};

const ContactCard: React.FC<{ contact: Contact; onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void, onClick: () => void }> = ({ contact, onDragStart, onClick }) => (
  <div
    draggable
    onClick={onClick}
    onDragStart={(e) => onDragStart(e, contact.id)}
    className="p-3 mb-3 bg-[var(--background)] rounded-lg shadow-md cursor-pointer active:cursor-grabbing border-l-4 border-gray-300 dark:border-gray-600 hover:shadow-lg transition-all duration-200 group hover:border-[var(--accent-color)]"
  >
    <div className="flex items-center">
        <img src={contact.avatar} alt={contact.name} className="h-8 w-8 rounded-full mr-3" />
        <div className="flex-grow">
            <p className="font-bold">{contact.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{contact.company}</p>
        </div>
    </div>
    <p className="text-sm font-semibold text-green-500 dark:text-green-400 mt-2">${contact.value.toLocaleString()}</p>
  </div>
);

const KanbanColumn: React.FC<{
  status: PipelineStatus;
  contacts: Contact[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: PipelineStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onContactClick: (contact: Contact) => void;
}> = ({ status, contacts, onDrop, onDragOver, onDragStart, onContactClick }) => {
    const totalValue = contacts.reduce((sum, contact) => sum + contact.value, 0);

    return (
        <div
            className="w-72 flex-shrink-0 bg-[var(--card)] rounded-xl p-3"
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
        >
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${statusConfig[status].color}`}></div>
                    <h3 className="font-semibold">{statusConfig[status].title}</h3>
                </div>
                <span className="text-sm font-medium text-[var(--muted-foreground)] bg-[var(--background)] rounded-full px-2 py-0.5">{contacts.length}</span>
            </div>
            <div className="text-sm font-bold text-[var(--foreground)] mb-3 px-1">
                Valor Total: ${totalValue.toLocaleString()}
            </div>
            <div className="overflow-y-auto h-[calc(100vh-320px)] pr-1">
            {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onDragStart={onDragStart} onClick={() => onContactClick(contact)} />
            ))}
            </div>
        </div>
    )
};


interface CrmPageProps {
  onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
  navigationPayload: any;
  clearNavigationPayload: () => void;
}

const CrmPage: React.FC<CrmPageProps> = ({ onNavigate, navigationPayload, clearNavigationPayload }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [users, setUsers] = useState<User[]>([]);
  const [crmData, setCrmData] = useState<CrmData[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const loadData = () => {
      const usersStr = localStorage.getItem(USERS_KEY);
      setUsers(usersStr ? JSON.parse(usersStr) : []);

      const dbStr = localStorage.getItem(DATABASE_KEY);
      if (dbStr) {
          const db = JSON.parse(dbStr);
          const crmCollection = db.find(c => c.id === 'crmData');
          setCrmData(crmCollection ? crmCollection.data : []);
      }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  const contacts = useMemo<Contact[]>(() => {
      return users.map(user => {
          const userCrmData = crmData.find(d => d.userId === user.id);
          return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              avatar: user.avatar,
              company: user.company || '',
              value: userCrmData?.value || 0,
              status: userCrmData?.status || 'new',
              tags: userCrmData?.tags || []
          };
      });
  }, [users, crmData]);

  const updateAndPersistCrmData = (newCrmData: CrmData[]) => {
      setCrmData(newCrmData);
      const db = JSON.parse(localStorage.getItem(DATABASE_KEY) || '[]');
      const updatedDb = db.map(c => c.id === 'crmData' ? { ...c, data: newCrmData } : c);
      localStorage.setItem(DATABASE_KEY, JSON.stringify(updatedDb));
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('contactId', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: PipelineStatus) => {
    const contactId = e.dataTransfer.getData('contactId');
    updateContactStatus(contactId, newStatus);
  };
  
  const updateContactStatus = (userId: string, newStatus: PipelineStatus) => {
      const newCrmData = crmData.map(d => (d.userId === userId ? { ...d, status: newStatus } : d));
      updateAndPersistCrmData(newCrmData);
  };
  
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
        <header className="flex-shrink-0 pb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><CrmIcon className="h-8 w-8 mr-3"/> Gestión de Clientes</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Gestiona tus contactos, leads y clientes en un solo lugar.</p>
                </div>
                 <button onClick={() => onNavigate('users')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Añadir Contacto
                </button>
            </div>
            <div className="mt-4 p-1 bg-[var(--background)] rounded-lg inline-flex items-center gap-1">
                <button onClick={() => setActiveTab('pipeline')} className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'pipeline' ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>
                    <KanbanIcon className="h-4 w-4 mr-2"/> Pipeline
                </button>
            </div>
        </header>
        
        <main className="flex-grow overflow-hidden">
            <div className="flex space-x-4 h-full overflow-x-auto pb-4">
                {Object.keys(statusConfig).map((statusKey) => {
                    const status = statusKey as PipelineStatus;
                    return (
                        <KanbanColumn
                            key={status}
                            status={status}
                            contacts={contacts.filter((c) => c.status === status)}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragStart={handleDragStart}
                            onContactClick={setSelectedContact}
                        />
                    );
                })}
            </div>
        </main>
    </div>
  );
};

export default CrmPage;