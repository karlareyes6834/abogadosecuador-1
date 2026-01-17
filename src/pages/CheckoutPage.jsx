import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaLock, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import PayPalButton from '../components/Payment/PayPalButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/supabaseService';

const CheckoutPage = () => {
  const { cart = [], getCartTotal, clearCart, checkout } = useCart() || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    identificacion: '',
    direccion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [hasCheckedCart, setHasCheckedCart] = useState(false);
  
  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      // Intentar obtener información del perfil desde Supabase
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await dataService.getById('profiles', user.id);
          
          if (data && !error) {
            console.log('✅ Perfil de usuario cargado:', data);
            setBillingInfo({
              name: data.full_name || '',
              email: user.email || '',
              phone: data.phone || '',
              identificacion: '',
              direccion: data.address || ''
            });
          } else if (error) {
            // Si el perfil no existe, crearlo automáticamente
            console.log('ℹ️ Perfil no existe, creando uno nuevo...');
            const newProfile = {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              email: user.email || '',
              phone: '',
              address: '',
              role: 'client',
              created_at: new Date().toISOString()
            };
            
            const { error: createError } = await dataService.create('profiles', newProfile);
            
            if (!createError) {
              console.log('✅ Perfil creado exitosamente');
              setBillingInfo({
                name: newProfile.full_name,
                email: newProfile.email,
                phone: '',
                identificacion: '',
                direccion: ''
              });
            } else {
              console.error('❌ Error al crear perfil:', createError);
            }
          }
        } catch (error) {
          console.error('❌ Error al obtener/crear perfil de usuario:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);
  
  // Verificar usuario autenticado primero
  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una compra');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);
  
  // Verificar que hay productos en el carrito (solo una vez)
  useEffect(() => {
    if (hasCheckedCart) return;
    
    if (!cart || cart.length === 0) {
      toast.error('No hay productos en el carrito');
      navigate('/tienda');
    } else {
      setHasCheckedCart(true);
    }
  }, [cart, navigate, hasCheckedCart]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    console.log('🔍 Validando formulario de checkout...');
    console.log('📋 Datos actuales:', billingInfo);
    
    // Validar campos obligatorios
    if (!billingInfo.name.trim()) {
      console.log('❌ Validación falló: Nombre vacío');
      toast.error('Por favor ingrese su nombre completo');
      return false;
    }
    
    if (!billingInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(billingInfo.email)) {
      console.log('❌ Validación falló: Email inválido');
      toast.error('Por favor ingrese un correo electrónico válido');
      return false;
    }
    
    if (!billingInfo.phone.trim()) {
      console.log('❌ Validación falló: Teléfono vacío');
      toast.error('Por favor ingrese su número telefónico');
      return false;
    }
    
    console.log('✅ Validación de formulario exitosa');
    return true;
  };
  
  const handleBankTransfer = async () => {
    if (!validateForm()) return;
    
    if (!user) {
      toast.error('Debes iniciar sesión para realizar la compra');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generar ID único para la orden
      const orderId = 'ORD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      // Calcular totales
      const subtotal = getCartTotal();
      const tax = subtotal * 0.12; // 12% IVA
      const total = subtotal + tax;
      
      // Crear la orden en Supabase
      const orderData = {
        id: orderId,
        user_id: user.id,
        amount: total,
        subtotal: subtotal,
        tax: tax,
        status: 'pending', // Pendiente hasta que se confirme el pago
        payment_method: 'bank_transfer',
        items: cart,
        billing_info: billingInfo,
        created_at: new Date().toISOString()
      };
      
      const { error: orderError } = await dataService.create('orders', orderData);
      
      if (orderError) {
        throw new Error('Error al crear la orden');
      }
      
      // Crear registros de compra individuales (en estado pendiente)
      const purchasePromises = cart.map(async (item) => {
        const purchaseData = {
          user_id: user.id,
          product_id: item.id,
          product_type: item.type || 'product',
          product_name: item.name,
          amount: item.price,
          quantity: item.quantity || 1,
          order_id: orderId,
          payment_method: 'bank_transfer',
          status: 'pending' // Se activará cuando se confirme el pago
        };
        
        return dataService.create('purchases', purchaseData);
      });
      
      await Promise.all(purchasePromises);
      
      // Limpiar carrito
      clearCart();
      
      toast.success('Orden creada exitosamente. Pendiente de confirmación de pago.');
      
      // Redirigir a página de éxito
      navigate('/payment/success', { 
        state: { 
          orderId,
          amount: total,
          billingInfo,
          paymentMethod: 'bank_transfer'
        } 
      });
      
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      toast.error('Hubo un problema al procesar su orden. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Finalizar Compra | Abg. Wilson Ipiales</title>
        <meta name="description" content="Finalice su compra de servicios legales con el Abg. Wilson Ipiales" />
      </Helmet>
      
      <main className="bg-gray-100 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/tienda')}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Seguir Comprando
            </button>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900"
            >
              Finalizar Compra
            </motion.h1>
            
            <div className="w-32"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Formulario de Checkout */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Información de Facturación
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={billingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="identificacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula o RUC
                  </label>
                  <input
                    type="text"
                    id="identificacion"
                    name="identificacion"
                    value={billingInfo.identificacion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <textarea
                    id="direccion"
                    name="direccion"
                    value={billingInfo.direccion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-600" />
                  Método de Pago - Solo PayPal
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-600">
                    <label className="flex items-center text-sm font-medium text-gray-900 w-full">
                      <svg className="h-8 w-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.773.773 0 0 1 .762-.64h8.789c2.769 0 4.626 1.273 5.058 3.477.356 1.82-.063 3.24-.987 4.368-1.054 1.287-2.695 1.943-4.879 1.943H10.17l-.81 5.128a.642.642 0 0 1-.633.641H7.076zm8.41-12.957c-.906 0-1.518.068-1.862.204-.344.136-.576.34-.69.61a1.01 1.01 0 0 0-.04.54l.394 2.508h1.36c.906 0 1.57-.204 1.973-.609.404-.406.606-.997.606-1.774 0-.777-.242-1.478-.93-1.478z"/>
                      </svg>
                      <div>
                        <div className="font-semibold">PayPal</div>
                        <div className="text-xs text-gray-600">Pago seguro con tarjeta de crédito/débito</div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <FaLock className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-1">
                          Pago 100% Seguro
                        </p>
                        <p className="text-sm text-green-700">
                          Acceso inmediato a tus productos después del pago. Procesamiento seguro garantizado por PayPal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {user && cart && cart.length > 0 && getCartTotal() > 0 ? (
                  <PayPalButton 
                    amount={useMemo(() => {
                      const total = getCartTotal();
                      const withTax = total * 1.12;
                      const formatted = withTax.toFixed(2);
                      console.log('💰 Cálculo de monto para PayPal:', formatted);
                      return formatted;
                    }, [cart, getCartTotal])}
                    onBeforeOrder={() => {
                      if (!validateForm()) {
                        toast.error('Por favor completa todos los campos de facturación antes de pagar');
                        return false;
                      }
                      return true;
                    }}
                    onSuccess={async (details) => {
                      console.log('PayPal payment successful:', details);
                      
                      // Validar que tenemos la información necesaria
                      if (!validateForm()) {
                        toast.error('Por favor completa toda la información de facturación');
                        return;
                      }
                      
                      setLoading(true);
                      
                      try {
                        const result = await checkout('paypal', details);
                        
                        if (result.success) {
                          toast.success('¡Compra realizada con éxito!');
                          // Pequeño delay para asegurar que el checkout se completó
                          setTimeout(() => {
                            navigate('/payment/success', {
                              state: {
                                orderId: result.orderId,
                                amount: getCartTotal() * 1.12,
                                billingInfo,
                                paymentMethod: 'paypal',
                                transactionId: result.transactionId
                              },
                              replace: true
                            });
                          }, 500);
                        } else {
                          throw new Error(result.error || 'Error procesando la compra');
                        }
                      } catch (error) {
                        console.error('Checkout error:', error);
                        toast.error('Error al procesar la compra. Por favor intenta nuevamente.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal payment error:', err);
                      setLoading(false);
                      toast.error('Ocurrió un error durante el pago con PayPal.');
                    }}
                  />
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                    <p className="text-red-600 text-sm">
                      {!user ? 'Debes iniciar sesión para continuar' : 'El carrito está vacío o el monto es inválido'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Resumen del Pedido */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-blue-600" />
                Resumen del Pedido
              </h2>
              
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name} {item.quantity > 1 && `(${item.quantity})`}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${getCartTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-600">IVA (12%)</p>
                  <p className="text-sm font-medium text-gray-900">${(getCartTotal() * 0.12).toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <p>Total</p>
                  <p>${(getCartTotal() * 1.12).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center text-sm text-gray-600">
                <FaLock className="text-green-500 mr-2" />
                <p>Pago seguro garantizado</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
    </>
  );
};

export default CheckoutPage;
