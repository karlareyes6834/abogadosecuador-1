import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModuleProvider } from './context/ModuleContext';
import { Toaster } from 'react-hot-toast';

// Componentes comunes
import LoadingSpinner from './components/Common/LoadingSpinner';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer';
import FullCart from './components/Cart/FullCart';

// Middleware de autenticación
import { 
  ProtectedRoute, 
  AdminRoute, 
  ClientRoute, 
  VisitorOnlyRoute 
} from './middleware/roleMiddleware.jsx';

// Páginas públicas (visitantes)
import { HelmetWrapper } from './components/HelmetWrapper';
import Contact from './components/Contact/Contact';
import Blog from './components/Blog/Blog';
import ForumHome from './components/Forum/ForumHome';
import BlogArticle from './components/Blog/BlogArticle';
import Services from './components/Services/ServicesPage';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TerminosCondiciones from './components/TerminosCondiciones';
import Seguridad from './components/Seguridad';
import Ebooks from './components/Ebooks';
import CourseCatalog from './components/Courses/CourseSystem';
import CourseDetail from './pages/CourseDetailPage';

// Páginas de autenticación
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import AuthCallback from './components/Auth/AuthCallback';

// Páginas de cliente
import ClientDashboard from './components/Dashboard/ClientDashboard';
import UserProfile from './components/Dashboard/UserProfile';
import DashboardHome from './components/Dashboard/DashboardHome';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import UserCourses from './components/Dashboard/UserCourses';
import PurchaseHistory from './components/Dashboard/PurchaseHistory';
import DashboardPage from './components/Dashboard/DashboardPage';

// Páginas de administrador
import AdminDashboard from './components/Admin/AdminDashboardComplete';
import DataExporter from './components/Admin/DataExporter';
import WhatsAppManager from './components/Admin/WhatsAppManager';

// Nuevos componentes integrados
import UnifiedStore from './components/Store/CompleteStore';
import CheckoutSystem from './components/Checkout/CheckoutSystem';
import AppointmentCalendar from './components/Calendar/AppointmentCalendar';
import AIChatSystem from './components/Chat/AIChatSystem';
import TriviaSystem from './components/Gamification/TriviaSystem';
import DragDropEditor from './components/Editor/DragDropEditor';
import PromotionsManager from './components/Promotions/PromotionsManager';
// Páginas de funcionalidad
import PaymentSystem from './components/Payment/PaymentSystem';
import CheckoutPage from './pages/CheckoutPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ThankYouPage from './components/Payment/ThankYouPage';
import AIConsultationSystem from './components/Consultation/AIConsultationSystem';
import AppointmentScheduler from './components/Appointment/AppointmentScheduler';
import TestShoppingPage from './components/TestShoppingPage';

// Gamificación
import LegalTrivia from './components/Gamification/LegalTrivia';
import LegalTicTacToe from './components/Gamification/LegalTicTacToe';

// Blog Reader
import BlogReader from './components/Blog/BlogReader';
// Páginas de comunidad
import AffiliatePage from './pages/CleanAffiliatePage';
import ReferralsPage from './pages/CleanReferralsPage';
import AffiliateOverview from './components/Affiliates/AffiliateOverview';
import AffiliateRegister from './components/Affiliates/AffiliateRegister';

// Páginas de servicios individuales
import ServicioPenalPage from './pages/ServicioPenalPage';
import ServicioCivilPage from './pages/ServicioCivilPage';
import ServicioTransitoPage from './pages/ServicioTransitoPage';
import ServicioComercialPage from './pages/ServicioComercialPage';
import ServicioAduaneroPage from './pages/ServicioAduaneroPage';
import ServicioLaboralPage from './pages/ServicioLaboralPage';
import ServicioCobrosPage from './pages/ServicioCobrosPage';

// Páginas de consultas
import PenalConsultationPage from './pages/ConsultationTypes/PenalConsultationPage';
import CivilConsultationPage from './pages/ConsultationTypes/CivilConsultationPage';
import QuickConsultationPage from './pages/ConsultationTypes/QuickConsultationPage';
import EmpresarialConsultationPage from './pages/ConsultationTypes/EmpresarialConsultationPage';
import DigitalConsultationPage from './pages/ConsultationTypes/DigitalConsultationPage';
import ConsultationsPage from './pages/ConsultationsPage';

// Páginas de error
import NotFoundPage from './components/Common/NotFoundPage';
import UnauthorizedPage from './components/Common/UnauthorizedPage';
import ServerErrorPage from './components/Common/ServerErrorPage';
import PlaceholderPage from './components/Common/PlaceholderPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ModuleProvider>
          <ThemeProvider>
            <HelmetWrapper>
              <div className="App min-h-screen bg-background-primary text-text-primary">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Rutas públicas (visitantes) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/servicios" element={<Services />} />

                    <Route path="/servicios/penal" element={<ServicioPenalPage />} />
                    <Route path="/servicios/civil" element={<ServicioCivilPage />} />
                    <Route path="/servicios/comercial" element={<ServicioComercialPage />} />
                    <Route path="/servicios/transito" element={<ServicioTransitoPage />} />
                    <Route path="/servicios/aduanero" element={<ServicioAduaneroPage />} />
                    <Route path="/servicios/laboral" element={<ServicioLaboralPage />} />
                    <Route path="/servicios/cobros" element={<ServicioCobrosPage />} />
                    
                    {/* Rutas de consultas */}
                    <Route path="/consultas" element={<ConsultationsPage />} />
                    <Route path="/consultas/penal" element={<PenalConsultationPage />} />
                    <Route path="/consultas/civil" element={<CivilConsultationPage />} />
                    <Route path="/consultas/general" element={<QuickConsultationPage />} />
                    <Route path="/consultas/empresarial" element={<EmpresarialConsultationPage />} />
                    <Route path="/consultas/digital" element={<DigitalConsultationPage />} />

                    <Route path="/sobre-nosotros" element={<AboutPage />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/blog" element={<BlogReader />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/entretenimiento/trivia" element={<LegalTrivia />} />
                    <Route path="/entretenimiento/tres-en-raya" element={<LegalTicTacToe />} />
                    <Route path="/test-shopping" element={<TestShoppingPage />} />
                    <Route path="/cursos" element={<CourseCatalog />} />
                    <Route path="/cursos/:slug" element={<CourseDetail />} />
                    <Route path="/ebooks" element={<Ebooks />} />
                    <Route path="/tienda" element={<UnifiedStore />} />
                    <Route path="/calendario" element={<AppointmentCalendar />} />
                    <Route path="/promociones" element={<PromotionsManager />} />
                    <Route path="/politicas-privacidad" element={<PrivacyPolicy />} />
                    <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
                    <Route path="/seguridad" element={<Seguridad />} />
                    <Route path="/newsletter" element={<Blog />} />
                    <Route path="/forum" element={<ForumHome />} />
                    <Route path="/catalog" element={<UnifiedStore />} />

                    {/* Rutas de comunidad */}
                    <Route path="/afiliados" element={<AffiliatePage />} />
                    <Route path="/referidos" element={<ReferralsPage />} />
                    
                    {/* Rutas de autenticación (solo visitantes) */}
                    <Route path="/login" element={
                      <VisitorOnlyRoute>
                        <Login />
                      </VisitorOnlyRoute>
                    } />
                    <Route path="/register" element={
                      <VisitorOnlyRoute>
                        <Register />
                      </VisitorOnlyRoute>
                    } />
                    <Route path="/forgot-password" element={
                      <VisitorOnlyRoute>
                        <ForgotPassword />
                      </VisitorOnlyRoute>
                    } />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Rutas de cliente (requieren autenticación) */}
                    <Route path="/dashboard" element={
                      <ClientRoute>
                        <ClientDashboard />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/perfil" element={
                      <ClientRoute>
                        <UserProfile />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/citas" element={
                      <ClientRoute>
                        <DashboardHome />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/consultas" element={
                      <ClientRoute>
                        <DashboardLayout />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/mis-cursos" element={
                      <ClientRoute>
                        <UserCourses />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/mis-ebooks" element={
                      <ClientRoute>
                        <PurchaseHistory />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/tokens" element={
                      <ClientRoute>
                        <DashboardPage />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/referidos" element={
                      <ClientRoute>
                        <AffiliateOverview />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/referrals/settings" element={
                      <ClientRoute>
                        <PlaceholderPage title="Configuración de Afiliados" />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/referrals/withdrawals" element={
                      <ClientRoute>
                        <PlaceholderPage title="Solicitar Retiro" />
                      </ClientRoute>
                    } />
                    <Route path="/dashboard/referrals/history" element={
                      <ClientRoute>
                        <PlaceholderPage title="Historial de Referidos" />
                      </ClientRoute>
                    } />
                    
                    {/* Rutas de administrador */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/usuarios" element={
                      <AdminRoute>
                        <DataExporter />
                      </AdminRoute>
                    } />
                    <Route path="/admin/productos" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/cursos" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/blog" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/citas" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/afiliados" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/configuracion" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    <Route path="/admin/analiticas" element={
                      <AdminRoute>
                        <AdminDashboardComplete />
                      </AdminRoute>
                    } />
                    
                    {/* Rutas de funcionalidad */}
                    <Route path="/consulta-ia" element={<AIConsultationSystem />} />
                    <Route path="/agendar-cita" element={<AppointmentScheduler />} />
                    <Route path="/afiliados/registro" element={<AffiliateRegister />} />
                    <Route path="/afiliados/dashboard" element={
                      <ProtectedRoute requiredRole="affiliate">
                        <AffiliateOverview />
                      </ProtectedRoute>
                    } />
                    
                    {/* Rutas de pagos */}
                    <Route path="/payment" element={<PaymentSystem />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/suscripciones" element={<SubscriptionsPage />} />
                    <Route path="/payment/success" element={<ThankYouPage />} />
                    <Route path="/payment/failed" element={<ThankYouPage />} />
                    
                    {/* Rutas de error */}
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="/server-error" element={<ServerErrorPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    
                    {/* Redirecciones y rutas legacy */}
                    <Route path="/cliente" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
                    <Route path="/user" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Página 404 para rutas no encontradas */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                
                {/* Toast notifications */}
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />

                {/* Floating Cart */}
                <FullCart />
                <Footer />
              </div>
            </HelmetWrapper>
          </ThemeProvider>
        </ModuleProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
