import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { initializeCatalogData } from './data/catalogData';
import CursorGlow from './components/Effects/CursorGlow';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import ServicesLandingPage from './pages/ServicesLandingPage';
import TransitoDetailPage from './pages/TransitoDetailPage';
import PlansPage from './pages/PlansPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SecurityPage from './pages/SecurityPage';

// Lazy loaded pages
const ServicesLegalPage = lazy(() => import('./pages/ServicesLegalPage'));
const ForumPage = lazy(() => import('./pages/ForumPage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));

// Consultation Pages
const PenalConsultationPage = lazy(() => import('./pages/ConsultationTypes/PenalConsultationPage'));
const CivilConsultationPage = lazy(() => import('./pages/ConsultationTypes/CivilConsultationPage'));
const EmpresarialConsultationPage = lazy(() => import('./pages/ConsultationTypes/EmpresarialConsultationPage'));
const QuickConsultationPage = lazy(() => import('./pages/ConsultationTypes/QuickConsultationPage'));
const DigitalConsultationPage = lazy(() => import('./pages/ConsultationTypes/DigitalConsultationPage'));

// Dashboard Pages - Lazy loading for performance
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const ClientDashboard = lazy(() => import('./components/Dashboard/ClientDashboard'));

// Course Pages
import CoursesPage from './pages/CoursesPage';
import EbooksPage from './pages/EbooksPage';

// Other Pages
import IntegratedProjectsPage from './pages/IntegratedProjectsPage';
import ProjectsHubPage from './pages/ProjectsHubPage';
import AbogadosOSPage from './pages/AbogadosOSPage';
import GamesPlatform from './pages/GamesPlatform';
import CryptoBankingPage from './pages/CryptoBankingPage';
import TradingDashboard from './pages/TradingDashboard';
import NotFoundPage from './components/Common/NotFoundPage';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Aplicar tema
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Inicializar datos del catálogo
    initializeCatalogData();

    // Bridge: Sincronizar usuario autenticado con localStorage para módulos
    if (user && isAuthenticated) {
      const userData = {
        id: user.id || 'user-' + Date.now(),
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
        tier: 'STANDARD',
        isVerified: true,
        joinedAt: new Date().toISOString(),
        language: 'ES',
        theme: theme === 'dark' ? 'NEXUS' : 'ROYAL',
        xp: 1200,
        level: 3,
        streak: 5
      };
      localStorage.setItem('wi_user', JSON.stringify(userData));
      localStorage.setItem('nexuspro_user', JSON.stringify(userData));
      localStorage.setItem('abogados_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('wi_user');
      localStorage.removeItem('nexuspro_user');
      localStorage.removeItem('abogados_user');
    }
  }, [theme, user, isAuthenticated]);

  // Función para determinar el tipo de usuario
  const getUserType = () => {
    if (!user) return 'guest';
    // Aquí puedes implementar lógica para determinar si es admin o cliente
    return user.role === 'admin' ? 'admin' : 'client';
  };

  const userType = getUserType();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Cursor Glow Effect */}
      <CursorGlow />
      
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <Routes>
        {/* Rutas de Autenticación - PRIMERO */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas de Proyectos Integrados - SEGUNDO */}
        <Route path="/proyectos" element={<ProjectsHubPage />} />
        <Route path="/projects" element={<ProjectsHubPage />} />
        <Route path="/proyectos-integrados" element={<IntegratedProjectsPage />} />
        <Route path="/trading" element={<TradingDashboard />} />
        <Route path="/abogados-os" element={<AbogadosOSPage />} />
        <Route path="/games" element={<GamesPlatform />} />
        <Route path="/crypto-banking" element={<CryptoBankingPage />} />

        {/* Rutas de Dashboard - TERCERO */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={
            isAuthenticated ? (
              userType === 'admin' ? <AdminDashboard /> : <ClientDashboard />
            ) : <Navigate to="/login" replace />
          } />
          <Route path="client" element={
            isAuthenticated && userType === 'client' ? <ClientDashboard /> : <Navigate to="/login" replace />
          } />
          <Route path="admin" element={
            isAuthenticated && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />
          } />
                            </Route>

        {/* Rutas públicas - QUINTO */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="services" element={<ServicesLandingPage />} />
          <Route path="services/legal" element={<ServicesLegalPage />} />
          <Route path="services/derecho-transito" element={<TransitoDetailPage />} />
                    <Route path="consultations/penal" element={<PenalConsultationPage />} />
          <Route path="consultations/civil" element={<CivilConsultationPage />} />
          <Route path="consultations/empresarial" element={<EmpresarialConsultationPage />} />
          <Route path="consultations/rapida" element={<QuickConsultationPage />} />
          <Route path="consultations/digital" element={<DigitalConsultationPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogPostPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="politica-privacidad" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsOfServicePage />} />
          <Route path="terminos-condiciones" element={<TermsOfServicePage />} />
          <Route path="seguridad" element={<SecurityPage />} />
                              <Route path="courses" element={<CoursesPage />} />
                    <Route path="ebooks" element={<EbooksPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="forum" element={<ForumPage />} />
        </Route>

        {/* Ruta por defecto - ÚLTIMA */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
