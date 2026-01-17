import React from 'react';
import Card from '../components/Card';
import { CheckCircleIcon } from '../components/icons/InterfaceIcons';

const PlansPage: React.FC = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 29.99,
      description: 'Perfecto para consultas ocasionales',
      features: [
        'Hasta 3 consultas por mes',
        'Acceso al chat legal',
        'Documentos básicos',
        'Soporte por email'
      ]
    },
    {
      id: 'professional',
      name: 'Plan Profesional',
      price: 59.99,
      description: 'Ideal para empresarios y profesionales',
      features: [
        'Consultas ilimitadas',
        'Videollamadas programadas',
        'Documentos avanzados',
        'Soporte prioritario',
        'Acceso a cursos'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Plan Empresarial',
      price: 99.99,
      description: 'Para empresas que necesitan asesoría continua',
      features: [
        'Todo del Plan Profesional',
        'Asesor legal dedicado',
        'Contratos personalizados',
        'Análisis de riesgo',
        'Capacitación legal'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planes de Suscripción
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades legales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-blue-600">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-500">/mes</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                Seleccionar Plan
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
