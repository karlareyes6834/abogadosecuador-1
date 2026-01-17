import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Page, PublicRoute, Branch, UserRole } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page | PublicRoute | string) => void;
  onLogout: () => void;
  branches: Branch[];
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
  userRole: UserRole;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onNavigate, onLogout, branches, currentBranch, setCurrentBranch, userRole }) => {
  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPage={currentPage} 
          onLogout={onLogout}
          branches={branches}
          currentBranch={currentBranch}
          setCurrentBranch={setCurrentBranch}
          onNavigate={onNavigate}
          userRole={userRole}
        />
        <main className="flex-1 overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;