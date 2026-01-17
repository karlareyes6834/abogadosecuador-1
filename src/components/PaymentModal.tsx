import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentService, PaymentInfo, PaymentResponse } from '../services/PaymentService';

/**
 * COMPONENTE DE PAGO UNIFICADO
 * 
 * Se usa en todos los sistemas (Abogados OS, Juegos, Trading)
 * Integra los tres métodos de pago:
 * - Banco Pichincha
 * - PayPal
 * - Binance Pay
 * 
 * EXPLICACIÓN:
 * - Un solo componente para todos los pagos
 * - Interfaz consistente en todos los sistemas
 * - Validación en tiempo real
 * - Manejo de errores profesional
 */

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  itemName: string;
  itemType: 'game' | 'upgrade' | 'subscription' | 'crypto' | 'service';
  amount: number;
  currency?: 'USD' | 'BTC' | 'ETH' | 'BNB' | 'USDT';
  system: 'abogados-os' | 'games' | 'crypto-banking';
  onPaymentSuccess?: (response: PaymentResponse) => void;
  onPaymentError?: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  itemName,
  itemType,
  amount,
  currency = 'USD',
  system,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'pichincha' | 'paypal' | 'binance' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * MANEJAR PAGO
   * 
   * Flujo:
   * 1. Validar método seleccionado
   * 2. Crear información de pago
   * 3. Procesar pago
   * 4. Mostrar resultado
   * 5. Cerrar modal o redirigir
   */
  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Crear información de pago
      const paymentInfo: PaymentInfo = {
        userId,
        amount,
        currency,
        method: selectedMethod,
        description: `Compra de ${itemName}`,
        itemType,
        itemName,
        system
      };

      // Procesar pago
      const response = await paymentService.processPayment(paymentInfo);

      if (response.success) {
        setSuccess(true);
        onPaymentSuccess?.(response);

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setSelectedMethod(null);
        }, 2000);
      } else {
        setError(response.error || 'Error al procesar el pago');
        onPaymentError?.(response.error || 'Error desconocido');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * OBTENER INFORMACIÓN DEL MÉTODO DE PAGO
   */
  const getMethodInfo = (method: 'pichincha' | 'paypal' | 'binance') => {
    return paymentService.getPaymentMethodInfo(method);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Realizar Pago</h2>
                  <p className="text-sm opacity-90 mt-1">{itemName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Resumen de Pago */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {amount} {currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Producto:</span>
                    <span className="text-gray-900 dark:text-white">{itemName}</span>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Selecciona método de pago:</h3>

                  {/* Banco Pichincha */}
                  <button
                    onClick={() => setSelectedMethod('pichincha')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'pichincha'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">Banco Pichincha</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Transferencia bancaria
                        </div>
                      </div>
                      {selectedMethod === 'pichincha' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>

                  {/* PayPal */}
                  <button
                    onClick={() => setSelectedMethod('paypal')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                        PP
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">PayPal</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Pago seguro con PayPal
                        </div>
                      </div>
                      {selectedMethod === 'paypal' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>

                  {/* Binance Pay */}
                  <button
                    onClick={() => setSelectedMethod('binance')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'binance'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold">
                        BNB
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">Binance Pay</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Criptomonedas verificadas
                        </div>
                      </div>
                      {selectedMethod === 'binance' && (
                        <div className="w-5 h-5 bg-yellow-500 rounded-full" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Información del Método Seleccionado */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                  >
                    <div className="text-sm space-y-2">
                      {selectedMethod === 'pichincha' && (
                        <>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Datos de Transferencia:
                          </p>
                          <div className="space-y-1 text-gray-700 dark:text-gray-300">
                            <p>
                              <span className="font-medium">Banco:</span> Banco Pichincha
                            </p>
                            <p>
                              <span className="font-medium">Cuenta:</span> 2203728320
                            </p>
                            <p>
                              <span className="font-medium">Titular:</span> Plataforma Integrada
                            </p>
                            <p>
                              <span className="font-medium">Monto:</span> {amount} {currency}
                            </p>
                          </div>
                        </>
                      )}
                      {selectedMethod === 'paypal' && (
                        <>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Información PayPal:
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Serás redirigido a PayPal para completar el pago de forma segura.
                          </p>
                        </>
                      )}
                      {selectedMethod === 'binance' && (
                        <>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Información Binance Pay:
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Escanea el código QR o usa tu app de Binance para pagar.
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Mensajes de Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Mensaje de Éxito */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ¡Pago procesado exitosamente!
                    </p>
                  </motion.div>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pagar {amount} {currency}
                      </>
                    )}
                  </button>
                </div>

                {/* Nota de Seguridad */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Tu información de pago está protegida con encriptación de nivel empresarial.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
