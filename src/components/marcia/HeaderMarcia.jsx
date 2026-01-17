import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiBook, FiUser, FiMail, FiHome } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle';

const HeaderMarcia = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'BIENVENIDOS', path: '/', icon: FiHome },
    { name: 'CURSOS', path: '/cursos', icon: FiBook },
    { name: 'MI HISTORIA', path: '/mi-historia', icon: FiUser },
    { name: 'CONTACTO', path: '/contacto', icon: FiMail },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`glass-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-12 h-12 glass-container flex items-center justify-center">
                <span className="text-2xl font-bold text-gradient">MG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Marcia Guerrón
                </span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Coach & Mentora de Finanzas
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`glass-nav-item flex items-center space-x-2 px-4 py-2 ${
                    isActive(item.path) ? 'gold-accent font-semibold' : ''
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-button p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="glass-overlay absolute inset-0"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`glass-modal absolute top-20 left-4 right-4 p-6 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`glass-nav-item flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  isActive(item.path) ? 'gold-accent font-semibold bg-gold/10' : ''
                }`}
              >
                <item.icon size={20} />
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default HeaderMarcia;
