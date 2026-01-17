// 🌟 SISTEMA COMPLETO DE SERVICIOS PROFESIONALES ABOGADO WILSON 🌟

import { supabase } from '../config/supabase.js';

// ============================================================================
// SERVICIOS LEGALES PRINCIPALES
// ============================================================================

export const legalServices = {
  // Servicios Civiles
  civil: {
    name: 'Derecho Civil',
    description: 'Asesoría legal en contratos, propiedad, sucesiones y responsabilidad civil',
    services: [
      'Contratos y acuerdos comerciales',
      'Derecho de propiedad y posesión',
      'Sucesiones y herencias',
      'Responsabilidad civil y daños',
      'Arrendamientos y desalojos',
      'Derecho de familia y divorcios'
    ],
    icon: '⚖️',
    price: 'Desde $50',
    duration: '1-3 horas'
  },

  // Servicios Penales
  penal: {
    name: 'Derecho Penal',
    description: 'Defensa penal especializada en todo tipo de delitos',
    services: [
      'Defensa en procesos penales',
      'Asesoría en detenciones',
      'Recursos de apelación',
      'Medidas cautelares',
      'Acuerdos reparatorios',
      'Defensa de menores'
    ],
    icon: '🛡️',
    price: 'Desde $80',
    duration: '2-4 horas'
  },

  // Servicios de Tránsito
  transito: {
    name: 'Derecho de Tránsito',
    description: 'Especialistas en infracciones y accidentes de tránsito',
    services: [
      'Infracciones de tránsito',
      'Accidentes automovilísticos',
      'Suspensión de licencias',
      'Recursos administrativos',
      'Responsabilidad civil',
      'Seguros automotores'
    ],
    icon: '🚗',
    price: 'Desde $40',
    duration: '1-2 horas'
  },

  // Servicios Comerciales
  comercial: {
    name: 'Derecho Comercial',
    description: 'Asesoría empresarial y comercial integral',
    services: [
      'Constitución de empresas',
      'Contratos comerciales',
      'Propiedad intelectual',
      'Fusiones y adquisiciones',
      'Derecho laboral empresarial',
      'Compliance y regulaciones'
    ],
    icon: '🏢',
    price: 'Desde $100',
    duration: '2-5 horas'
  },

  // Servicios de Aduanas
  aduanas: {
    name: 'Derecho Aduanero',
    description: 'Especialistas en comercio internacional y aduanas',
    services: [
      'Importaciones y exportaciones',
      'Regímenes aduaneros',
      'Tributación internacional',
      'Contenciosos aduaneros',
      'Certificados de origen',
      'Tratados comerciales'
    ],
    icon: '🌐',
    price: 'Desde $120',
    duration: '2-4 horas'
  }
};

// ============================================================================
// SISTEMA DE CONSULTAS INTELIGENTES
// ============================================================================

export const consultationSystem = {
  // Tipos de consulta
  types: {
    initial: {
      name: 'Consulta Inicial',
      description: 'Primera evaluación de tu caso legal',
      duration: '30 minutos',
      price: '$25',
      includes: [
        'Análisis inicial del caso',
        'Evaluación de opciones legales',
        'Recomendaciones básicas',
        'Plan de acción sugerido'
      ]
    },
    detailed: {
      name: 'Consulta Detallada',
      description: 'Análisis completo y estrategia legal',
      duration: '1 hora',
      price: '$50',
      includes: [
        'Análisis completo del caso',
        'Estrategia legal detallada',
        'Documentos necesarios',
        'Timeline del proceso',
        'Estimación de costos'
      ]
    },
    followup: {
      name: 'Seguimiento',
      description: 'Actualización y ajustes del caso',
      duration: '30 minutos',
      price: '$30',
      includes: [
        'Revisión de avances',
        'Ajustes de estrategia',
        'Nuevas recomendaciones',
        'Próximos pasos'
      ]
    }
  },

  // Proceso de consulta
  process: {
    step1: 'Reserva tu cita online',
    step2: 'Completa el formulario previo',
    step3: 'Consulta virtual o presencial',
    step4: 'Recibe tu plan de acción',
    step5: 'Seguimiento y apoyo continuo'
  }
};

// ============================================================================
// SISTEMA DE AGENDAMIENTO PROFESIONAL
// ============================================================================

export const appointmentSystem = {
  // Horarios disponibles
  schedule: {
    monday: { start: '09:00', end: '18:00', available: true },
    tuesday: { start: '09:00', end: '18:00', available: true },
    wednesday: { start: '09:00', end: '18:00', available: true },
    thursday: { start: '09:00', end: '18:00', available: true },
    friday: { start: '09:00', end: '18:00', available: true },
    saturday: { start: '09:00', end: '14:00', available: true },
    sunday: { start: '00:00', end: '00:00', available: false }
  },

  // Tipos de cita
  appointmentTypes: {
    virtual: {
      name: 'Consulta Virtual',
      description: 'Videollamada desde cualquier lugar',
      platforms: ['Zoom', 'Google Meet', 'WhatsApp Video'],
      preparation: 'Documentos digitales listos',
      duration: '30-60 minutos'
    },
    presencial: {
      name: 'Consulta Presencial',
      description: 'En nuestras oficinas profesionales',
      location: 'Oficina Principal - Ipiales',
      preparation: 'Documentos físicos y copias',
      duration: '30-60 minutos'
    },
    domicilio: {
      name: 'Consulta a Domicilio',
      description: 'Nos trasladamos a tu ubicación',
      coverage: 'Zona metropolitana de Ipiales',
      additionalCost: '+$20',
      duration: '30-60 minutos'
    }
  }
};

// ============================================================================
// SISTEMA DE CURSOS Y CAPACITACIÓN
// ============================================================================

export const courseSystem = {
  // Categorías de cursos
  categories: {
    legalBasics: {
      name: 'Fundamentos Legales',
      description: 'Conocimientos básicos del derecho para ciudadanos',
      courses: [
        'Derechos y deberes ciudadanos',
        'Contratos básicos',
        'Procedimientos administrativos',
        'Recursos legales disponibles'
      ]
    },
    businessLaw: {
      name: 'Derecho Empresarial',
      description: 'Formación legal para emprendedores y empresarios',
      courses: [
        'Constitución de empresas',
        'Contratos comerciales',
        'Propiedad intelectual',
        'Compliance empresarial'
      ]
    },
    familyLaw: {
      name: 'Derecho de Familia',
      description: 'Aspectos legales de la vida familiar',
      courses: [
        'Matrimonio y divorcio',
        'Custodia y visitas',
        'Sucesiones y herencias',
        'Protección de menores'
      ]
    }
  },

  // Formato de cursos
  formats: {
    online: {
      name: 'Online',
      description: 'Aprendizaje a tu ritmo',
      features: ['Videos HD', 'Material descargable', 'Certificado digital', 'Acceso ilimitado'],
      price: 'Desde $29'
    },
    hybrid: {
      name: 'Híbrido',
      description: 'Combinación online y presencial',
      features: ['Contenido online', 'Sesiones presenciales', 'Práctica real', 'Certificado físico'],
      price: 'Desde $79'
    },
    inperson: {
      name: 'Presencial',
      description: 'Formación tradicional',
      features: ['Clases presenciales', 'Material físico', 'Práctica directa', 'Certificado oficial'],
      price: 'Desde $99'
    }
  }
};

// ============================================================================
// FUNCIONES DE SERVICIO
// ============================================================================

// Obtener todos los servicios legales
export const getAllLegalServices = () => {
  return Object.entries(legalServices).map(([key, service]) => ({
    id: key,
    ...service
  }));
};

// Obtener servicio por ID
export const getLegalServiceById = (serviceId) => {
  return legalServices[serviceId] || null;
};

// Obtener tipos de consulta
export const getConsultationTypes = () => {
  return consultationSystem.types;
};

// Obtener horarios disponibles
export const getAvailableSchedule = () => {
  return appointmentSystem.schedule;
};

// Obtener tipos de cita
export const getAppointmentTypes = () => {
  return appointmentSystem.appointmentTypes;
};

// Obtener sistema de cursos
export const getCourseSystem = () => {
  return courseSystem;
};

// ============================================================================
// FUNCIONES DE BASE DE DATOS
// ============================================================================

// Crear nueva consulta
export const createConsultation = async (consultationData) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .insert([consultationData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener consultas del usuario
export const getUserConsultations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener citas del usuario
export const getUserAppointments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

// Calcular precio de consulta
export const calculateConsultationPrice = (type, duration, isUrgent = false) => {
  const basePrice = consultationSystem.types[type]?.price || '$25';
  const price = parseInt(basePrice.replace('$', ''));
  const multiplier = isUrgent ? 1.5 : 1;
  return `$${Math.round(price * multiplier)}`;
};

// Verificar disponibilidad de horario
export const checkAvailability = (date, time) => {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
  const schedule = appointmentSystem.schedule[dayOfWeek];
  
  if (!schedule?.available) return false;
  
  const requestedTime = new Date(`2000-01-01 ${time}`);
  const startTime = new Date(`2000-01-01 ${schedule.start}`);
  const endTime = new Date(`2000-01-01 ${schedule.end}`);
  
  return requestedTime >= startTime && requestedTime <= endTime;
};

// Generar resumen de servicios
export const generateServiceSummary = () => {
  const services = getAllLegalServices();
  const totalServices = services.length;
  const totalCategories = Object.keys(courseSystem.categories).length;
  
  return {
    totalServices,
    totalCategories,
    services: services.map(s => s.name),
    categories: Object.keys(courseSystem.categories).map(key => courseSystem.categories[key].name)
  };
};

export default {
  legalServices,
  consultationSystem,
  appointmentSystem,
  courseSystem,
  getAllLegalServices,
  getLegalServiceById,
  getConsultationTypes,
  getAvailableSchedule,
  getAppointmentTypes,
  getCourseSystem,
  createConsultation,
  createAppointment,
  getUserConsultations,
  getUserAppointments,
  calculateConsultationPrice,
  checkAvailability,
  generateServiceSummary
};
