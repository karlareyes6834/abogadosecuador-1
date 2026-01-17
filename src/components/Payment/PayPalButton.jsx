import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';

const PayPalButton = ({ amount, onSuccess, onError, onBeforeOrder }) => {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  
  // Usar variable de entorno o fallback al client-id hardcodeado
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AWxKgr5n7ex5Lc3fDBOooaVHLgcAB-KCrYXgCmit9DpNXFIuBa6bUypYFjr-hAqARlILGxk_rRTsBZeS';
  
  const initialOptions = {
    'client-id': clientId,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons',
    'enable-funding': 'venmo,card',
    'disable-funding': 'credit',
  };

  return (
    <div className="paypal-button-container">
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Procesando pago...</span>
        </div>
      )}
      
      <PayPalScriptProvider 
        options={initialOptions}
        deferLoading={false}
      >
        <PayPalButtons
          style={{ 
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          }}
          disabled={loading}
          forceReRender={[amount]}
          createOrder={(data, actions) => {
            console.log('✅ Creating PayPal order');
            console.log('Amount received:', amount);
            console.log('Amount type:', typeof amount);
            
            // Ejecutar validación previa si existe
            if (onBeforeOrder && typeof onBeforeOrder === 'function') {
              console.log('🔍 Running pre-order validation...');
              const canProceed = onBeforeOrder();
              if (!canProceed) {
                console.log('❌ Pre-order validation failed');
                return Promise.reject(new Error('Validation failed'));
              }
              console.log('✅ Pre-order validation passed');
            }
            
            // Asegurar que el monto sea válido
            const parsedAmount = parseFloat(amount);
            console.log('Parsed amount:', parsedAmount);
            
            if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
              console.error('❌ Invalid amount:', amount);
              toast.error('Monto inválido para procesar el pago');
              return Promise.reject(new Error('Invalid amount'));
            }
            
            const orderAmount = parsedAmount.toFixed(2);
            console.log('✅ Order amount formatted:', orderAmount);
            
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: orderAmount,
                    currency_code: 'USD'
                  },
                  description: 'Compra en Abg. Wilson Ipiales'
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING'
              }
            }).then((orderId) => {
              console.log('✅ PayPal order created successfully:', orderId);
              return orderId;
            }).catch((error) => {
              console.error('❌ Error creating PayPal order:', error);
              toast.error('Error al crear la orden de pago');
              throw error;
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setLoading(true);
              console.log('PayPal payment approved, capturing order...');
              
              const details = await actions.order.capture();
              console.log('PayPal payment captured successfully:', details);
              
              // Validar que el pago fue completado
              if (details.status === 'COMPLETED') {
                toast.success('¡Pago procesado exitosamente!');
                await onSuccess(details);
              } else {
                throw new Error('Payment not completed');
              }
            } catch (error) {
              console.error('PayPal capture error:', error);
              toast.error('Error al capturar el pago. Por favor, contacte soporte.');
              onError(error);
            } finally {
              setLoading(false);
            }
          }}
          onError={(err) => {
            console.error('PayPal button error:', err);
            setLoading(false);
            toast.error('Error en el procesamiento del pago con PayPal');
            onError(err);
          }}
          onCancel={(data) => {
            console.log('PayPal payment cancelled by user:', data);
            setLoading(false);
            toast('Pago cancelado', { icon: 'ℹ️' });
            onError({ message: 'Payment cancelled by user' });
          }}
          onInit={(data, actions) => {
            console.log('PayPal buttons initialized');
            setSdkReady(true);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;