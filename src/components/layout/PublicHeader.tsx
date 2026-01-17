import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { MoonIcon, SunIcon, LogOutIcon, UserIcon, ShoppingCartIcon, DashboardIcon, TrashIcon, MenuIcon, XIcon, SearchIcon } from '../icons/InterfaceIcons';
import { NexusProIcon } from '../icons/InterfaceIcons';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface PublicHeaderProps {
  onNavigate: (page: string, payload?: any) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onNavigate, isLoggedIn, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { cart, itemCount, cartTotal, removeFromCart } = useCart();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const useOutsideAlerter = (ref, setOpen) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, setOpen]);
  }

  useOutsideAlerter(accountRef, setAccountOpen);
  useOutsideAlerter(cartRef, setIsCartOpen);
  
  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setAccountOpen(false);
    setIsCartOpen(false);
  }

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
          onNavigate('catalogo', { searchTerm });
          setIsSearchOpen(false);
      }
  };


  const NavLink = ({ page, children, className = "" }) => (
    <a href={`#/${page}`} onClick={(e) => { e.preventDefault(); onNavigate(page); closeAll(); }} className={`text-[var(--muted-foreground)] hover:text-[var(--accent-color)] transition-colors ${className}`}>
      {children}
    </a>
  );

  const renderDesktopNav = () => (
    <nav className="hidden md:flex space-x-6 items-center text-sm font-medium">
        <NavLink page="home">Inicio</NavLink>
        <NavLink page="services">Servicios</NavLink>
        <NavLink page="consultas">Consultas</NavLink>
        <NavLink page="courses">Cursos</NavLink>
        <NavLink page="ebooks">Ebooks</NavLink>
        <NavLink page="blog">Blog</NavLink>
        <NavLink page="proyectos" className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all">Proyectos</NavLink>
        <NavLink page="contact">Contacto</NavLink>
    </nav>
  );

  const renderMobileNav = () => (
    <AnimatePresence>
    {isMobileMenuOpen && (
      <MotionDiv 
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        exit={{opacity: 0}} 
        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <MotionDiv 
          initial={{x: "-100%"}} 
          animate={{x: 0}} 
          exit={{x: "-100%"}} 
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-[var(--card)] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
            <div className="p-4 border-b border-[var(--border)]">
              <a href="#/home" onClick={(e) => { e.preventDefault(); onNavigate('home'); closeAll(); }} className="flex items-center gap-2">
                <NexusProIcon className="h-8 w-auto text-[var(--accent-color)]" />
                <span className="text-xl font-bold font-serif">Abg. W. Ipiales</span>
              </a>
            </div>
            <nav className="flex flex-col p-4 gap-4 text-lg">
                <NavLink page="home" className="py-2">Inicio</NavLink>
                <NavLink page="services" className="py-2">Servicios</NavLink>
                <NavLink page="consultas" className="py-2">Consultas</NavLink>
                <NavLink page="courses" className="py-2">Cursos</NavLink>
                <NavLink page="ebooks" className="py-2">Ebooks</NavLink>
                <NavLink page="blog" className="py-2">Blog</NavLink>
                <NavLink page="proyectos" className="py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Proyectos</NavLink>
                <NavLink page="contact" className="py-2">Contacto</NavLink>
                 <div className="border-t border-[var(--border)] pt-4">
                     {isLoggedIn ? (
                        <div className="space-y-4">
                           <a href="#/dashboard" onClick={(e) => {e.preventDefault(); onNavigate('dashboard')}} className="flex items-center gap-2 w-full text-left py-2"><DashboardIcon className="h-5 w-5"/> Portal Cliente</a>
                           <button onClick={onLogout} className="flex items-center gap-2 w-full text-left py-2 text-red-600 dark:text-red-400">
                            <LogOutIcon className="h-5 w-5"/> Cerrar Sesión
                           </button>
                        </div>
                     ) : (
                         <a href="#/login" onClick={(e) => {e.preventDefault(); onNavigate('login'); closeAll();}} className="w-full block text-center px-4 py-2 text-base rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Iniciar Sesión</a>
                     )}
                </div>
            </nav>
        </MotionDiv>
      </MotionDiv>
    )}
    </AnimatePresence>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 bg-[var(--card)] border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#/home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-2">
            <NexusProIcon className="h-8 w-auto text-[var(--accent-color)]" />
            <span className="text-xl font-bold font-serif hidden sm:inline">Abg. W. Ipiales</span>
          </a>

          {renderDesktopNav()}

          <div className="flex items-center gap-1 sm:gap-2">
            <form onSubmit={handleSearch} className="flex items-center">
                <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full hover:bg-[var(--background)]">
                    <SearchIcon className="h-5 w-5" />
                </button>
                <AnimatePresence>
                {isSearchOpen && (
                    <MotionDiv initial={{width: 0, opacity: 0}} animate={{width: "auto", opacity: 1}} exit={{width: 0, opacity: 0}} className="overflow-hidden">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..." 
                            className="w-40 sm:w-48 p-2 rounded-full bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                        />
                    </MotionDiv>
                )}
                </AnimatePresence>
            </form>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--background)]">
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            
            <div className="relative" ref={cartRef}>
                <button onClick={() => setIsCartOpen(prev => !prev)} className="relative p-2 rounded-full hover:bg-[var(--background)]">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {itemCount > 0 && <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>}
                </button>
                <AnimatePresence>
                {isCartOpen && (
                    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-80 bg-[var(--card)] shadow-lg rounded-md z-50 ring-1 ring-black ring-opacity-5">
                       <div className="p-4"><h3 className="font-semibold">Tu Carrito</h3></div>
                        {cart.length > 0 ? (
                           <>
                                <div className="p-4 border-t border-[var(--border)] max-h-64 overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 py-2">
                                            <div className="flex-grow"><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-[var(--muted-foreground)]">${item.price.toFixed(2)}</p></div>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-[var(--border)]">
                                    <div className="flex justify-between font-semibold"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                                    <button onClick={() => { onNavigate('checkout'); setIsCartOpen(false); }} className="w-full mt-3 px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md shadow-sm hover:opacity-90">Ir a Pagar</button>
                                </div>
                           </>
                        ) : (<p className="p-4 text-sm text-[var(--muted-foreground)] text-center">Tu carrito está vacío.</p>)}
                    </MotionDiv>
                )}
                </AnimatePresence>
            </div>

            {isLoggedIn ? (
              <div className="relative hidden md:block" ref={accountRef}>
                 <button onClick={() => setAccountOpen(!accountOpen)} className="p-2 rounded-full hover:bg-[var(--background)]">
                    <UserIcon className="h-5 w-5" />
                 </button>
                 <AnimatePresence>
                 {accountOpen && (
                     <MotionDiv initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-full right-0 mt-2 bg-[var(--card)] shadow-lg rounded-md w-60 p-2 z-50 ring-1 ring-black ring-opacity-5">
                        <a href="#/dashboard" onClick={(e) => {e.preventDefault(); onNavigate('dashboard')}} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-[var(--background)]"><DashboardIcon className="h-4 w-4"/> Portal Cliente</a>
                        <div className="border-t border-[var(--border)] my-1"></div>
                        <button onClick={onLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-[var(--background)] text-red-600 dark:text-red-400">
                            <LogOutIcon className="h-4 w-4"/> Cerrar Sesión
                        </button>
                    </MotionDiv>
                 )}
                 </AnimatePresence>
              </div>
            ) : (
               <a href="#/login" onClick={(e) => {e.preventDefault(); onNavigate('login')}} className="hidden md:block px-4 py-2 text-sm rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Iniciar Sesión</a>
            )}
             <div className="md:hidden">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full hover:bg-[var(--background)]">
                    {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                 </button>
             </div>
          </div>
        </div>
      </div>
      {renderMobileNav()}
    </header>
  );
}

export default PublicHeader;