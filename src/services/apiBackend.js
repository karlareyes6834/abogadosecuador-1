/**
 * Servicio de API para conectar con el backend de producción
 * Sistema de pagos y compras real
 * Usa proxy de Vite en desarrollo (/api) -> localhost:3001
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
};

// Helper para headers con autenticación
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ============================================
// SISTEMA DE PAGOS
// ============================================

export const paymentService = {
  /**
   * Crear intención de pago con Stripe
   */
  createPaymentIntent: async (amount, metadata = {}, token = null) => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        amount,
        currency: 'usd',
        metadata
      })
    });
    
    return handleResponse(response);
  },

  /**
   * Verificar pago de PayPal
   */
  verifyPayPalPayment: async (orderId, payerId, paymentId, token = null) => {
    const response = await fetch(`${API_URL}/verify-paypal-payment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        orderId,
        payerId,
        paymentId
      })
    });
    
    return handleResponse(response);
  }
};

// ============================================
// SISTEMA DE COMPRAS
// ============================================

export const purchaseService = {
  /**
   * Procesar compra completa
   */
  processPurchase: async (purchaseData, token = null) => {
    const response = await fetch(`${API_URL}/purchase`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(purchaseData)
    });
    
    return handleResponse(response);
  },

  /**
   * Obtener historial de compras del usuario
   */
  getUserPurchases: async (userId, token = null) => {
    const response = await fetch(`${API_URL}/user-purchases/${userId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    
    return handleResponse(response);
  },

  /**
   * Verificar acceso a un producto
   */
  checkAccess: async (userId, productId, token = null) => {
    const response = await fetch(`${API_URL}/check-access/${userId}/${productId}`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    
    return handleResponse(response);
  }
};

// ============================================
// SISTEMA DE SUSCRIPCIONES
// ============================================

export const subscriptionService = {
  /**
   * Verificar suscripciones expiradas
   */
  checkSubscriptions: async (token = null) => {
    const response = await fetch(`${API_URL}/check-subscriptions`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    
    return handleResponse(response);
  }
};

// ============================================
// REGISTRO DE USUARIOS
// ============================================

export const authServiceBackend = {
  /**
   * Registrar nuevo usuario
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  }
};

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

export const contactService = {
  /**
   * Enviar mensaje de contacto
   */
  sendMessage: async (messageData) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData)
    });
    
    return handleResponse(response);
  }
};

// ============================================
// PRODUCTOS
// ============================================

export const productsService = {
  /**
   * Obtener todos los productos
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/products${queryParams ? '?' + queryParams : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return handleResponse(response);
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: error.message };
  }
};

// Export por defecto con todos los servicios
export default {
  payment: paymentService,
  purchase: purchaseService,
  subscription: subscriptionService,
  auth: authServiceBackend,
  contact: contactService,
  products: productsService,
  healthCheck
};
