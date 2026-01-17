import { CatalogItem } from '../types';

// Sample catalog data - in production this would come from API/database
export const catalogData: CatalogItem[] = [
  // Legal Services
  {
    id: 'service-1',
    name: 'Consulta Legal Completa',
    description: 'Asesoría legal profesional completa con análisis detallado de su caso',
    price: 150,
    category: 'Consultas Legales',
    type: 'service',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
    status: 'active',
    duration: '1 hora'
  },
  {
    id: 'service-2', 
    name: 'Redacción de Contratos',
    description: 'Elaboración profesional de contratos personalizados según sus necesidades',
    price: 300,
    category: 'Servicios Legales',
    type: 'service',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    status: 'active',
    duration: '3-5 días hábiles'
  },
  {
    id: 'service-3',
    name: 'Defensa Penal',
    description: 'Representación legal especializada en casos penales',
    price: 500,
    category: 'Derecho Penal',
    type: 'service', 
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400',
    status: 'active'
  },
  
  // Courses
  {
    id: 'course-1',
    name: 'Curso Completo de Derecho Civil',
    description: 'Aprenda los fundamentos del derecho civil ecuatoriano con certificación',
    price: 299,
    category: 'Derecho Civil',
    type: 'course',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    status: 'active',
    duration: '8 semanas'
  },
  {
    id: 'course-2',
    name: 'Derecho Laboral Actualizado',
    description: 'Curso actualizado sobre derecho laboral y nuevas reformas',
    price: 199,
    category: 'Derecho Laboral',
    type: 'course',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    status: 'active',
    duration: '6 semanas'
  },
  
  // E-books
  {
    id: 'ebook-1',
    name: 'Guía Legal para Emprendedores',
    description: 'Manual completo con todo lo que necesita saber para constituir su empresa',
    price: 49,
    category: 'Guías Legales',
    type: 'ebook',
    imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400',
    status: 'active'
  },
  {
    id: 'ebook-2',
    name: 'Manual de Contratos Comerciales',
    description: 'Modelos y ejemplos de contratos comerciales más utilizados',
    price: 39,
    category: 'Contratos',
    type: 'ebook',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    status: 'active'
  },
  {
    id: 'ebook-3',
    name: 'Derecho de Familia Práctico',
    description: 'Guía práctica sobre divorcios, custodia y pensiones alimenticias',
    price: 59,
    category: 'Derecho Familiar',
    type: 'ebook',
    imageUrl: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400',
    status: 'active'
  },
  
  // Consultas
  {
    id: 'consulta-1',
    name: 'Consulta Express 30 min',
    description: 'Consulta rápida para resolver dudas legales puntuales',
    price: 75,
    category: 'Consultas Rápidas',
    type: 'consulta',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    status: 'active',
    duration: '30 minutos'
  },
  {
    id: 'consulta-2',
    name: 'Consulta Virtual Premium',
    description: 'Consulta completa por videollamada con seguimiento posterior',
    price: 200,
    category: 'Consultas Virtuales',
    type: 'consulta',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    status: 'active',
    duration: '90 minutos'
  }
];

// Initialize localStorage with sample data if empty
export const initializeCatalogData = () => {
  const existingData = localStorage.getItem('nexuspro_catalog');
  if (!existingData) {
    localStorage.setItem('nexuspro_catalog', JSON.stringify(catalogData));
  }
};