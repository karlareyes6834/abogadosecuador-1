import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaShoppingCart, FaCheckCircle, FaClock, FaTimesCircle, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const SalesManager = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    
    // Cargar órdenes
    const filters = filter !== 'all' ? { status: filter } : {};
    const ordersResult = await adminService.sales.getAll(filters);
    if (ordersResult.success) {
      setOrders(ordersResult.data);
    }

    // Cargar estadísticas
    const statsResult = await adminService.sales.getStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Usuario', 'Monto', 'Estado', 'Método de Pago', 'Fecha'];
    const rows = orders.map(order => [
      order.id,
      order.user?.full_name || order.user?.email || 'N/A',
      order.amount,
      order.status,
      order.payment_method,
      new Date(order.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Reporte exportado correctamente');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Ventas</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FaDownload /> Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <FaDollarSign className="text-3xl mb-2" />
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
            <p className="text-green-100">Ingresos Totales</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <FaShoppingCart className="text-3xl mb-2" />
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-blue-100">Órdenes Totales</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <FaCheckCircle className="text-3xl mb-2" />
            <p className="text-2xl font-bold">{stats.completedOrders}</p>
            <p className="text-purple-100">Completadas</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <FaClock className="text-3xl mb-2" />
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            <p className="text-orange-100">Pendientes</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completadas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Fallidas
        </button>
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id.substring(0, 8)}...
                  </div>
                  {order.transaction_id && (
                    <div className="text-xs text-gray-500">
                      TX: {order.transaction_id.substring(0, 8)}...
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.user?.full_name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ${parseFloat(order.amount).toFixed(2)}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-xs text-green-600">
                      Desc: ${parseFloat(order.discount).toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.payment_method}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                  <div className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesManager;
