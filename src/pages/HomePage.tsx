import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { blogPosts } from '../data/blogData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import TestimonialsSection from '../components/Testimonials/TestimonialsSection';
import NewsletterSignup from '../components/Newsletter/NewsletterSignup';
import { CatalogItem } from '../types';
import { ShieldCheckIcon, CrmIcon, UsersIcon, FinancialsIcon } from '../components/icons/InterfaceIcons';

// Lazy load 3D component with error boundary
const LegalAtomScene = lazy(() => 
  import('../../legal-atom-3d/components/LegalAtomScene').catch(() => ({ 
    default: () => <div className="w-full h-full" /> 
  }))
);

const CATALOG_KEY = 'nexuspro_catalog';

const categoryIcons: { [key: string]: React.FC<any> } = {
  'Litigio y Defensa': ShieldCheckIcon,
  'Empresarial': CrmIcon,
  'Personal y Familiar': UsersIcon,
  'Financiero': FinancialsIcon,
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  slug: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children, slug }) => {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(`/service-detail/${slug}`)} className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--accent-color)] text-black mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-[var(--muted-foreground)]">{children}</p>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
    const [mainServices, setMainServices] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const catalogData = localStorage.getItem(CATALOG_KEY);
        if (catalogData) {
            const allItems: CatalogItem[] = JSON.parse(catalogData);
            const services = allItems.filter(item => item.type === 'service' && item.status === 'active');
            setMainServices(services.slice(0, 4));
        }
    }, []);


  return (
    <div className="text-[var(--foreground)]">
      {/* Hero Section with 3D Background */}
      <section className="relative pt-32 pb-32 text-center bg-[var(--background)] overflow-hidden">
        {/* 3D Background Layer - Transparent */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Suspense fallback={null}>
            <LegalAtomScene />
          </Suspense>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_-20%,var(--accent-color)/0.1,rgba(255,255,255,0))] z-5"></div>
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-serif">
            Soluciones Legales para 
            <TypeAnimation
                sequence={[
                    'su Empresa.', 2000,
                    'su Familia.', 2000,
                    'su Tranquilidad.', 2000,
                ]}
                wrapper="span"
                speed={50}
                className="block text-[var(--accent-color)]"
                repeat={Infinity}
            />
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Con más de 5 años de experiencia, convertimos problemas complejos en soluciones claras y efectivas. Su tranquilidad es nuestra prioridad.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => navigate('/calendar')} className="px-8 py-3 text-lg font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-lg transition-transform hover:scale-105">
              Agendar Consulta
            </button>
            <button onClick={() => navigate('/services')} className="px-8 py-3 text-lg font-semibold bg-[var(--card)] rounded-lg shadow-lg transition-transform hover:scale-105 border border-[var(--border)]">
              Ver Servicios
            </button>
          </div>
        </div>
      </section>

      {/* Areas of practice Section */}
      <section id="features" className="py-20 bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold font-serif">Nuestras Áreas de Práctica</h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">Experiencia y dedicación en las áreas más cruciales del derecho.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {mainServices.map(service => {
                 const Icon = categoryIcons[service.category] || ShieldCheckIcon;
                 return (
                     <FeatureCard key={service.id} icon={<Icon className="w-6 h-6" />} title={service.name} slug={service.slug || ''}>
                        {service.shortDescription}
                    </FeatureCard>
                 )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Blog Section */}
      <section id="blog" className="py-20 bg-[var(--card)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                  <h2 className="text-4xl font-bold font-serif">Desde Nuestro Blog</h2>
                  <p className="mt-4 text-lg text-[var(--muted-foreground)]">Análisis, noticias y perspectivas del mundo legal.</p>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {blogPosts.slice(0, 3).map(post => (
                      <div key={post.id} className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-lg flex flex-col cursor-pointer group overflow-hidden" onClick={() => navigate(`/blog/${post.slug}`)}>
                          <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                          <div className="p-6 flex flex-col flex-grow">
                              <p className="text-sm font-semibold text-[var(--accent-color)]">{post.category}</p>
                              <h2 className="text-xl font-bold mt-2 group-hover:text-[var(--accent-color)] transition-colors">{post.title}</h2>
                              <p className="text-sm text-[var(--muted-foreground)] mt-2 flex-grow line-clamp-3">{post.excerpt}</p>
                              <div className="mt-4 flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                                <span>{format(new Date(post.publishDate), 'd LLL, yyyy', { locale: es })}</span>
                                <span className="font-semibold text-[var(--accent-color)]">Leer Más &rarr;</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="mt-12 text-center">
                  <button onClick={() => navigate('/blog')} className="px-6 py-3 font-semibold rounded-lg transition-colors text-[var(--accent-color)] bg-[var(--accent-color)] bg-opacity-10 hover:bg-opacity-20">
                      Ver Todos los Artículos
                  </button>
              </div>
          </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold font-serif">Manténgase Informado</h2>
            <p className="mt-4 text-xl text-[var(--muted-foreground)]">
              Reciba las últimas actualizaciones legales y consejos profesionales directamente en su correo.
            </p>
          </div>
          <NewsletterSignup className="max-w-md mx-auto" />
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-[var(--card)]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold font-serif">Planes de Suscripción</h2>
          <p className="mt-4 text-xl text-[var(--muted-foreground)]">
            Acceda a herramientas exclusivas y potencie su gestión legal con nuestros planes de asesoría continua.
          </p>
          <div className="mt-8">
            <button onClick={() => navigate('/plans')} className="px-8 py-3 text-lg font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-lg transition-transform hover:scale-105">
              Ver Planes y Precios
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
