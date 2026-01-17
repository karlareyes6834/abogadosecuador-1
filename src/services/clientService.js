/**
 * clientService.js - Servicios para el dashboard del cliente
 * Acceso a cursos, productos comprados, suscripciones
 */

import { supabase } from './supabaseService';

// ===============================================
// CURSOS DEL USUARIO
// ===============================================
export const userCoursesService = {
  // Obtener cursos inscritos del usuario
  getEnrolled: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(
            *,
            modules:course_modules(
              *,
              lessons:course_lessons(*)
            )
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener cursos inscritos:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener progreso de un curso específico
  getCourseProgress: async (userId, courseId) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener progreso del curso:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar progreso de lección
  updateProgress: async (userId, courseId, progressData) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .update(progressData)
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Marcar lección como completada
  completeLesson: async (userId, courseId, lessonId) => {
    try {
      // Obtener enrollment actual
      const { data: enrollment, error: fetchError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
      
      if (fetchError) throw fetchError;

      // Agregar lección a completadas
      const completedLessons = enrollment.completed_lessons || [];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Calcular progreso
      const { data: totalLessons } = await supabase
        .from('course_lessons')
        .select('id', { count: 'exact' })
        .eq('course_id', courseId);

      const progress = Math.round((completedLessons.length / (totalLessons?.length || 1)) * 100);

      // Actualizar enrollment
      const { data, error } = await supabase
        .from('course_enrollments')
        .update({
          completed_lessons: completedLessons,
          progress,
          current_lesson_id: lessonId,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al completar lección:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// PRODUCTOS DEL USUARIO
// ===============================================
export const userProductsService = {
  // Obtener productos comprados
  getPurchased: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select(`
          *,
          product:products!inner(*)
        `)
        .eq('user_id', userId)
        .eq('access_granted', true)
        .order('purchased_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener productos comprados:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Registrar acceso/descarga de producto
  recordAccess: async (userId, productId) => {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .update({
          last_accessed_at: new Date().toISOString(),
          download_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al registrar acceso:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// HISTORIAL DE COMPRAS
// ===============================================
export const purchaseHistoryService = {
  // Obtener historial de compras
  getHistory: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener historial de compras:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener órdenes del usuario
  getOrders: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return { success: false, data: [], error: error.message };
    }
  }
};

// ===============================================
// CITAS DEL USUARIO
// ===============================================
export const userAppointmentsService = {
  // Obtener citas del usuario
  getAll: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Crear cita
  create: async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al crear cita:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Cancelar cita
  cancel: async (appointmentId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// CONSULTAS DEL USUARIO
// ===============================================
export const userConsultationsService = {
  // Obtener consultas del usuario
  getAll: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Crear consulta
  create: async (consultationData) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([consultationData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al crear consulta:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// SUSCRIPCIÓN DEL USUARIO
// ===============================================
export const userSubscriptionService = {
  // Obtener suscripción activa
  getCurrent: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignorar si no hay suscripción
      return { success: true, data: data || null, error: null };
    } catch (error) {
      console.error('Error al obtener suscripción:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Cancelar suscripción
  cancel: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// PERFIL DEL USUARIO
// ===============================================
export const userProfileService = {
  // Obtener perfil
  get: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar perfil
  update: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

export default {
  courses: userCoursesService,
  products: userProductsService,
  purchases: purchaseHistoryService,
  appointments: userAppointmentsService,
  consultations: userConsultationsService,
  subscription: userSubscriptionService,
  profile: userProfileService
};
