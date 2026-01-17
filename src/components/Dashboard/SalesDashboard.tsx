import React from 'react';
import { TrendingUpIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const SalesDashboard = () => {
  const salesData = {
    totalSales: 45678,
    totalOrders: 234,
    averageOrder: 195,
    growthRate: 12.5
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
          <p className="text-gray-600">Análisis completo de tus ventas y ingresos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">${salesData.totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{salesData.growthRate}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.totalOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
