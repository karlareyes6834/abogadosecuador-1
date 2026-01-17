import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { ShoppingCartIcon, PlusIcon, TrashIcon } from '../components/icons/InterfaceIcons';
import { Order, OrderStatus } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const ORDERS_KEY = 'nexuspro_orders';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  shipped: { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
};


const SalesPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    
    const loadOrders = () => {
        const storedOrders = localStorage.getItem(ORDERS_KEY);
        setOrders(storedOrders ? JSON.parse(storedOrders) : []);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    };
    
    const totalRevenue = orders.reduce((sum, order) => order.status !== 'cancelled' ? sum + order.total : sum, 0);
    const totalOrders = orders.length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><ShoppingCartIcon className="h-8 w-8 mr-3"/> Ventas</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Gestiona tus pedidos, clientes y rendimiento de ventas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-sm text-[var(--muted-foreground)]">Ingresos Totales</h3><p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p></Card>
                <Card><h3 className="text-sm text-[var(--muted-foreground)]">Pedidos Totales</h3><p className="text-2xl font-bold">{totalOrders}</p></Card>
                <Card><h3 className="text-sm text-[var(--muted-foreground)]">Ticket Promedio</h3><p className="text-2xl font-bold">${totalOrders > 0 ? (totalRevenue/totalOrders).toFixed(2) : '0.00'}</p></Card>
                <Card><h3 className="text-sm text-[var(--muted-foreground)]">Pedidos Pendientes</h3><p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p></Card>
            </div>
            
            <Card className="!p-0">
                <h3 className="font-semibold p-4">Historial de Pedidos</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Pedido ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-[var(--background)]">
                                    <td className="px-6 py-4 font-mono text-sm">{order.id.split('_')[1]}</td>
                                    <td className="px-6 py-4">{order.customerName}</td>
                                    <td className="px-6 py-4 text-[var(--muted-foreground)]">{format(new Date(order.orderDate), 'd MMM yyyy, HH:mm', { locale: es })}</td>
                                    <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                            className={`w-full text-xs font-semibold rounded-full border-none focus:ring-0 capitalize ${statusConfig[order.status].color}`}
                                        >
                                            {Object.entries(statusConfig).map(([statusKey, statusInfo]) => (
                                                <option key={statusKey} value={statusKey}>{statusInfo.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default SalesPage;