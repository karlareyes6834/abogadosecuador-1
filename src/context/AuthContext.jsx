import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService as supabaseAuthService } from '../services/supabaseService';
import purchasesService from '../services/purchasesService';

// Crear el contexto
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar obtener sesión activa de Supabase
        const { user: currentUser, error } = await supabaseAuthService.getCurrentUser();
        
        if (error) {
          // Solo loguear error si NO es el error normal de sesión missing
          if (error.message !== 'Auth session missing!') {
            console.error('Error al verificar autenticación:', error);
          }
          setUser(null);
        } else if (currentUser) {
          // Usuario tiene sesión activa
          const { purchases, error: purchasesError } = await purchasesService.getUserPurchases(currentUser.id);
          if (purchasesError) {
            console.error('Error al obtener las compras del usuario:', purchasesError);
          }
          const userWithPurchases = { ...currentUser, purchases };
          console.log('✅ Usuario autenticado:', userWithPurchases.email);
          setUser(userWithPurchases);
          localStorage.setItem('authToken', 'true'); // Marcar como autenticado
        } else {
          // No hay sesión activa - esto es normal al iniciar
          console.log('ℹ️ No hay sesión activa');
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.login(email, password);
      
      if (!result.success || result.error) {
        throw new Error(result.error?.message || 'Error al iniciar sesión');
      }
      
      // Persistir usuario
      try {
        if (result.session) localStorage.setItem('authToken', result.session.access_token);
        if (result.user) localStorage.setItem('user', JSON.stringify(result.user));
      } catch (_) {}
      setUser(result.user);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.register(
        userData.email,
        userData.password,
        {
          fullName: userData.name,
          phone: userData.phone || '',
          address: userData.address || ''
        }
      );
      
      if (!result.success || result.error) {
        throw new Error(result.error?.message || 'Error al registrar usuario');
      }
      
      if (result.user) {
        try {
          localStorage.setItem('user', JSON.stringify(result.user));
        } catch (_) {}
        setUser(result.user);
      }
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    try {
      const result = await supabaseAuthService.signOut();
      
      if (result.error) {
        throw new Error(result.error.message || 'Error al cerrar sesión');
      }
      
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } catch (_) {}
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el usuario actual
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Valores a proporcionar en el contexto
  const value = {
    user,
    setUser,
    loading,
    error,
    authReady,
    // Derivados útiles para UI y permisos
    isAuthenticated: Boolean(user),
    isAdmin: user?.email === 'ecuadorabogado1@gmail.com' || 
             user?.role === 'admin' || 
             (Array.isArray(user?.roles) && user.roles.includes('admin')) ||
             user?.user_metadata?.role === 'admin',
    hasRole: (role) => {
      if (!user) return false;
      // Check single role property first (from Supabase profiles table)
      if (user.role === role) return true;
      // Check if user has roles array
      if (user.roles && Array.isArray(user.roles)) {
        return user.roles.includes(role);
      }
      // Check email for admin
      if (role === 'admin' && user.email === 'ecuadorabogado1@gmail.com') {
        return true;
      }
      return false;
    },
    hasPermission: (permission) => {
      if (!user) return false;
      // Check if user has permissions array or a permissions property
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }
      // For admin role, allow all permissions
      if (user.roles && Array.isArray(user.roles) && user.roles.includes('admin')) {
        return true;
      }
      return false;
    },
    hasUserPurchasedCourse: (courseId) => {
      if (!user) return false;
      const purchases = user.purchases || [];
      return Array.isArray(purchases) ? purchases.includes(courseId) : false;
    },
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
