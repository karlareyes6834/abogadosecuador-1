/**
 * Sección de Testimonios Profesional
 * Con efectos 3D y animaciones
 */

import React, { useState, useEffect } from 'react';

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "María Rodríguez",
      role: "Cliente Derecho Civil",
      content: "El Dr. Wilson demostró un profesionalismo excepcional durante todo mi caso de divorcio. Siempre accesible y claro en sus explicaciones, logró un acuerdo justo en tiempo récord.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Maria+Rodriguez&background=3b82f6&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Juan Pérez",
      role: "Cliente Derecho Penal",
      content: "En un momento muy difícil, el Dr. Ipiales me brindó no solo una defensa legal impecable, sino también la tranquilidad que necesitaba. Su conocimiento del derecho penal es admirable.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=10b981&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Comercial Suárez S.A.",
      role: "Cliente Empresarial",
      content: "Como empresa, valoramos enormemente el enfoque estratégico y la rapidez con que el bufete del Dr. Wilson resolvió nuestro litigio comercial. Una inversión que valió cada centavo.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Comercial+Suarez&background=8b5cf6&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Ana Martínez",
      role: "Cliente Derecho Laboral",
      content: "La asesoría laboral que recibí fue precisa y eficaz. El Dr. Wilson entendió mis preocupaciones y me guió con gran profesionalismo durante todo el proceso.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Ana+Martinez&background=ec4899&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
    },
    {
      id: 5,
      name: "Carlos Gómez",
      role: "Cliente Derecho de Tránsito",
      content: "Después de un accidente complicado, contar con la representación del Dr. Ipiales fue decisivo. Su experiencia y dedicación marcaron la diferencia en el resultado final.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Carlos+Gomez&background=f59e0b&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    },
    {
      id: 6,
      name: "Sofía Herrera",
      role: "Cliente Derecho de Familia",
      content: "La sensibilidad y profesionalismo con que manejaron mi caso de custodia fueron extraordinarios. Obtuve el mejor resultado posible para mis hijos.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Sofia+Herrera&background=ef4444&color=fff&size=200",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Testimonios de Clientes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestro mejor testimonio
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                index === activeIndex ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              {/* Content */}
              <div className="mb-6">
                <span className="text-4xl text-blue-200 dark:text-blue-800">"</span>
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {testimonial.content}
                </p>
                <span className="text-4xl text-blue-200 dark:text-blue-800 float-right">"</span>
              </div>

              {/* Author */}
              <div className="flex items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  onError={(e) => {
                    e.currentTarget.src = testimonial.avatar;
                  }}
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === activeIndex ? 'bg-blue-600 w-8' : 'bg-blue-200 dark:bg-gray-600'
              }`}
              aria-label={`Ver testimonio ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Clientes Satisfechos", icon: "👥" },
            { value: "95%", label: "Casos Ganados", icon: "⚖️" },
            { value: "15+", label: "Años de Experiencia", icon: "🏆" },
            { value: "98%", label: "Satisfacción", icon: "⭐" }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
