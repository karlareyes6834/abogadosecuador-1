import React from 'react';
import { LegalIcon, EducationIcon, UsersIcon } from '../components/icons/InterfaceIcons';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Abogado Wilson Ipiales
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Más de 5 años brindando soluciones legales profesionales y efectivas
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Experiencia y Dedicación al Servicio Legal
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Con más de 5 años de experiencia en el ejercicio del derecho, me especializo en 
              brindar asesoría legal integral en las áreas de derecho civil, penal, comercial y 
              de tránsito. Mi compromiso es ofrecer soluciones efectivas y personalizadas para 
              cada cliente.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Graduado de la Universidad Nacional de Colombia, he desarrollado una práctica 
              legal sólida basada en la honestidad, la transparencia y el compromiso con 
              la justicia.
            </p>
          </div>
          <div className="lg:text-center">
            <img 
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=600&fit=crop" 
              alt="Abogado Wilson Ipiales" 
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>

        {/* Services Overview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Áreas de Especialización
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <LegalIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Derecho Civil y Penal</h4>
              <p className="text-gray-600">
                Amplia experiencia en casos civiles y penales, desde contratos hasta defensa penal.
              </p>
            </div>
            <div className="text-center">
              <EducationIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Formación Continua</h4>
              <p className="text-gray-600">
                Cursos y masterclasses para mantenerme actualizado con las últimas reformas legales.
              </p>
            </div>
            <div className="text-center">
              <UsersIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Atención Personalizada</h4>
              <p className="text-gray-600">
                Cada caso recibe atención personalizada y estrategias adaptadas a las necesidades específicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
