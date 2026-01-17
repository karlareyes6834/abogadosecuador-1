import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Scale, 
  Users, 
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Gavel,
  ArrowRight,
  Menu,
  X,
  Globe,
  Search,
  ArrowLeft,
  RotateCcw,
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Download,
  Calculator,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Gamepad2
} from 'lucide-react';

// --- CALCULATOR APP ---
export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  
  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(equation + display);
        setDisplay(String(result).slice(0, 10));
        setEquation('');
      } catch {
        setDisplay('Error');
      }
    } else if (['+', '-', '*', '/'].includes(val)) {
      setEquation(display + val);
      setDisplay('0');
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const btns = [
    ['C', '%', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '']
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white p-4 font-mono select-none touch-pan-y">
      <div className="flex-1 bg-black/40 rounded-2xl mb-4 flex flex-col items-end justify-end p-6 border border-white/10 shadow-inner">
        <div className="text-gray-400 text-sm h-6">{equation}</div>
        <div className="text-5xl font-light tracking-tight break-all text-right">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {btns.flat().map((btn, i) => {
          if (btn === '') return <div key={i} />;
          const isOp = ['/', '*', '-', '+', '='].includes(btn);
          const isSpecial = ['C', '%'].includes(btn);
          return (
            <button
              key={i}
              onClick={() => handlePress(btn)}
              className={`
                h-14 sm:h-16 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center
                ${isOp ? 'bg-orange-500 hover:bg-orange-400 text-white' : 
                  isSpecial ? 'bg-gray-300 hover:bg-gray-200 text-black' : 
                  'bg-gray-700 hover:bg-gray-600 text-white'}
                ${btn === '0' ? 'col-span-2 w-full text-left pl-8' : ''}
              `}
            >
              {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- CALENDAR APP (Functional) ---
export const CalendarApp: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();

  const handlePrev = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const handleNext = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-100 font-sans relative touch-pan-y overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 shrink-0">
        <h2 className="text-xl font-bold capitalize">
          {date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrev} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ChevronLeft/></button>
          <button onClick={() => setDate(new Date())} className="px-2 text-xs font-bold border border-gray-300 rounded hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10">Hoy</button>
          <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ChevronRight/></button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-2">
          {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && today.getDate() === day;
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  relative rounded-lg flex flex-col items-center justify-start py-2 hover:bg-gray-100 dark:hover:bg-white/10 transition group min-h-[50px]
                  ${isToday ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold' : ''}
                `}
              >
                <span className={`w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : ''}`}>{day}</span>
                <span className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Cita</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-2xl max-w-xs w-full animate-[fadeIn_0.2s]">
            <h3 className="text-lg font-bold mb-2">Agendar Cita Legal</h3>
            <p className="text-sm text-gray-500 mb-4">
              ¿Desea solicitar una cita con el Abg. Wilson Ipiales para el {selectedDate} de {date.toLocaleString('es-ES', { month: 'long' })}?
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                   setShowModal(false);
                   alert("Redirigiendo al formulario de contacto...");
                }}
                className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Confirmar Solicitud
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAMES APP (Mock) ---
export const GamesApp: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white touch-pan-y">
            <div className="text-center p-6">
                <div className="flex gap-4 mb-8 justify-center">
                    <button className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-md flex flex-col items-center justify-center border border-white/30 cursor-pointer hover:scale-105 transition hover:bg-white/30">
                        <span className="text-4xl mb-2">❌⭕</span>
                        <span className="text-xs font-bold">Tres en Raya</span>
                    </button>
                     <button className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-md flex flex-col items-center justify-center border border-white/30 cursor-pointer hover:scale-105 transition hover:bg-white/30">
                        <span className="text-4xl mb-2">♟️</span>
                        <span className="text-xs font-bold">Ajedrez</span>
                    </button>
                </div>
                <h2 className="text-2xl font-bold">Zona de Descanso</h2>
                <p className="text-white/70 mt-2 text-sm">Relájese mientras procesamos sus trámites.</p>
            </div>
        </div>
    )
}

// --- BROWSER APP ---
export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [displayUrl, setDisplayUrl] = useState('google.com');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000); // Simulate load
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
        <div className="flex gap-2 text-gray-500">
          <button className="hover:text-black transition"><ArrowLeft size={16} /></button>
          <button className="hover:text-black transition"><ArrowRight size={16} /></button>
          <button className="hover:text-black transition" onClick={() => setLoading(!loading)}><RotateCcw size={16} /></button>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400 group-focus-within:text-blue-500" />
            </div>
            <input 
              type="text"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              className="w-full bg-gray-200 hover:bg-gray-200/80 focus:bg-white border-transparent focus:border-blue-500 border rounded-full py-1.5 pl-9 pr-4 text-sm transition-all outline-none text-gray-700"
            />
          </div>
        </form>
      </div>

      {/* Browser Content (Mock) */}
      <div className="flex-1 relative overflow-y-auto bg-white p-8 flex flex-col items-center justify-center touch-pan-y">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Cargando...</p>
          </div>
        ) : (
          <div className="text-center max-w-md animate-[fadeIn_0.5s]">
            <div className="mb-8">
               <h1 className="text-6xl font-bold text-gray-800 tracking-tighter mb-2">Google</h1>
            </div>
            <div className="w-full relative">
              <input 
                type="text" 
                placeholder="Buscar en Google o escribir una URL"
                className="w-full border border-gray-300 rounded-full py-3 px-5 shadow-sm hover:shadow-md transition outline-none focus:border-blue-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={20}/>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4">
               {['YouTube', 'Gmail', 'Maps', 'News'].map(site => (
                 <div key={site} className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">{site[0]}</div>
                    <span className="text-xs text-gray-700">{site}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- EXPLORER APP (Functional Mock) ---
export const ExplorerApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('Inicio');

  const files = [
    { name: 'Documentos', type: 'folder', icon: <Folder className="text-blue-400 fill-blue-400/20" size={40}/> },
    { name: 'Imágenes', type: 'folder', icon: <Folder className="text-blue-400 fill-blue-400/20" size={40}/> },
    { name: 'Descargas', type: 'folder', icon: <Folder className="text-blue-400 fill-blue-400/20" size={40}/> },
    { name: 'Contrato_V1.pdf', type: 'file', icon: <FileText className="text-red-400" size={40}/> },
    { name: 'Logo_Empresa.png', type: 'file', icon: <ImageIcon className="text-purple-400" size={40}/> },
    { name: 'Caso_502.docx', type: 'file', icon: <FileText className="text-blue-600" size={40}/> },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 font-sans">
       {/* Toolbar */}
       <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-4 gap-4 bg-white dark:bg-[#222] flex-shrink-0">
          <div className="flex gap-2">
             <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"><ArrowLeft size={16}/></button>
             <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded opacity-50"><ArrowRight size={16}/></button>
          </div>
          <div className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 rounded flex-1">
             Este Equipo {'>'} {currentPath}
          </div>
          <div className="w-48 relative">
             <input className="w-full bg-gray-100 dark:bg-white/5 rounded px-2 py-1 text-xs outline-none" placeholder={`Buscar en ${currentPath}`} />
             <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50"/>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 dark:border-white/10 p-2 hidden sm:block bg-gray-50/50 dark:bg-black/20 overflow-y-auto">
             <div className="space-y-1">
               {['Acceso rápido', 'Escritorio', 'Documentos', 'Descargas', 'Imágenes'].map(item => (
                 <button key={item} onClick={() => setCurrentPath(item)} className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center gap-2 ${currentPath === item ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                    <Folder size={14} className={currentPath === item ? 'fill-blue-400 text-blue-500' : 'text-gray-400'} />
                    {item}
                 </button>
               ))}
             </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-4 overflow-y-auto touch-pan-y">
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {files.map((file, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 p-2 rounded hover:bg-blue-50 dark:hover:bg-white/5 group transition">
                     <div className="group-hover:scale-105 transition-transform duration-200">
                        {file.icon}
                     </div>
                     <span className="text-xs text-center break-all w-full line-clamp-2">{file.name}</span>
                  </button>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- LEGAL WEBSITE APP (Abg. Wilson Ipiales) ---
export const LegalWebApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'services', label: 'Servicios' },
    { id: 'blog', label: 'Blog Legal' },
    { id: 'contact', label: 'Contacto' }
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto relative font-sans text-slate-900 touch-pan-y">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B3D91] text-white p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-none tracking-tight text-[#0B3D91]">IPIALES & ASOC.</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Estudio Jurídico</p>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-colors ${activeTab === item.id ? 'text-[#0B3D91]' : 'text-slate-500 hover:text-[#0B3D91]'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
           <button onClick={() => scrollToSection('contact')} className="bg-[#0B3D91] hover:bg-[#09327a] text-white px-5 py-2.5 rounded text-xs font-semibold transition tracking-wide shadow-md shadow-blue-900/10">
             CONSULTA GRATUITA
           </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-[68px] inset-x-0 bg-white border-b border-gray-200 z-10 shadow-xl p-4 flex flex-col gap-4 md:hidden animate-[slideDown_0.2s]">
           {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left py-2 font-medium border-b border-gray-50 text-slate-700"
            >
              {item.label}
            </button>
          ))}
          <button onClick={() => scrollToSection('contact')} className="bg-[#0B3D91] text-white w-full py-3 rounded font-bold text-sm">
            LLAMAR AHORA
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero */}
            <header className="relative bg-slate-50 py-20 px-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80')] bg-cover bg-center pointer-events-none mix-blend-multiply text-blue-900"></div>
              {/* Blue overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-blue-50/50 pointer-events-none"></div>
              
              <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-xs font-bold uppercase tracking-wider text-blue-800 border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Disponible Ahora
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-slate-900">
                    Defensa Legal <br/> <span className="text-[#0B3D91] italic">Inteligente</span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                    Especialistas en Derecho Penal, Civil y Comercial. Más de 15 años protegiendo sus intereses con estrategia, ética y resultados comprobables.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onClick={() => scrollToSection('contact')} className="bg-[#0B3D91] text-white px-8 py-3.5 rounded font-medium hover:bg-[#09327a] transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
                      Agendar Cita <ArrowRight size={16}/>
                    </button>
                    <button onClick={() => setActiveTab('services')} className="bg-white border border-slate-300 text-slate-700 px-8 py-3.5 rounded font-medium hover:bg-slate-50 transition">
                      Ver Áreas de Práctica
                    </button>
                  </div>

                  <div className="flex gap-8 pt-8 border-t border-slate-200 mt-8">
                    <div>
                      <div className="text-3xl font-serif font-bold text-[#0B3D91]">15+</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Años Exp.</div>
                    </div>
                    <div>
                      <div className="text-3xl font-serif font-bold text-[#0B3D91]">98%</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Éxito</div>
                    </div>
                  </div>
                </div>
                
                {/* Lawyer Portrait Card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-200 rounded-2xl transform rotate-6 scale-95 opacity-50"></div>
                  <div className="relative bg-white p-2 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100">
                    <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[4/5] relative">
                        <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80" alt="Abg. Wilson" className="w-full h-full object-cover filter contrast-105"/>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0B3D91]/90 to-transparent p-6 text-white">
                            <h3 className="font-serif text-xl font-bold">Wilson Ipiales</h3>
                            <p className="text-sm opacity-90">Socio Fundador</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Countdown Banner */}
            <div className="bg-[#0B3D91] text-white p-4">
               <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Clock size={20}/></div>
                    <div>
                      <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Oferta Limitada</p>
                      <p className="font-bold">Primera Consulta Gratuita (30 min)</p>
                    </div>
                  </div>
                  <div className="flex gap-2 font-mono text-xl">
                    <span className="bg-white/10 px-2 rounded">23</span>:
                    <span className="bg-white/10 px-2 rounded">59</span>:
                    <span className="bg-white/10 px-2 rounded">54</span>
                  </div>
               </div>
            </div>

            {/* Services Grid */}
            <section className="py-20 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-serif font-bold mb-4 text-slate-900">Nuestros Servicios</h2>
                  <p className="text-slate-500 max-w-xl mx-auto">Soluciones legales integrales adaptadas a sus necesidades específicas, con un enfoque en la resolución eficiente de conflictos.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { title: "Derecho Penal", icon: <Shield size={24}/>, price: "Desde $500", desc: "Defensa técnica en investigaciones previas y procesos judiciales." },
                    { title: "Derecho Civil", icon: <Scale size={24}/>, price: "Desde $500", desc: "Contratos, herencias, divorcios y propiedad intelectual." },
                    { title: "Derecho Laboral", icon: <Briefcase size={24}/>, price: "Desde $450", desc: "Despidos intempestivos, acoso laboral y contratos colectivos." },
                    { title: "Tránsito", icon: <CheckCircle size={24}/>, price: "Desde $400", desc: "Impugnación de multas y defensa en accidentes." },
                    { title: "Derecho Societario", icon: <Users size={24}/>, price: "Desde $600", desc: "Constitución de compañías, fusiones y adquisiciones." },
                    { title: "Mediación", icon: <Gavel size={24}/>, price: "Desde $350", desc: "Resolución alternativa de conflictos rápida y efectiva." },
                  ].map((service, idx) => (
                    <div key={idx} className="group p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition duration-300 bg-white">
                      <div className="w-12 h-12 bg-blue-50 text-[#0B3D91] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B3D91] group-hover:text-white transition-colors">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-xl mb-3 font-serif text-slate-800">{service.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{service.desc}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <span className="font-bold text-sm text-[#0B3D91]">{service.price}</span>
                        <button className="text-sm font-semibold underline decoration-blue-200 underline-offset-4 hover:decoration-[#0B3D91] transition text-slate-700">Detalles</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'contact' && (
          <div className="py-12 px-6">
             <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-serif font-bold text-[#0B3D91] mb-6 text-center">Contáctenos</h2>
               <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
                 <form className="space-y-4">
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                       <input className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none" placeholder="Su nombre" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                       <input className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none" placeholder="099..." />
                     </div>
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                       <input className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none" placeholder="email@ejemplo.com" />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Detalle su Caso</label>
                       <textarea className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none h-32" placeholder="Describa brevemente su situación legal..."></textarea>
                   </div>
                   <button type="button" onClick={() => alert("Mensaje enviado. Un asesor se contactará pronto.")} className="w-full bg-[#0B3D91] text-white font-bold py-3 rounded hover:bg-blue-900 transition">
                     ENVIAR CONSULTA
                   </button>
                 </form>
               </div>
             </div>
          </div>
        )}

        {/* Placeholder pages for other tabs */}
        {activeTab === 'services' && (
          <div className="p-12 text-center max-w-2xl mx-auto">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0B3D91]">
                <Briefcase className="text-[#0B3D91]"/>
             </div>
             <h2 className="text-2xl font-serif font-bold mb-4 text-slate-900">Catálogo de Servicios</h2>
             <p className="text-slate-500 mb-8">Lista completa de servicios legales y tarifas referenciales.</p>
             <button onClick={() => setActiveTab('home')} className="text-sm font-bold border-b border-[#0B3D91] text-[#0B3D91] pb-1 hover:opacity-70">Volver al Inicio</button>
          </div>
        )}
         {activeTab === 'blog' && (
          <div className="p-12 text-center max-w-2xl mx-auto">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0B3D91]">
                <FileText className="text-[#0B3D91]"/>
             </div>
             <h2 className="text-2xl font-serif font-bold mb-4 text-slate-900">Blog Legal</h2>
             <p className="text-slate-500 mb-8">Artículos de interés sobre derecho ecuatoriano.</p>
             <button onClick={() => setActiveTab('home')} className="text-sm font-bold border-b border-[#0B3D91] text-[#0B3D91] pb-1 hover:opacity-70">Volver al Inicio</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6 mt-auto">
         <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="w-6 h-6 text-blue-400" />
                <span className="font-serif font-bold text-xl">IPIALES & ASOC.</span>
              </div>
              <p className="text-slate-400 max-w-xs leading-relaxed mb-6">
                Comprometidos con la excelencia jurídica y la defensa inquebrantable de los derechos de nuestros clientes.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 tracking-wider text-xs uppercase text-slate-500">Contacto</h4>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-blue-400"/>
                  <span>Av. Mariano Acosta y Gabriela Mistral, Ibarra, Ecuador</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-blue-400"/>
                  <span>+593 98 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-blue-400"/>
                  <span>contacto@ipiales.legal</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 tracking-wider text-xs uppercase text-slate-500">Enlaces</h4>
              <ul className="space-y-3 text-slate-300">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">Inicio</button></li>
                <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">Áreas de Práctica</button></li>
                <li><button onClick={() => setActiveTab('contact')} className="hover:text-white transition hover:translate-x-1 duration-200 inline-block">Agendar Cita</button></li>
              </ul>
            </div>
         </div>
         <div className="max-w-5xl mx-auto pt-8 mt-12 border-t border-slate-800 text-center text-slate-500 text-xs">
            © 2024 Wilson Ipiales. Todos los derechos reservados. Diseño Abogados OS.
         </div>
      </footer>
    </div>
  );
};

// --- SETTINGS APP ---
export const SettingsApp: React.FC<{ theme: string, toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  return (
    <div className="h-full bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-6 md:p-10 font-sans touch-pan-y overflow-y-auto">
      <h2 className="text-3xl font-bold mb-8 tracking-tight">Configuración</h2>
      
      <div className="max-w-2xl space-y-6">
        {/* Appearance Card */}
        <section className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-full"/> Apariencia
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
             <div className="flex flex-col">
               <span className="font-medium">Modo Oscuro</span>
               <span className="text-xs text-gray-500 dark:text-gray-400">Alternar entre tema claro y oscuro</span>
             </div>
             <button 
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out ${theme === 'dark' ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </section>

        {/* Account Card */}
        <section className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded-full"/> Cuenta
          </h3>
          
          <div className="flex items-center gap-4 p-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-black flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              W
            </div>
            <div>
              <div className="font-bold text-lg">Wilson Ipiales</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Administrador del Sistema</div>
              <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded tracking-wide">
                Activo
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};