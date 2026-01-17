import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadModuleWithFallback } from '../utils/connectionManager';

// Crear el contexto
const ModuleContext = createContext();

/**
 * Proveedor de contexto para carga de módulos con manejo de errores
 */
export function ModuleProvider({ children }) {
  // Estado para seguir los módulos cargados y los errores
  const [loadedModules, setLoadedModules] = useState({});
  const [moduleErrors, setModuleErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Cargar un módulo con sistema de fallback
   * @param {string} path - Ruta al módulo
   * @param {string} name - Nombre del módulo para rutas alternativas
   */
  const loadModule = async (path, name) => {
    if (loadedModules[path]) {
      return loadedModules[path];
    }

    setIsLoading(true);
    try {
      const module = await loadModuleWithFallback(path, name);
      setLoadedModules(prev => ({
        ...prev,
        [path]: module
      }));
      
      // Limpiar error si existía
      if (moduleErrors[path]) {
        setModuleErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[path];
          return newErrors;
        });
      }
      
      setIsLoading(false);
      return module;
    } catch (error) {
      console.error(`[ModuleContext] Error al cargar módulo ${path}:`, error);
      setModuleErrors(prev => ({
        ...prev,
        [path]: error.message
      }));
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Verifica si un módulo existe sin cargarlo completamente
   * @param {string} path - Ruta al módulo
   */
  const checkModuleExists = async (path) => {
    try {
      await import(/* @vite-ignore */ path);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Precarga módulos críticos al inicio
   * DESHABILITADO: Los módulos se cargan bajo demanda
   */
  const preloadCriticalModules = async () => {
    // Precarga deshabilitada para evitar errores de módulos inexistentes
    // Los módulos se cargarán cuando sean necesarios
    setIsLoading(false);
    return;
    
    /* 
    const criticalModules = [
      { path: './components/ConsultasPenales', name: 'ConsultasPenales' },
      { path: './components/ConsultasCiviles', name: 'ConsultasCiviles' },
      { path: './components/ConsultasTransito', name: 'ConsultasTransito' },
      { path: './components/Consultation/ConsultationHub', name: 'ConsultationHub' },
      { path: './components/Auth/Register', name: 'Register' },
      { path: './components/PrivacyPolicy', name: 'PrivacyPolicy' }
    ];

    setIsLoading(true);
    for (const { path, name } of criticalModules) {
      try {
        await loadModule(path, name);
        console.log(`[ModuleContext] Módulo ${name} precargado correctamente`);
      } catch (error) {
        console.warn(`[ModuleContext] Error al precargar ${name}:`, error.message);
      }
    }
    setIsLoading(false);
    */
  };

  // Valor del contexto
  const value = {
    loadModule,
    checkModuleExists,
    preloadCriticalModules,
    loadedModules,
    moduleErrors,
    isLoading
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules debe ser usado dentro de un ModuleProvider');
  }
  return context;
}

// Componente de alto orden para cargar un módulo automáticamente
export function withModuleLoading(Component, modulePath, moduleName) {
  return function WithModuleLoading(props) {
    const { loadModule, loadedModules, moduleErrors, isLoading } = useModules();
    const [module, setModule] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const loadTheModule = async () => {
        try {
          const loadedModule = await loadModule(modulePath, moduleName);
          if (isMounted) {
            setModule(loadedModule);
            setError(null);
          }
        } catch (err) {
          if (isMounted) {
            setError(err);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      // Si ya está cargado, usarlo directamente
      if (loadedModules[modulePath]) {
        setModule(loadedModules[modulePath]);
        setLoading(false);
      } else {
        loadTheModule();
      }

      return () => {
        isMounted = false;
      };
    }, [modulePath, moduleName]);

    if (loading || isLoading) {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-600">Cargando módulo...</p>
        </div>
      );
    }

    if (error || moduleErrors[modulePath]) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error al cargar el módulo</h3>
          <p>{error?.message || moduleErrors[modulePath] || 'Error desconocido'}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => loadModule(modulePath, moduleName)}
          >
            Reintentar
          </button>
        </div>
      );
    }

    // Pasar el módulo como prop a la componente envuelta
    return <Component {...props} module={module} />;
  };
}

export default ModuleContext;
