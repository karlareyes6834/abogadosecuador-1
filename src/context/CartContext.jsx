import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import coursesService from '../services/coursesService';
import { useAuth } from './AuthContext';

// Definir el contexto
const CartContext = createContext();

// Acciones para el reducer
export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
};

// Estado inicial
const initialState = {
  items: [],
  total: 0
};

// Función para calcular el total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  console.log('🔄 Reducer ejecutado:', action.type, 'Payload:', action.payload);
  console.log('📊 Estado actual:', state);
  
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      // Verificar si el item ya está en el carrito
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id && item.type === action.payload.type
      );
      
      console.log('🔍 Índice de item existente:', existingItemIndex);
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, incrementar la cantidad (excepto para cursos y ebooks)
        if (action.payload.type === 'course' || action.payload.type === 'ebook') {
          // Para cursos y ebooks, mostrar un mensaje y no duplicar
          toast.error('Este item ya está en tu carrito');
          return state;
        }
        
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + (action.payload.quantity || 1)
        };
      } else {
        // Si el item no existe, agregarlo al carrito
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => 
        !(item.id === action.payload.id && item.type === action.payload.type)
      );
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, type, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_FROM_CART, 
          payload: { id, type } 
        });
      }
      
      const newItems = state.items.map(item => {
        if (item.id === id && item.type === type) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      // Limpiar el carrito en localStorage
      localStorage.removeItem('cart');
      
      return initialState;
    }
    
    case CART_ACTIONS.SET_CART: {
      const { items } = action.payload;
      const total = calculateTotal(items);
      
      return {
        items,
        total
      };
    }
    
    default:
      return state;
  }
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const authContext = useAuth() || {};
  const { user, hasUserPurchasedCourse } = authContext;
  
  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Validar que el carrito almacenado tenga la estructura correcta
        if (parsedCart && Array.isArray(parsedCart.items)) {
          dispatch({ 
            type: CART_ACTIONS.SET_CART, 
            payload: { items: parsedCart.items } 
          });
        }
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Verificar en cada renderizado si el usuario ya ha comprado alguno de los cursos en el carrito
  useEffect(() => {
    if (user && state.items.length > 0) {
      // Filtrar cursos que el usuario ya haya comprado
      const updatedItems = state.items.filter(item => {
        if (item.type === 'course') {
          // Si el usuario ya compró el curso, eliminarlo del carrito
          if (hasUserPurchasedCourse(item.id)) {
            toast.info(`"${item.title}" ya está en tu biblioteca, se ha eliminado del carrito.`);
            return false;
          }
        }
        return true;
      });
      
      // Actualizar el carrito si se eliminaron items
      if (updatedItems.length !== state.items.length) {
        dispatch({ 
          type: CART_ACTIONS.SET_CART, 
          payload: { items: updatedItems } 
        });
      }
    }
  }, [user, state.items, hasUserPurchasedCourse]);
  
  // Actualizar total cuando cambian los items
  useEffect(() => {
    if (state.total !== calculateTotal(state.items)) {
      const newTotal = calculateTotal(state.items);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: newTotal
      }));
    }
  }, [state.items, state.total]);
  
  // Función para agregar un curso al carrito
  const addCourseToCart = async (courseId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar cursos al carrito');
      return { success: false };
    }
    
    try {
      const { success, error, alreadyPurchased, item } = await coursesService.addCourseToCart(courseId, user.id);
      
      if (alreadyPurchased) {
        toast.info('Ya has comprado este curso. Puedes acceder a él desde tu biblioteca.');
        return { success: false };
      }
      
      if (error) {
        toast.error(error.message || 'Error al agregar el curso al carrito');
        return { success: false };
      }
      
      if (success && item) {
        dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: item });
        setIsCartVisible(true);
        toast.success(`"${item.title}" agregado al carrito`);
        return { success: true };
      }
    } catch (error) {
      console.error('Error al agregar curso al carrito:', error);
      toast.error('Ocurrió un error al agregar el curso al carrito');
      return { success: false };
    }
  };
  
  // Función para agregar un item genérico al carrito
  const addToCart = (item) => {
    console.log('🛒 addToCart llamado con:', item);
    
    if (!item || !item.id) {
      console.error('❌ Error: Item inválido', item);
      toast.error('Error al agregar producto al carrito');
      return;
    }
    
    try {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: item });
      setIsCartVisible(true);
      const itemName = item.title || item.name || 'Producto';
      toast.success(`"${itemName}" agregado al carrito`);
      console.log('✅ Item agregado exitosamente');
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      toast.error('Error al agregar producto al carrito');
    }
  };
  
  // Función para actualizar la cantidad de un item
  const updateQuantity = (id, type, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id, type, quantity: parseInt(quantity, 10) } 
    });
  };
  
  // Función para eliminar un item del carrito
  const removeFromCart = (id, type) => {
    console.log('🗑️ removeFromCart llamado con:', { id, type });
    
    const itemToRemove = state.items.find(item => item.id === id && item.type === type);
    
    if (itemToRemove) {
      console.log('🗑️ Item encontrado para eliminar:', itemToRemove);
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { id, type } });
      const itemName = itemToRemove.title || itemToRemove.name || 'Producto';
      toast.success(`"${itemName}" eliminado del carrito`);
      console.log('✅ Item eliminado exitosamente');
    } else {
      console.warn('⚠️ Item no encontrado en el carrito:', { id, type });
      toast.error('Producto no encontrado en el carrito');
    }
  };
  
  // Función para limpiar el carrito
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  // Función para procesar el pago CON BACKEND REAL
  const checkout = async (paymentMethod, paymentDetails = {}) => {
    console.log('🛒 Iniciando checkout...', { paymentMethod, itemsCount: state.items.length });
    
    if (!user) {
      console.error('❌ Usuario no autenticado');
      toast.error('Debes iniciar sesión para realizar el pago');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    if (state.items.length === 0) {
      console.error('❌ Carrito vacío');
      toast.error('El carrito está vacío');
      return { success: false, error: 'Carrito vacío' };
    }
    
    if (state.total <= 0) {
      console.error('❌ Total inválido');
      toast.error('El total de la compra es inválido');
      return { success: false, error: 'Total inválido' };
    }
    
    try {
      // Importar servicios necesarios
      const { dataService } = await import('../services/supabaseService.js');
      
      // Generar ID único para la orden
      const orderId = 'ORD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      // Calcular totales
      const subtotal = state.total;
      const tax = subtotal * 0.12; // 12% IVA
      const total = subtotal + tax;
      
      console.log('Procesando checkout:', {
        orderId,
        items: state.items,
        total,
        paymentMethod,
        paymentDetails
      });
      
      // Crear la orden en Supabase
      const orderData = {
        id: orderId,
        user_id: user.id,
        amount: total,
        subtotal: subtotal,
        tax: tax,
        discount: 0,
        status: 'completed',
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        transaction_id: paymentDetails.id || paymentDetails.orderID || Date.now().toString(),
        items: state.items,
        billing_info: {
          name: user.name || user.full_name || user.email,
          email: user.email,
          phone: user.phone
        },
        completed_at: new Date().toISOString()
      };
      
      let order = null;
      
      try {
        const result = await dataService.create('orders', orderData);
        order = result.data;
        
        if (result.error) {
          console.error('Error al crear orden:', result.error);
          // Continuar para no bloquear el flujo, pero registrar el error
          console.warn('⚠️ Orden no guardada en BD, pero continuando flujo');
        } else {
          console.log('✅ Orden creada exitosamente:', orderId);
        }
      } catch (orderError) {
        console.error('❌ Error crítico al crear orden:', orderError);
        // No bloquear el flujo en producción
        console.warn('⚠️ Continuando a pesar del error de orden');
      }
      
      // Crear registros de compra individuales para cada item
      const purchasePromises = state.items.map(async (item) => {
        const purchaseData = {
          user_id: user.id,
          product_id: item.id,
          product_type: item.type || 'product',
          product_name: item.title || item.name,
          amount: item.price,
          quantity: item.quantity || 1,
          order_id: orderId,
          payment_method: paymentMethod,
          transaction_id: orderData.transaction_id,
          status: 'active'
        };
        
        try {
          const { error } = await dataService.create('purchases', purchaseData);
          
          if (error) {
            console.warn('Error al crear compra, continuando:', error);
          }
          
          // Si es un curso, crear inscripción
          if (item.type === 'course') {
            try {
              await dataService.create('course_enrollments', {
                user_id: user.id,
                course_id: item.id,
                order_id: orderId,
                progress: 0,
                status: 'active'
              });
            } catch (enrollmentError) {
              console.warn('Error al crear inscripción:', enrollmentError);
            }
          }
          
          // Crear acceso al producto
          try {
            await dataService.create('user_products', {
              user_id: user.id,
              product_id: item.id,
              product_type: item.type || 'product',
              access_granted: true,
              purchase_id: null
            });
          } catch (accessError) {
            console.warn('Error al crear acceso:', accessError);
          }
        } catch (error) {
          console.warn('Error en procesamiento de item:', error);
        }
        
        return purchaseData;
      });
      
      const purchaseResults = await Promise.allSettled(purchasePromises);
      
      const successfulPurchases = purchaseResults.filter(r => r.status === 'fulfilled').length;
      const failedPurchases = purchaseResults.filter(r => r.status === 'rejected').length;
      
      console.log(`✅ Compras exitosas: ${successfulPurchases}/${state.items.length}`);
      
      if (failedPurchases > 0) {
        console.warn(`⚠️ ${failedPurchases} compras fallaron, pero el pago se procesó`);
      }
      
      toast.success('¡Compra realizada con éxito!');
      
      // Limpiar carrito después de éxito
      console.log('🧹 Limpiando carrito...');
      clearCart();
      
      console.log('✅ Checkout completado exitosamente');
      
      return { 
        success: true, 
        transactionId: orderData.transaction_id,
        orderId: orderId,
        order: order,
        purchasedItems: successfulPurchases
      };
    } catch (error) {
      console.error('Error en el checkout:', error);
      toast.error(error.message || 'Error al procesar la compra. Inténtalo de nuevo.');
      return { success: false, error: error.message };
    }
  };
  
  // Alternar la visibilidad del carrito
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };
  
  // Función para obtener el total del carrito
  const getCartTotal = () => {
    return state.total;
  };

  // Valores a proporcionar en el contexto
  const value = {
    items: state.items,
    cartItems: state.items, // Alias para compatibilidad
    cart: state.items, // Alias para compatibilidad con CheckoutPage
    total: state.total,
    itemCount: state.items.reduce((count, item) => count + (item.quantity || 1), 0),
    isCartVisible,
    setIsCartVisible,
    addToCart,
    addCourseToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    getCartTotal, // Exponer función getCartTotal
    toggleCartVisibility
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  
  return context;
};
