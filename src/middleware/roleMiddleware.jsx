import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente para proteger rutas que requieren autenticación
export const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, hasRole, hasPermission, loading, authReady } = useAuth();
  const location = useLocation();

  // Si aún está cargando la autenticación, mostrar loading
  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si se requiere un permiso específico, verificar
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Componente para rutas que solo pueden acceder visitantes (no autenticados)
export const VisitorOnlyRoute = ({ children }) => {
  const { isAuthenticated, authReady, loading } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Componente para rutas de administrador
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

// Componente para rutas de cliente (cualquier usuario autenticado que no sea admin)
export const ClientRoute = ({ children }) => {
  const { isAuthenticated, user, loading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si es admin, redirigir a dashboard de admin
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Cualquier otro usuario autenticado puede acceder
  return children;
};

// Componente para rutas de afiliado
export const AffiliateRoute = ({ children }) => (
  <ProtectedRoute requiredRole="affiliate">
    {children}
  </ProtectedRoute>
);

// Componente para rutas que requieren permisos específicos
export const PermissionRoute = ({ children, permission }) => (
  <ProtectedRoute requiredPermission={permission}>
    {children}
  </ProtectedRoute>
);

// Hook personalizado para verificar acceso a rutas
export const useRouteAccess = (requiredRole = null, requiredPermission = null) => {
  const { isAuthenticated, hasRole, hasPermission, loading, authReady } = useAuth();

  const canAccess = () => {
    if (!authReady || loading) return false;
    if (!isAuthenticated) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    return true;
  };

  const redirectTo = () => {
    if (!isAuthenticated) return '/login';
    if (requiredRole && !hasRole(requiredRole)) return '/unauthorized';
    if (requiredPermission && !hasPermission(requiredPermission)) return '/unauthorized';
    return null;
  };

  return {
    canAccess: canAccess(),
    redirectTo: redirectTo(),
    loading: !authReady || loading
  };
};

// Componente para mostrar contenido condicional basado en roles
export const RoleBasedContent = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null, 
  fallback = null 
}) => {
  const { hasRole, hasPermission, isAuthenticated } = useAuth();

  const canShow = () => {
    if (!isAuthenticated) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    return true;
  };

  if (canShow()) {
    return children;
  }

  return fallback;
};

// Componente para mostrar contenido solo para visitantes
export const VisitorOnlyContent = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return fallback;
};

// Componente para mostrar contenido solo para usuarios autenticados
export const AuthenticatedContent = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return fallback;
};
