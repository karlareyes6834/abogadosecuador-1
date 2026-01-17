import React from 'react';
import { Page, PublicRoute, UserRole } from '../../types';
import {
  NexusProIcon,
  DashboardIcon,
  CrmIcon,
  AutomationIcon,
  ChatbotIcon,
  CalendarIcon,
  AnalyticsIcon,
  ArIcon,
  SitesIcon,
  FinancialsIcon,
  DatabaseIcon,
  AssistantsIcon,
  SettingsIcon,
  KanbanIcon,
  CreditsIcon,
  SparklesIcon,
  ShoppingCartIcon,
  MediaIcon,
  FileTextIcon,
  CampaignIcon,
  MessageIcon,
  EditIcon,
  BookOpenIcon,
  ClipboardListIcon,
  PackageIcon,
  UsersIcon,
  AffiliateIcon,
  PuzzleIcon,
  ShieldCheckIcon,
  EyeIcon,
  ForumIcon,
  PlanIcon
} from '../icons/InterfaceIcons';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page | PublicRoute) => void;
  userRole: UserRole;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onNavigate: (page: Page) => void;
}> = ({ page, label, icon, isActive, onNavigate }) => {
  const activeClass = 'bg-black/5 dark:bg-white/5 text-[var(--accent-color)]';
  const inactiveClass = 'text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--foreground)]';
  return (
    <li>
      <a
        href={`#/${page}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(page);
        }}
        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
          isActive ? activeClass : inactiveClass
        }`}
      >
        {React.cloneElement(icon, { className: 'h-5 w-5' })}
        <span className="ml-3">{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, userRole }) => {
  
  const clientNavItems = [
    { page: 'dashboard' as Page, label: 'Portal del Cliente', icon: <DashboardIcon /> },
    { page: 'documents' as Page, label: 'Mis Documentos', icon: <FileTextIcon /> },
    { page: 'projects' as Page, label: 'Mis Casos', icon: <KanbanIcon /> },
    { page: 'calendar' as Page, label: 'Mis Citas', icon: <CalendarIcon /> },
    { page: 'my-courses' as Page, label: 'Mis Cursos', icon: <BookOpenIcon /> },
    { page: 'my-purchases' as Page, label: 'Mis Compras', icon: <ShoppingCartIcon /> },
  ];

  const adminNavItems = [
    { page: 'dashboard' as Page, label: 'Dashboard', icon: <DashboardIcon /> },
    { page: 'crm' as Page, label: 'CRM', icon: <CrmIcon /> },
    { page: 'users' as Page, label: 'Usuarios', icon: <UsersIcon /> },
    { page: 'conversations' as Page, label: 'Conversaciones', icon: <MessageIcon /> },
    { page: 'calendar' as Page, label: 'Calendario', icon: <CalendarIcon /> },
    { page: 'sales' as Page, label: 'Ventas', icon: <ShoppingCartIcon /> },
    { page: 'automations' as Page, label: 'Automatizaciones', icon: <AutomationIcon /> },
    { page: 'chatbots' as Page, label: 'Chatbots', icon: <ChatbotIcon /> },
    { page: 'publisher' as Page, label: 'Gestionar Blog', icon: <EditIcon /> },
    { page: 'content-studio' as Page, label: 'Estudio IA', icon: <SparklesIcon /> },
    { page: 'campaigns' as Page, label: 'Campañas', icon: <CampaignIcon /> },
  ];

  const adminManagementItems = [
    { page: 'sites' as Page, label: 'Creador Web/App', icon: <SitesIcon /> },
    { page: 'products' as Page, label: 'Catálogo', icon: <PackageIcon /> },
    { page: 'forms' as Page, label: 'Formularios', icon: <ClipboardListIcon /> },
    { page: 'media' as Page, label: 'Multimedia', icon: <MediaIcon /> },
    { page: 'database' as Page, label: 'Base de Datos', icon: <DatabaseIcon /> },
    { page: 'documents' as Page, label: 'Plantillas Docs', icon: <FileTextIcon /> },
    { page: 'analytics' as Page, label: 'Analíticas', icon: <AnalyticsIcon /> },
    { page: 'financials' as Page, label: 'Finanzas', icon: <FinancialsIcon /> },
    { page: 'projects' as Page, label: 'Proyectos', icon: <KanbanIcon /> },
  ];
  
  const accountItems = [
    { page: 'credits' as Page, label: 'Créditos', icon: <CreditsIcon /> },
    { page: 'affiliates' as Page, label: 'Afiliados', icon: <AffiliateIcon /> },
    { page: 'settings' as Page, label: 'Mi Perfil', icon: <SettingsIcon /> },
  ];

  const browseItems = [
     { page: 'services' as Page, label: 'Agendar Servicios', icon: <ShieldCheckIcon /> },
     { page: 'games' as Page, label: 'Entretenimiento', icon: <PuzzleIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-[var(--border)] flex-shrink-0 px-4">
        <NexusProIcon className="h-8 w-auto text-[var(--accent-color)]" />
        <span className="text-lg font-black ml-2 tracking-tighter truncate">Abg. W. Ipiales</span>
      </div>
      <div className="flex-1 overflow-y-auto sidebar-scrollbar p-4">
        <nav className="space-y-6">
          {userRole === 'client' && (
            <>
              <div>
                <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Portal Cliente</h3>
                <ul className="mt-2 space-y-1">
                  {clientNavItems.map((item) => (
                    <NavItem key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
                  ))}
                </ul>
              </div>
               <div>
                <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mt-6">Explorar</h3>
                <ul className="mt-2 space-y-1">
                  {browseItems.map((item) => (
                    <NavItem key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
                  ))}
                </ul>
              </div>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <div>
                <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Principal</h3>
                <ul className="mt-2 space-y-1">
                  {adminNavItems.map((item) => (
                    <NavItem key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Gestión</h3>
                <ul className="mt-2 space-y-1">
                  {adminManagementItems.map((item) => (
                    <NavItem key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
                  ))}
                </ul>
              </div>
            </>
          )}

          <div>
             <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cuenta</h3>
            <ul className="mt-2 space-y-1">
              {accountItems.map((item) => (
                <NavItem key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;