/**
 * Configuración de Pasarelas de Pago
 * Stripe, PayPal y otras integraciones
 */

export const paymentConfig = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
    currency: 'usd',
    locale: 'es',
  },

  // PayPal Configuration
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
    mode: import.meta.env.VITE_PAYPAL_MODE || 'sandbox', // 'sandbox' | 'live'
    currency: 'USD',
  },

  // Transferencia Bancaria
  bankTransfer: {
    enabled: true,
    bankName: 'Banco Pichincha',
    accountNumber: '220XXXXXXX',
    accountHolder: 'Wilson A. Ipiales',
    accountType: 'Corriente',
    requiresProof: true,
  },

  // Configuración general
  general: {
    taxRate: 0.12, // 12% IVA
    enableCredits: true,
    creditValue: 0.01, // 1 crédito = $0.01
    minPurchaseAmount: 1.00,
    maxPurchaseAmount: 10000.00,
  }
};

// Tipos para TypeScript
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  payment_method: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'transfer';
  last4?: string;
  brand?: string;
}

// Stripe helper functions
export const stripeHelpers = {
  formatAmount: (amount: number): number => {
    // Stripe usa centavos
    return Math.round(amount * 100);
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

// PayPal helper functions
export const paypalHelpers = {
  createOrder: (amount: number, description: string) => ({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toFixed(2)
      },
      description
    }]
  }),

  formatAmount: (amount: number): string => {
    return amount.toFixed(2);
  }
};

export default paymentConfig;
