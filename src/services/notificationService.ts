/**
 * Servicio de Notificaciones
 * Gestiona notificaciones en tiempo real para usuarios
 */

import { supabase } from '../config/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

const notificationService = {
  /**
   * Obtener notificaciones del usuario
   */
  async getUserNotifications(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return { data: [], error };
    }
  },

  /**
   * Obtener notificaciones no leídas
   */
  async getUnreadNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, count: data?.length || 0, error: null };
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      return { data: [], count: 0, error };
    }
  },

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al marcar notificación:', error);
      return { success: false, error };
    }
  },

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      return { success: false, error };
    }
  },

  /**
   * Crear notificación
   */
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error al crear notificación:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      return { success: false, error };
    }
  },

  /**
   * Suscribirse a notificaciones en tiempo real
   */
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Tipos de notificaciones predefinidos
   */
  notificationTypes: {
    ORDER_COMPLETED: {
      type: 'order_completed',
      getTitle: () => 'Compra Exitosa',
      getMessage: (orderNumber: string) => `Tu orden #${orderNumber} ha sido procesada correctamente.`
    },
    COURSE_PURCHASED: {
      type: 'course_purchased',
      getTitle: () => 'Curso Adquirido',
      getMessage: (courseName: string) => `¡Felicitaciones! Ahora tienes acceso a: ${courseName}`
    },
    CERTIFICATE_ISSUED: {
      type: 'certificate_issued',
      getTitle: () => '¡Certificado Disponible!',
      getMessage: (courseName: string) => `Has completado "${courseName}". Tu certificado está listo para descargar.`
    },
    SERVICE_PURCHASED: {
      type: 'service_purchased',
      getTitle: () => 'Servicio Adquirido',
      getMessage: (serviceName: string) => `Has adquirido: ${serviceName}. Por favor agenda tu cita.`
    },
    APPOINTMENT_SCHEDULED: {
      type: 'appointment_scheduled',
      getTitle: () => 'Cita Agendada',
      getMessage: (date: string) => `Tu cita ha sido confirmada para el ${date}.`
    },
    APPOINTMENT_REMINDER: {
      type: 'appointment_reminder',
      getTitle: () => 'Recordatorio de Cita',
      getMessage: (date: string) => `Tienes una cita programada para el ${date}.`
    },
    LESSON_COMPLETED: {
      type: 'lesson_completed',
      getTitle: () => 'Lección Completada',
      getMessage: (lessonName: string) => `¡Excelente! Has completado: ${lessonName}`
    },
    NEWSLETTER_WELCOME: {
      type: 'newsletter_welcome',
      getTitle: () => 'Bienvenido al Newsletter',
      getMessage: () => 'Gracias por suscribirte. Recibirás contenido exclusivo.'
    }
  }
};

export default notificationService;
