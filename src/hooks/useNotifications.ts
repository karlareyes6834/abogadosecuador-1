/**
 * Hook personalizado para notificaciones en tiempo real
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import notificationService, { Notification } from '../services/notificationService';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data } = await notificationService.getUserNotifications(user.id);
      setNotifications(data || []);

      const { count } = await notificationService.getUnreadNotifications(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    await notificationService.markAllAsRead(user.id);
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId);
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  useEffect(() => {
    if (user?.id) {
      loadNotifications();

      // Suscribirse a notificaciones en tiempo real
      const unsubscribe = notificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev]);
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      );

      return unsubscribe;
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  };
};

export default useNotifications;
