import React from 'react';
import PayPalButton from './PayPalButton';

const CheckoutForm = ({ serviceName, amount }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Pagar por {serviceName}</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Método de Pago - Solo PayPal</h2>

        <div className="mb-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-600">
            <div className="flex items-center">
              <svg className="h-12 w-12 text-blue-600 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.773.773 0 0 1 .762-.64h8.789c2.769 0 4.626 1.273 5.058 3.477.356 1.82-.063 3.24-.987 4.368-1.054 1.287-2.695 1.943-4.879 1.943H10.17l-.81 5.128a.642.642 0 0 1-.633.641H7.076zm8.41-12.957c-.906 0-1.518.068-1.862.204-.344.136-.576.34-.69.61a1.01 1.01 0 0 0-.04.54l.394 2.508h1.36c.906 0 1.57-.204 1.973-.609.404-.406.606-.997.606-1.774 0-.777-.242-1.478-.93-1.478z"/>
              </svg>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">PayPal</h3>
                <p className="text-sm text-gray-600 mt-1">Paga de forma segura con tarjeta de crédito o débito</p>
                <p className="text-xs text-green-600 font-semibold mt-2">✓ Acceso inmediato después del pago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <PayPalButton amount={amount} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
