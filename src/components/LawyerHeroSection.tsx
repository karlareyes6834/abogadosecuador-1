import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, Calendar } from 'lucide-react';
import TypingEffect from './TypingEffect';

interface LawyerHeroSectionProps {
  lawyerName?: string;
  lawyerTitle?: string;
  experience?: string;
  cases?: number;
  clients?: number;
  description?: string;
  onConsultClick?: () => void;
  onChatClick?: () => void;
  onScheduleClick?: () => void;
}

/**
 * SECCIÓN HERO PARA PÁGINA DE ABOGADOS
 * 
 * Integra:
 * - Efecto de escritura dinámico en el nombre
 * - Información profesional
 * - Botones de acción
 * - Diseño elegante y profesional
 * - Sin dañar el diseño existente
 */
const LawyerHeroSection: React.FC<LawyerHeroSectionProps> = ({
  lawyerName = 'Abg. Wilson Alexander Ipiales Guerron',
  lawyerTitle = 'Especialista en Derecho Penal y Civil',
  experience = 'Con más de 5 años de experiencia y más de 50 casos ganados exitosamente',
  cases = 50,
  clients = 200,
  description = 'Ofrecemos soluciones legales efectivas y personalizadas. Más de 200 clientes satisfechos confían en nuestra experiencia y dedicación.',
  onConsultClick,
  onChatClick,
  onScheduleClick
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Fondo decorativo con patrón */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)" />
        </svg>
      </div>

      {/* Líneas decorativas animadas */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 600">
          <polyline points="0,300 150,250 300,350 450,200 600,400 750,150 900,350 1050,250 1200,300" 
                    fill="none" stroke="white" strokeWidth="2"/>
          <polyline points="0,200 200,300 400,150 600,350 800,200 1000,400 1200,250" 
                    fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Columna izquierda - Información */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Nombre con efecto de escritura */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-serif">
              <TypingEffect
                text={lawyerName}
                speed={80}
                delay={300}
                className="text-white"
              />
            </h1>

            {/* Título profesional */}
            <p className="text-lg md:text-xl text-blue-100 mb-6 font-medium">
              {lawyerTitle}
            </p>

            {/* Experiencia */}
            <p className="text-base md:text-lg text-blue-50 mb-8 leading-relaxed max-w-md">
              {experience}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Botón Consulta Gratis */}
              <button
                onClick={onConsultClick}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                Consulta Gratis
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Botón Chat */}
              <button
                onClick={onChatClick}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chatear Ahora
              </button>

              {/* Botón Agendar */}
              <button
                onClick={onScheduleClick}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg border border-blue-400"
              >
                <Calendar className="w-5 h-5" />
                Agendar Cita
              </button>
            </div>

            {/* Oferta especial */}
            <div className="bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-lg inline-block">
              <p className="text-sm font-bold">OFERTA ESPECIAL</p>
              <p className="text-xs">¡Tiempo Limitado! Primera Consulta Legal GRATUITA</p>
            </div>
          </div>

          {/* Columna derecha - Tarjetas de servicios */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Tarjeta 1 - Derecho Penal */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="text-lg font-bold text-white mb-2">Derecho Penal</h3>
              <p className="text-sm text-blue-100">Defensa especializada en casos penales</p>
              <a href="#" className="text-blue-300 hover:text-white text-sm mt-3 inline-flex items-center gap-1">
                Ver detalles <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Tarjeta 2 - Derecho Civil */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-white mb-2">Derecho Civil</h3>
              <p className="text-sm text-blue-100">Resolución de conflictos civiles y patrimoniales</p>
              <a href="#" className="text-blue-300 hover:text-white text-sm mt-3 inline-flex items-center gap-1">
                Ver detalles <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Tarjeta 3 - Consulta Rápida */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Consulta Rápida</h3>
              <p className="text-sm text-blue-100">Respuestas inmediatas a tus dudas legales</p>
              <a href="#" className="text-blue-300 hover:text-white text-sm mt-3 inline-flex items-center gap-1">
                Ver detalles <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Tarjeta 4 - Justicia Equilibrada */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="text-lg font-bold text-white mb-2">Justicia Equilibrada</h3>
              <p className="text-sm text-blue-100">Defensa justa y equitativa de todos los casos</p>
              <a href="#" className="text-blue-300 hover:text-white text-sm mt-3 inline-flex items-center gap-1">
                Ver detalles <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Resultados - Fila inferior */}
        <div className={`mt-16 pt-12 border-t border-white/20 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-white text-lg font-bold mb-8">Resultados Probados</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5+</div>
              <p className="text-blue-100 text-sm">Años de Experiencia</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <p className="text-blue-100 text-sm">Casos Ganados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">200+</div>
              <p className="text-blue-100 text-sm">Clientes Satisfechos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerHeroSection;
