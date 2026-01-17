import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Gamepad2,
  Scale,
  Wallet,
  Grid,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  external?: boolean;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const IntegratedNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const location = useLocation();

  const navSections: NavSection[] = [
    {
      title: 'Principal',
      links: [
        {
          label: 'Inicio',
          href: '/',
          icon: <Home className="w-4 h-4" />,
          description: 'Página principal'
        },
        {
          label: 'Proyectos',
          href: '/proyectos',
          icon: <Grid className="w-4 h-4" />,
          description: 'Hub de proyectos integrados'
        }
      ]
    },
    {
      title: 'Sistemas Integrados',
      links: [
        {
          label: 'Abogados OS',
          href: '/abogados-os',
          icon: <Scale className="w-4 h-4" />,
          description: 'Sistema operativo legal'
        },
        {
          label: 'Juegos',
          href: '/games',
          icon: <Gamepad2 className="w-4 h-4" />,
          description: 'Plataforma de entretenimiento'
        },
        {
          label: 'Trading & Crypto',
          href: '/crypto-banking',
          icon: <Wallet className="w-4 h-4" />,
          description: 'Plataforma de finanzas digitales'
        }
      ]
    },
    {
      title: 'Dashboard',
      links: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <Grid className="w-4 h-4" />,
          description: 'Panel de control'
        },
        {
          label: 'Proyectos',
          href: '/dashboard/projects',
          icon: <Grid className="w-4 h-4" />,
          description: 'Gestión de proyectos'
        }
      ]
    }
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex-col p-4 z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Plataforma
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sistemas Integrados</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {link.icon}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{link.label}</div>
                      {link.description && (
                        <div className="text-xs text-gray-500">{link.description}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500 text-center">
            Plataforma Integrada v1.0
          </p>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 z-40 p-4 overflow-y-auto"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Plataforma
                </h1>
                <p className="text-xs text-gray-500 mt-1">Sistemas Integrados</p>
              </div>

              <div className="space-y-6">
                {navSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            isActive(link.href)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {link.icon}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{link.label}</div>
                            {link.description && (
                              <div className="text-xs text-gray-500">{link.description}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 mt-6 pt-4">
                <p className="text-xs text-gray-500 text-center">
                  Plataforma Integrada v1.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntegratedNavigation;
