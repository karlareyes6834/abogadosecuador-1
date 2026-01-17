/**
 * Connection Manager - Utilidad para gestionar conexiones WebSocket y fallback de módulos
 * 
 * Este módulo proporciona funciones para:
 * 1. Administrar conexiones WebSocket con reconexión automática
 * 2. Cargar módulos con fallback para evitar errores 404
 */

const config = (typeof window !== 'undefined' && window.__DEV_CONFIG)
  ? window.__DEV_CONFIG
  : {
    endpoints: {
      websocket: ''
    },
    maxReconnectAttempts: 5,
    reconnectInterval: 2000,
    debug: {
      websocket: false,
      modules: false
    },
    moduleFallbackPaths: {},
    offline: {
      disableWebSocket: true
    }
  };

/**
 * Clase para gestionar conexiones WebSocket
 */
class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url || config.endpoints.websocket;
    this.options = {
      reconnectAttempts: config.maxReconnectAttempts || 5,
      reconnectInterval: config.reconnectInterval || 2000,
      onOpen: () => {},
      onMessage: () => {},
      onClose: () => {},
      onError: () => {},
      ...options
    };
    this.socket = null;
    this.reconnectCount = 0;
    this.isConnecting = false;
    this.debug = config.debug?.websocket || false;
  }

  /**
   * Inicia la conexión WebSocket
   */
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.log('WebSocket ya está conectado o conectándose');
      return;
    }

    this.isConnecting = true;
    this.log(`Intentando conectar a ${this.url}`);

    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = (event) => {
        this.isConnecting = false;
        this.reconnectCount = 0;
        this.log('WebSocket conectado');
        this.options.onOpen(event);
      };
      
      this.socket.onmessage = (event) => {
        this.options.onMessage(event);
      };
      
      this.socket.onclose = (event) => {
        this.isConnecting = false;
        this.log(`WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`);
        this.options.onClose(event);
        
        if (event.code !== 1000) { // 1000 es cierre normal
          this.attemptReconnect();
        }
      };
      
      this.socket.onerror = (error) => {
        this.log('Error en WebSocket', error);
        this.options.onError(error);
      };
    } catch (error) {
      this.isConnecting = false;
      this.log('Error al crear WebSocket', error);
      this.attemptReconnect();
    }
  }

  /**
   * Intenta reconectar después de un error o cierre
   */
  attemptReconnect() {
    if (this.reconnectCount >= this.options.reconnectAttempts) {
      this.log('Se superó el número máximo de intentos de reconexión');
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.reconnectCount++;
    
    this.log(`Intentando reconectar (${this.reconnectCount}/${this.options.reconnectAttempts}) en ${this.options.reconnectInterval}ms`);
    
    setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval);
  }

  /**
   * Envía un mensaje a través del WebSocket
   */
  send(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.log('No se puede enviar mensaje: WebSocket no conectado');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(message);
      return true;
    } catch (error) {
      this.log('Error al enviar mensaje', error);
      return false;
    }
  }

  /**
   * Cierra la conexión WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Cierre voluntario');
      this.socket = null;
    }
  }

  /**
   * Función de registro condicional para depuración
   */
  log(...args) {
    if (this.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }
}

/**
 * Función para cargar módulos con fallback para prevenir errores 404
 * @param {string} modulePath - Ruta al módulo
 * @param {string} moduleName - Nombre del módulo para buscar en rutas alternativas
 * @returns {Promise<any>} - El módulo cargado
 */
export async function loadModuleWithFallback(modulePath, moduleName) {
  const debug = config.debug?.modules || false;
  
  try {
    if (debug) console.log(`[ModuleLoader] Intentando cargar módulo: ${modulePath}`);
    return await import(/* @vite-ignore */ modulePath);
  } catch (error) {
    if (debug) console.log(`[ModuleLoader] Error al cargar ${modulePath}:`, error.message);
    
    // Buscar en rutas de fallback
    const fallbackPaths = config.moduleFallbackPaths?.[moduleName] || [];
    
    for (const fallbackBase of fallbackPaths) {
      try {
        const fallbackPath = `${fallbackBase}/${moduleName}`;
        if (debug) console.log(`[ModuleLoader] Intentando fallback: ${fallbackPath}`);
        return await import(/* @vite-ignore */ fallbackPath);
      } catch (fallbackError) {
        if (debug) console.log(`[ModuleLoader] Error en fallback ${fallbackBase}:`, fallbackError.message);
      }
    }
    
    // Si llegamos aquí, no se pudo cargar en ningún lado
    throw new Error(`No se pudo cargar el módulo '${moduleName}' desde '${modulePath}' ni desde rutas alternativas`);
  }
}

// Exportar la clase WebSocketManager y otras utilidades
export { WebSocketManager };

// Crear y exportar una instancia predeterminada del WebSocketManager
export const defaultWebSocketManager = new WebSocketManager();

/**
 * Patch para corregir problemas de WebSocket en ventanas de desarrollo
 * Esta función debe llamarse temprano en la inicialización de la app
 */
export function applyWebSocketFixes() {
  // Corregir problemas con WebSocket en modo desarrollo
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[WebSocketFix] Aplicando soluciones para WebSocket en modo desarrollo');
    
    // Asegurar que WebSocket use el puerto y host correctos
    window.WEBSOCKET_URL = config.endpoints.websocket;
    
    // Configurar variables globales que otras partes de la aplicación pueden usar
    window.__DEV_CONFIG = config;
    
    // Si está habilitado el modo offline, deshabilitar WebSocket
    if (config.offline?.disableWebSocket) {
      console.log('[WebSocketFix] Modo offline activo, WebSocket deshabilitado');
    }
  }
}
