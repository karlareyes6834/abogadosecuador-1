/**
 * adminService.js - Servicios completos para el admin dashboard
 * Integrado con Supabase para operaciones CRUD reales
 */

import { supabase, dataService } from './supabaseService';

// ===============================================
// GESTIÓN DE PRODUCTOS
// ===============================================
export const productService = {
  // Obtener todos los productos
  getAll: async (filters = {}) => {
    try {
      let query = supabase.from('products').select('*');
      
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.featured !== undefined) query = query.eq('featured', filters.featured);
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Crear producto
  create: async (productData) => {
    try {
      // Generar slug si no existe
      if (!productData.slug) {
        productData.slug = productData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar producto
  update: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { success: false, error: error.message };
    }
  }
};

// ===============================================
// GESTIÓN DE CURSOS
// ===============================================
export const courseService = {
  // Obtener todos los cursos con sus módulos y lecciones
  getAll: async (filters = {}) => {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          modules:course_modules(
            *,
            lessons:course_lessons(*)
          )
        `);
      
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.category) query = query.eq('category', filters.category);
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener curso por ID con todo el contenido
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules:course_modules(
            *,
            lessons:course_lessons(*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener curso:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Crear curso
  create: async (courseData) => {
    try {
      // Generar slug si no existe
      if (!courseData.slug) {
        courseData.slug = courseData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al crear curso:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar curso
  update: async (id, courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Eliminar curso
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      return { success: false, error: error.message };
    }
  },

  // Agregar módulo a curso
  addModule: async (courseId, moduleData) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert([{ ...moduleData, course_id: courseId }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al agregar módulo:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Agregar lección a módulo
  addLesson: async (moduleId, courseId, lessonData) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([{ ...lessonData, module_id: moduleId, course_id: courseId }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al agregar lección:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar módulo
  updateModule: async (moduleId, moduleData) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .update(moduleData)
        .eq('id', moduleId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar módulo:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar lección
  updateLesson: async (lessonId, lessonData) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .update(lessonData)
        .eq('id', lessonId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar lección:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Eliminar módulo
  deleteModule: async (moduleId) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar módulo:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar lección
  deleteLesson: async (lessonId) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar lección:', error);
      return { success: false, error: error.message };
    }
  }
};

// ===============================================
// GESTIÓN DE BLOG
// ===============================================
export const blogService = {
  // Obtener todas las entradas
  getAll: async (filters = {}) => {
    try {
      let query = supabase.from('blog_posts').select('*');
      
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.category) query = query.eq('category', filters.category);
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener entradas de blog:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener entrada por ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener entrada:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Crear entrada
  create: async (postData) => {
    try {
      // Generar slug si no existe
      if (!postData.slug) {
        postData.slug = postData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al crear entrada:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Actualizar entrada
  update: async (id, postData) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar entrada:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Eliminar entrada
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      return { success: false, error: error.message };
    }
  }
};

// ===============================================
// GESTIÓN DE USUARIOS
// ===============================================
export const userService = {
  // Obtener todos los usuarios
  getAll: async (filters = {}) => {
    try {
      let query = supabase.from('profiles').select('*');
      
      if (filters.role) query = query.eq('role', filters.role);
      if (filters.status) query = query.eq('status', filters.status);
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// GESTIÓN DE ÓRDENES Y VENTAS
// ===============================================
export const salesService = {
  // Obtener todas las órdenes
  getAll: async (filters = {}) => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user:profiles(full_name, email)
        `);
      
      if (filters.status) query = query.eq('status', filters.status);
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Obtener estadísticas de ventas
  getStats: async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('amount, status, created_at');
      
      if (error) throw error;

      const stats = {
        totalRevenue: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0),
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length
      };
      
      return { success: true, data: stats, error: null };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// GESTIÓN DE CITAS
// ===============================================
export const appointmentService = {
  // Obtener todas las citas
  getAll: async (filters = {}) => {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          user:profiles(full_name, email, phone)
        `);
      
      if (filters.status) query = query.eq('status', filters.status);
      
      query = query.order('start_time', { ascending: true });
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Actualizar cita
  update: async (id, appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

// ===============================================
// DASHBOARD STATS
// ===============================================
export const dashboardService = {
  // Obtener estadísticas generales del dashboard
  getStats: async () => {
    try {
      // Obtener usuarios totales
      const { data: users } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      // Obtener órdenes y calcular ingresos
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status');

      // Obtener productos totales
      const { data: products } = await supabase
        .from('products')
        .select('id', { count: 'exact' });

      // Obtener cursos totales
      const { data: courses } = await supabase
        .from('courses')
        .select('id, enrollment_count');

      // Obtener citas
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, status', { count: 'exact' });

      const totalRevenue = orders
        ?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0) || 0;

      const stats = {
        totalUsers: users?.length || 0,
        totalRevenue: totalRevenue.toFixed(2),
        totalProducts: products?.length || 0,
        totalCourses: courses?.length || 0,
        totalEnrollments: courses?.reduce((sum, c) => sum + (c.enrollment_count || 0), 0) || 0,
        totalAppointments: appointments?.length || 0,
        totalOrders: orders?.length || 0,
        completedOrders: orders?.filter(o => o.status === 'completed').length || 0
      };

      return { success: true, data: stats, error: null };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

export default {
  products: productService,
  courses: courseService,
  blog: blogService,
  users: userService,
  sales: salesService,
  appointments: appointmentService,
  dashboard: dashboardService
};
