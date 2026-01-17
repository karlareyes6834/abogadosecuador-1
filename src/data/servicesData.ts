import { LegalService } from '../types';
import { ShieldCheckIcon, UsersIcon, KanbanIcon, CrmIcon, DatabaseIcon, BookOpenIcon, FinancialsIcon } from '../components/icons/InterfaceIcons';

// Datos completos de servicios legales
export const legalServices = [
  {
    id: 'consulta-civil',
    name: 'Consulta Civil',
    description: 'Asesoría legal en derecho civil, contratos, responsabilidad civil y derecho de propiedad.',
    price: 50,
    category: 'Civil',
    duration: '1 hora',
    includes: ['Análisis del caso', 'Asesoría legal personalizada', 'Documento de recomendaciones', 'Seguimiento por 30 días'],
    imageUrl: '/images/services/civil.jpg',
    featured: true,
    slug: 'consulta-civil'
  },
  {
    id: 'consulta-penal',
    name: 'Consulta Penal',
    description: 'Defensa legal en casos penales, asesoría en procesos judiciales y representación legal.',
    price: 80,
    category: 'Penal',
    duration: '1.5 horas',
    includes: ['Análisis del caso penal', 'Estrategia de defensa', 'Revisión de evidencias', 'Representación legal inicial'],
    imageUrl: '/images/services/penal.jpg',
    featured: true,
    slug: 'consulta-penal'
  },
  {
    id: 'consulta-transito',
    name: 'Consulta de Tránsito',
    description: 'Asesoría en infracciones de tránsito, multas, licencias y procesos administrativos.',
    price: 40,
    category: 'Tránsito',
    duration: '45 minutos',
    includes: ['Revisión de la infracción', 'Estrategia de defensa', 'Gestión administrativa', 'Acompañamiento al proceso'],
    imageUrl: '/images/services/transito.jpg',
    featured: false,
    slug: 'consulta-transito'
  },
  {
    id: 'consulta-laboral',
    name: 'Consulta Laboral',
    description: 'Asesoría en derecho laboral, despidos, contratos y conflictos laborales.',
    price: 60,
    category: 'Laboral',
    duration: '1 hora',
    includes: [
      'Análisis del conflicto laboral',
      'Revisión de contratos',
      'Estrategia legal',
      'Representación si es necesario'
    ],
    imageUrl: '/images/services/laboral.jpg',
    featured: false,
    slug: 'consulta-laboral'
  },
  {
    id: 'consulta-comercial',
    name: 'Consulta Comercial',
    description: 'Asesoría en derecho comercial, sociedades, contratos mercantiles y litigios comerciales.',
    price: 70,
    category: 'Comercial',
    duration: '1.5 horas',
    includes: [
      'Análisis comercial del caso',
      'Revisión de contratos',
      'Estrategia legal comercial',
      'Documentación legal'
    ],
    imageUrl: '/images/services/comercial.jpg',
    featured: false,
    slug: 'consulta-comercial'
  },
  {
    id: 'consulta-familia',
    name: 'Consulta de Familia',
    description: 'Asesoría en derecho de familia, divorcios, custodia, alimentos y sucesiones.',
    price: 55,
    category: 'Familia',
    duration: '1 hora',
    includes: [
      'Análisis del caso familiar',
      'Mediación inicial',
      'Documentación legal',
      'Seguimiento del proceso'
    ],
    imageUrl: '/images/services/familia.jpg',
    featured: false,
    slug: 'consulta-familia'
  }
];

// Productos digitales
export const digitalProducts = [
  {
    id: 'ebook-derecho-civil',
    name: 'Guía Completa de Derecho Civil',
    description: 'Manual completo sobre derecho civil ecuatoriano con casos prácticos y ejemplos.',
    price: 25,
    category: 'Ebooks',
    type: 'digital',
    downloadUrl: '/downloads/ebook-derecho-civil.pdf',
    imageUrl: '/images/products/ebook-civil.jpg',
    featured: true
  },
  {
    id: 'ebook-derecho-penal',
    name: 'Manual de Derecho Penal',
    description: 'Guía práctica sobre derecho penal, tipos penales y procedimientos.',
    price: 30,
    category: 'Ebooks',
    type: 'digital',
    downloadUrl: '/downloads/ebook-derecho-penal.pdf',
    imageUrl: '/images/products/ebook-penal.jpg',
    featured: true
  },
  {
    id: 'masterclass-contratos',
    name: 'Masterclass: Contratos Civiles',
    description: 'Curso completo sobre redacción y análisis de contratos civiles.',
    price: 45,
    category: 'Masterclass',
    type: 'digital',
    downloadUrl: '/downloads/masterclass-contratos.zip',
    imageUrl: '/images/products/masterclass-contratos.jpg',
    featured: true
  }
];

// Cursos completos
export const courses = [
  {
    id: 'curso-derecho-civil',
    title: 'Derecho Civil Completo',
    description: 'Curso completo de derecho civil ecuatoriano con casos prácticos.',
    instructor: 'Dr. Wilson Ipiales',
    duration: '8 semanas',
    totalLessons: 24,
    price: 120,
    rating: 4.8,
    students: 45,
    imageUrl: '/images/courses/civil.jpg',
    category: 'Civil',
    level: 'Básico',
    lessons: [
      {
        id: 1,
        title: 'Introducción al Derecho Civil',
        duration: '20:00',
        videoUrl: 'https://example.com/video1.mp4',
        description: 'Conceptos básicos del derecho civil',
        completed: false
      },
      {
        id: 2,
        title: 'Personas y Capacidad',
        duration: '25:30',
        videoUrl: 'https://example.com/video2.mp4',
        description: 'Análisis de la capacidad jurídica',
        completed: false
      }
    ]
  },
  {
    id: 'curso-derecho-penal',
    title: 'Derecho Penal Avanzado',
    description: 'Curso avanzado de derecho penal con análisis de casos reales.',
    instructor: 'Dr. Wilson Ipiales',
    duration: '10 semanas',
    totalLessons: 30,
    price: 150,
    rating: 4.9,
    students: 32,
    imageUrl: '/images/courses/penal.jpg',
    category: 'Penal',
    level: 'Avanzado',
    lessons: [
      {
        id: 1,
        title: 'Teoría del Delito',
        duration: '30:00',
        videoUrl: 'https://example.com/video3.mp4',
        description: 'Análisis de los elementos constitutivos del delito',
        completed: false
      },
      {
        id: 2,
        title: 'Tipos Penales',
        duration: '28:45',
        videoUrl: 'https://example.com/video4.mp4',
        description: 'Clasificación y estudio de los tipos penales',
        completed: false
      }
    ]
  }
];

// Datos de testimonios
export const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Empresaria',
    content: 'Excelente servicio legal. El Dr. Wilson me ayudó a resolver un conflicto comercial de manera eficiente.',
    rating: 5,
    imageUrl: '/images/testimonials/maria.jpg'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    role: 'Profesional',
    content: 'Muy profesional y conocedor del derecho. Recomiendo sus servicios sin duda alguna.',
    rating: 5,
    imageUrl: '/images/testimonials/carlos.jpg'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    role: 'Estudiante',
    content: 'Los cursos son muy completos y prácticos. He aprendido mucho sobre derecho civil.',
    rating: 5,
    imageUrl: '/images/testimonials/ana.jpg'
  }
];

// Datos de blog
export const blogPosts = [
  {
    id: 1,
    title: 'Nuevas Reformas al Código Civil',
    excerpt: 'Análisis de las últimas reformas al código civil ecuatoriano y su impacto en la práctica legal.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Dr. Wilson Ipiales',
    date: '2024-01-15',
    category: 'Derecho Civil',
    imageUrl: '/images/blog/reformas-civil.jpg',
    slug: 'nuevas-reformas-codigo-civil'
  },
  {
    id: 2,
    title: 'Guía para Contratos Comerciales',
    excerpt: 'Todo lo que necesitas saber sobre la redacción y negociación de contratos comerciales.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Dr. Wilson Ipiales',
    date: '2024-01-10',
    category: 'Derecho Comercial',
    imageUrl: '/images/blog/contratos-comerciales.jpg',
    slug: 'guia-contratos-comerciales'
  }
];

// Datos de planes y precios
export const plans = [
  {
    id: 'basico',
    name: 'Plan Básico',
    price: 99,
    period: 'mes',
    features: [
      '1 consulta legal por mes',
      'Acceso a ebooks básicos',
      'Soporte por email',
      'Acceso al foro comunitario'
    ],
    popular: false
  },
  {
    id: 'profesional',
    name: 'Plan Profesional',
    price: 199,
    period: 'mes',
    features: [
      '3 consultas legales por mes',
      'Acceso completo a ebooks',
      '1 curso por mes',
      'Soporte prioritario',
      'Acceso a masterclass'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: 399,
    period: 'mes',
    features: [
      'Consultas ilimitadas',
      'Acceso completo a todos los cursos',
      'Soporte 24/7',
      'Asesoría personalizada',
      'Acceso a contenido exclusivo'
    ],
    popular: false
  }
];