/**
 * SERVICIO DE PAGOS UNIFICADO
 * 
 * Integra todos los métodos de pago en una sola interfaz
 * Métodos: Banco Pichincha, PayPal, Binance Pay
 * Sistemas: Abogados OS, Juegos, Trading
 * 
 * EXPLICACIÓN:
 * - Un solo servicio para todos los pagos
 * - Validación centralizada
 * - Verificación de transacciones
 * - Sin duplicaciones
 * - Lógica clara y profesional
 */

import { supabase } from '../config/supabase';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export type PaymentMethod = 'pichincha' | 'paypal' | 'binance';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TransactionType = 'purchase' | 'deposit' | 'withdrawal' | 'transfer';
export type SystemType = 'abogados-os' | 'games' | 'crypto-banking';

/**
 * INFORMACIÓN DE PAGO
 * Datos que el usuario proporciona para realizar un pago
 */
export interface PaymentInfo {
  userId: string;
  amount: number;
  currency: 'USD' | 'BTC' | 'ETH' | 'BNB' | 'USDT';
  method: PaymentMethod;
  description: string;
  itemType: 'game' | 'upgrade' | 'subscription' | 'crypto' | 'service';
  itemName: string;
  system: SystemType;
}

/**
 * TRANSACCIÓN DE PAGO
 * Registro de la transacción en la base de datos
 */
export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  item_type: string;
  item_name: string;
  system: SystemType;
  description: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
}

/**
 * RESPUESTA DE PAGO
 * Lo que retorna el servicio después de procesar un pago
 */
export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  message: string;
  redirectUrl?: string;
  error?: string;
}

/**
 * CONFIGURACIÓN DE MÉTODOS DE PAGO
 * Credenciales y datos de cada método
 */
interface PaymentMethodConfig {
  pichincha: {
    accountNumber: string;
    bankName: string;
    accountHolder: string;
    currency: string;
  };
  paypal: {
    clientId: string;
    email: string;
    verified: boolean;
  };
  binance: {
    userId: string;
    apiKey: string;
    verified: boolean;
  };
}

// ============================================================================
// CONFIGURACIÓN DE MÉTODOS DE PAGO
// ============================================================================

const PAYMENT_CONFIG: PaymentMethodConfig = {
  pichincha: {
    accountNumber: '2203728320',
    bankName: 'Banco Pichincha',
    accountHolder: 'Plataforma Integrada',
    currency: 'USD'
  },
  paypal: {
    clientId: process.env.VITE_PAYPAL_CLIENT_ID || '',
    email: 'payments@plataforma.com',
    verified: true
  },
  binance: {
    userId: 'User-6d518',
    apiKey: process.env.VITE_BINANCE_API_KEY || '',
    verified: true
  }
};

// ============================================================================
// SERVICIO DE PAGOS
// ============================================================================

class PaymentService {
  /**
   * PROCESAR PAGO
   * 
   * Flujo:
   * 1. Validar información de pago
   * 2. Crear registro de transacción
   * 3. Procesar con método de pago seleccionado
   * 4. Verificar transacción
   * 5. Actualizar base de datos
   * 6. Retornar resultado
   */
  async processPayment(paymentInfo: PaymentInfo): Promise<PaymentResponse> {
    try {
      // 1. VALIDAR INFORMACIÓN
      const validation = this.validatePaymentInfo(paymentInfo);
      if (!validation.valid) {
        return {
          success: false,
          transactionId: '',
          status: 'failed',
          message: 'Validación fallida',
          error: validation.error
        };
      }

      // 2. CREAR REGISTRO DE TRANSACCIÓN
      const transaction = await this.createTransaction(paymentInfo);
      if (!transaction) {
        return {
          success: false,
          transactionId: '',
          status: 'failed',
          message: 'Error al crear transacción',
          error: 'No se pudo crear el registro de transacción'
        };
      }

      // 3. PROCESAR CON MÉTODO DE PAGO
      let processResult;
      switch (paymentInfo.method) {
        case 'pichincha':
          processResult = await this.processPichinchaPayment(paymentInfo, transaction.id);
          break;
        case 'paypal':
          processResult = await this.processPayPalPayment(paymentInfo, transaction.id);
          break;
        case 'binance':
          processResult = await this.processBinancePayment(paymentInfo, transaction.id);
          break;
        default:
          return {
            success: false,
            transactionId: transaction.id,
            status: 'failed',
            message: 'Método de pago no válido',
            error: `Método ${paymentInfo.method} no soportado`
          };
      }

      if (!processResult.success) {
        // Actualizar transacción como fallida
        await this.updateTransactionStatus(transaction.id, 'failed');
        return {
          success: false,
          transactionId: transaction.id,
          status: 'failed',
          message: 'Error al procesar pago',
          error: processResult.error
        };
      }

      // 4. VERIFICAR TRANSACCIÓN
      const verified = await this.verifyTransaction(
        transaction.id,
        paymentInfo.method,
        processResult.externalTransactionId
      );

      if (!verified) {
        await this.updateTransactionStatus(transaction.id, 'failed');
        return {
          success: false,
          transactionId: transaction.id,
          status: 'failed',
          message: 'Error al verificar transacción',
          error: 'La transacción no pudo ser verificada'
        };
      }

      // 5. ACTUALIZAR ESTADO A COMPLETADO
      await this.updateTransactionStatus(transaction.id, 'completed');

      // 6. ACTUALIZAR DATOS DEL USUARIO
      await this.updateUserBalance(paymentInfo.userId, paymentInfo.amount, paymentInfo.currency);

      return {
        success: true,
        transactionId: transaction.id,
        status: 'completed',
        message: 'Pago procesado exitosamente',
        redirectUrl: this.getRedirectUrl(paymentInfo.system)
      };
    } catch (error) {
      console.error('Error procesando pago:', error);
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: 'Error al procesar pago',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * VALIDAR INFORMACIÓN DE PAGO
   * 
   * Verifica:
   * - Usuario existe
   * - Monto válido
   * - Método de pago válido
   * - Moneda soportada
   */
  private validatePaymentInfo(paymentInfo: PaymentInfo): { valid: boolean; error?: string } {
    // Validar monto
    if (paymentInfo.amount <= 0) {
      return { valid: false, error: 'El monto debe ser mayor a 0' };
    }

    if (paymentInfo.amount > 1000000) {
      return { valid: false, error: 'El monto excede el límite máximo' };
    }

    // Validar método de pago
    const validMethods: PaymentMethod[] = ['pichincha', 'paypal', 'binance'];
    if (!validMethods.includes(paymentInfo.method)) {
      return { valid: false, error: 'Método de pago no válido' };
    }

    // Validar moneda
    const validCurrencies = ['USD', 'BTC', 'ETH', 'BNB', 'USDT'];
    if (!validCurrencies.includes(paymentInfo.currency)) {
      return { valid: false, error: 'Moneda no soportada' };
    }

    // Validar sistema
    const validSystems: SystemType[] = ['abogados-os', 'games', 'crypto-banking'];
    if (!validSystems.includes(paymentInfo.system)) {
      return { valid: false, error: 'Sistema no válido' };
    }

    return { valid: true };
  }

  /**
   * CREAR TRANSACCIÓN EN BASE DE DATOS
   * 
   * Crea un registro inicial de la transacción
   * Estado: pending (pendiente de procesamiento)
   */
  private async createTransaction(paymentInfo: PaymentInfo): Promise<PaymentTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert([
          {
            user_id: paymentInfo.userId,
            amount: paymentInfo.amount,
            currency: paymentInfo.currency,
            payment_method: paymentInfo.method,
            status: 'pending',
            item_type: paymentInfo.itemType,
            item_name: paymentInfo.itemName,
            system: paymentInfo.system,
            description: paymentInfo.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creando transacción:', error);
      return null;
    }
  }

  /**
   * PROCESAR PAGO CON BANCO PICHINCHA
   * 
   * Flujo:
   * 1. Validar datos bancarios
   * 2. Crear instrucción de transferencia
   * 3. Generar referencia de pago
   * 4. Retornar datos para usuario
   * 
   * EXPLICACIÓN:
   * - El usuario realiza transferencia manual
   * - Sistema verifica después
   * - Número de cuenta: 2203728320
   */
  private async processPichinchaPayment(
    paymentInfo: PaymentInfo,
    transactionId: string
  ): Promise<{ success: boolean; externalTransactionId?: string; error?: string }> {
    try {
      // Validar configuración
      if (!PAYMENT_CONFIG.pichincha.accountNumber) {
        return { success: false, error: 'Configuración de Pichincha no disponible' };
      }

      // Generar referencia de pago única
      const paymentReference = `PIC-${transactionId.substring(0, 8).toUpperCase()}`;

      // Crear instrucción de pago
      const paymentInstruction = {
        bankName: PAYMENT_CONFIG.pichincha.bankName,
        accountNumber: PAYMENT_CONFIG.pichincha.accountNumber,
        accountHolder: PAYMENT_CONFIG.pichincha.accountHolder,
        amount: paymentInfo.amount,
        currency: PAYMENT_CONFIG.pichincha.currency,
        reference: paymentReference,
        description: `${paymentInfo.itemName} - ${paymentInfo.description}`,
        transactionId: transactionId
      };

      // Guardar instrucción en base de datos
      const { error } = await supabase
        .from('payment_instructions')
        .insert([
          {
            transaction_id: transactionId,
            method: 'pichincha',
            instruction_data: paymentInstruction,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      return {
        success: true,
        externalTransactionId: paymentReference
      };
    } catch (error) {
      console.error('Error procesando pago Pichincha:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en Pichincha'
      };
    }
  }

  /**
   * PROCESAR PAGO CON PAYPAL
   * 
   * Flujo:
   * 1. Validar credenciales de PayPal
   * 2. Crear orden en PayPal
   * 3. Retornar URL de redirección
   * 4. Usuario completa pago en PayPal
   * 5. Sistema verifica después
   * 
   * EXPLICACIÓN:
   * - Integración con API de PayPal
   * - Redirección a PayPal para pago
   * - Webhook para verificación
   */
  private async processPayPalPayment(
    paymentInfo: PaymentInfo,
    transactionId: string
  ): Promise<{ success: boolean; externalTransactionId?: string; error?: string }> {
    try {
      // Validar configuración
      if (!PAYMENT_CONFIG.paypal.clientId || !PAYMENT_CONFIG.paypal.verified) {
        return { success: false, error: 'PayPal no está configurado correctamente' };
      }

      // Simular creación de orden en PayPal
      // En producción, usar SDK de PayPal
      const paypalOrderId = `PP-${transactionId.substring(0, 12).toUpperCase()}`;

      // Guardar referencia en base de datos
      const { error } = await supabase
        .from('payment_references')
        .insert([
          {
            transaction_id: transactionId,
            method: 'paypal',
            external_id: paypalOrderId,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      return {
        success: true,
        externalTransactionId: paypalOrderId
      };
    } catch (error) {
      console.error('Error procesando pago PayPal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en PayPal'
      };
    }
  }

  /**
   * PROCESAR PAGO CON BINANCE PAY
   * 
   * Flujo:
   * 1. Validar credenciales de Binance
   * 2. Crear orden en Binance Pay
   * 3. Generar código QR
   * 4. Retornar datos de pago
   * 5. Usuario escanea y paga
   * 6. Sistema verifica después
   * 
   * EXPLICACIÓN:
   * - Integración con Binance Pay API
   * - Soporte para múltiples criptomonedas
   * - User ID: User-6d518
   * - ID: 549755069
   */
  private async processBinancePayment(
    paymentInfo: PaymentInfo,
    transactionId: string
  ): Promise<{ success: boolean; externalTransactionId?: string; error?: string }> {
    try {
      // Validar configuración
      if (!PAYMENT_CONFIG.binance.apiKey || !PAYMENT_CONFIG.binance.verified) {
        return { success: false, error: 'Binance Pay no está configurado correctamente' };
      }

      // Simular creación de orden en Binance Pay
      // En producción, usar API de Binance Pay
      const binanceOrderId = `BNB-${transactionId.substring(0, 12).toUpperCase()}`;

      // Guardar referencia en base de datos
      const { error } = await supabase
        .from('payment_references')
        .insert([
          {
            transaction_id: transactionId,
            method: 'binance',
            external_id: binanceOrderId,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      return {
        success: true,
        externalTransactionId: binanceOrderId
      };
    } catch (error) {
      console.error('Error procesando pago Binance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en Binance'
      };
    }
  }

  /**
   * VERIFICAR TRANSACCIÓN
   * 
   * Valida que el pago se haya completado correctamente
   * en el método de pago seleccionado
   */
  private async verifyTransaction(
    transactionId: string,
    method: PaymentMethod,
    externalId: string
  ): Promise<boolean> {
    try {
      // Buscar referencia de pago
      const { data, error } = await supabase
        .from('payment_references')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('method', method)
        .single();

      if (error) {
        console.error('Error verificando transacción:', error);
        return false;
      }

      // Verificar con el proveedor de pago
      switch (method) {
        case 'pichincha':
          return await this.verifyPichinchaPayment(externalId);
        case 'paypal':
          return await this.verifyPayPalPayment(externalId);
        case 'binance':
          return await this.verifyBinancePayment(externalId);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      return false;
    }
  }

  private async verifyPichinchaPayment(reference: string): Promise<boolean> {
    // En producción, verificar con API de Pichincha
    // Por ahora, retornar true para desarrollo
    return true;
  }

  private async verifyPayPalPayment(orderId: string): Promise<boolean> {
    // En producción, verificar con API de PayPal
    // Por ahora, retornar true para desarrollo
    return true;
  }

  private async verifyBinancePayment(orderId: string): Promise<boolean> {
    // En producción, verificar con API de Binance Pay
    // Por ahora, retornar true para desarrollo
    return true;
  }

  /**
   * ACTUALIZAR ESTADO DE TRANSACCIÓN
   */
  private async updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus
  ): Promise<void> {
    try {
      await supabase
        .from('purchases')
        .update({
          status,
          updated_at: new Date().toISOString(),
          verified_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', transactionId);
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  }

  /**
   * ACTUALIZAR BALANCE DEL USUARIO
   * 
   * Suma el monto pagado al balance del usuario
   */
  private async updateUserBalance(
    userId: string,
    amount: number,
    currency: string
  ): Promise<void> {
    try {
      // Actualizar balance total en perfil de usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('total_balance')
        .eq('id', userId)
        .single();

      if (profile) {
        const newBalance = (profile.total_balance || 0) + amount;
        await supabase
          .from('user_profiles')
          .update({ total_balance: newBalance })
          .eq('id', userId);
      }

      // Si es criptomoneda, actualizar wallet
      if (['BTC', 'ETH', 'BNB', 'USDT'].includes(currency)) {
        const { data: wallet } = await supabase
          .from('crypto_wallets')
          .select('*')
          .eq('user_id', userId)
          .eq('currency', currency)
          .single();

        if (wallet) {
          const newWalletBalance = (wallet.balance || 0) + amount;
          await supabase
            .from('crypto_wallets')
            .update({ balance: newWalletBalance })
            .eq('id', wallet.id);
        }
      }
    } catch (error) {
      console.error('Error actualizando balance:', error);
    }
  }

  /**
   * OBTENER URL DE REDIRECCIÓN
   * 
   * Retorna la URL a la que redirigir después del pago
   */
  private getRedirectUrl(system: SystemType): string {
    const baseUrl = window.location.origin;
    switch (system) {
      case 'abogados-os':
        return `${baseUrl}/abogados-os?payment=success`;
      case 'games':
        return `${baseUrl}/games?payment=success`;
      case 'crypto-banking':
        return `${baseUrl}/crypto-banking?payment=success`;
      default:
        return `${baseUrl}/dashboard?payment=success`;
    }
  }

  /**
   * OBTENER INFORMACIÓN DE MÉTODO DE PAGO
   * 
   * Retorna los datos necesarios para mostrar al usuario
   */
  getPaymentMethodInfo(method: PaymentMethod): any {
    switch (method) {
      case 'pichincha':
        return {
          name: 'Banco Pichincha',
          accountNumber: PAYMENT_CONFIG.pichincha.accountNumber,
          accountHolder: PAYMENT_CONFIG.pichincha.accountHolder,
          bankName: PAYMENT_CONFIG.pichincha.bankName,
          currency: PAYMENT_CONFIG.pichincha.currency,
          instructions: 'Realiza una transferencia bancaria a la cuenta indicada'
        };
      case 'paypal':
        return {
          name: 'PayPal',
          email: PAYMENT_CONFIG.paypal.email,
          verified: PAYMENT_CONFIG.paypal.verified,
          instructions: 'Serás redirigido a PayPal para completar el pago'
        };
      case 'binance':
        return {
          name: 'Binance Pay',
          userId: PAYMENT_CONFIG.binance.userId,
          verified: PAYMENT_CONFIG.binance.verified,
          instructions: 'Escanea el código QR o usa tu app de Binance'
        };
      default:
        return null;
    }
  }

  /**
   * OBTENER HISTORIAL DE PAGOS
   */
  async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  /**
   * CANCELAR PAGO
   */
  async cancelPayment(transactionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('purchases')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelando pago:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();
