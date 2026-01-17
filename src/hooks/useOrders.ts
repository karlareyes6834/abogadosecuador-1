/**
 * Hook personalizado para gestión de órdenes
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ordersService from '../services/ordersService';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const loadOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await ordersService.getUserOrders(user.id);
      
      if (fetchError) {
        setError(fetchError);
        return;
      }

      setOrders(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      const { data, error } = await ordersService.getOrderDetails(orderId);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const createOrder = async (paymentMethod: string, paymentId?: string) => {
    if (!user?.id) throw new Error('Usuario no autenticado');

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await ordersService.createOrderFromCart(
        user.id,
        paymentMethod,
        paymentId
      );

      if (error) {
        setError(error);
        return { success: false, error };
      }

      // Recargar órdenes
      await loadOrders();

      return { success: true, data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  return {
    orders,
    loading,
    error,
    loadOrders,
    getOrderById,
    createOrder
  };
};

export default useOrders;
