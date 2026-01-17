/**
 * Página Profesional de Consulta Penal
 * Formulario completo con validación y guardado en BD
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const PenalConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    telefono: '',
    tipoConsulta: 'defensa',
    descripcion: '',
    fechaIncidente: '',
    lugarIncidente: '',
    fiscalia: '',
    numeroDenuncia: '',
    evidencia: '',
    testigos: '',
    urgencia: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      toast.error('Por favor ingresa tu nombre completo');
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }

    if (!formData.telefono.match(/^[0-9]{10}$/)) {
      toast.error('Por favor ingresa un teléfono válido (10 dígitos)');
      return false;
    }

    if (!formData.descripcion.trim() || formData.descripcion.length < 20) {
      toast.error('Por favor describe tu caso con al menos 20 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Guardar consulta en Supabase
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user?.id || null,
            service_type: 'penal',
            consultation_type: formData.tipoConsulta,
            full_name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            description: formData.descripcion,
            incident_date: formData.fechaIncidente || null,
            incident_location: formData.lugarIncidente || null,
            fiscalia: formData.fiscalia || null,
            case_number: formData.numeroDenuncia || null,
            evidence: formData.evidencia || null,
            witnesses: formData.testigos || null,
            urgency: formData.urgencia,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Calcular precio según urgencia
      let basePrice = 180;
      if (formData.urgencia === 'urgente') basePrice += 50;

      // Agregar al carrito
      const servicio = {
        id: `penal-${Date.now()}`,
        name: `Consulta Derecho Penal - ${formData.tipoConsulta}`,
        price: basePrice,
        type: 'service' as const,
        category: 'Derecho Penal',
        image: '/images/services/penal.jpg',
        shortDescription: `Consulta ${formData.urgencia} sobre ${formData.tipoConsulta}`,
        priceInfo: `$${basePrice}`,
        slug: 'derecho-penal'
      };

      addToCart(servicio);

      toast.success('¡Consulta registrada exitosamente! Agregada al carrito.');

      // Resetear formulario
      setFormData({
        nombre: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        telefono: '',
        tipoConsulta: 'defensa',
        descripcion: '',
        fechaIncidente: '',
        lugarIncidente: '',
        fiscalia: '',
        numeroDenuncia: '',
        evidencia: '',
        testigos: '',
        urgencia: 'normal'
      });

      setShowForm(false);

      // Redirigir al carrito después de 2 segundos
      setTimeout(() => {
        navigate('/checkout');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar consulta:', error);
      toast.error('Error al procesar tu solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <span className="text-5xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Derecho Penal</h1>
              <p className="text-red-100 text-lg">Defensa legal especializada en procesos penales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">2-6 meses</div>
              <div className="text-sm text-red-100">Duración promedio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold">92% Éxito</div>
              <div className="text-sm text-red-100">Tasa de victoria</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Desde $180</div>
              <div className="text-sm text-red-100">Precio base</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">400+ casos</div>
              <div className="text-sm text-red-100">Resueltos</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Descripción del Servicio
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nuestro equipo de abogados penalistas cuenta con amplia experiencia en la defensa de casos complejos,
                ofreciendo representación legal integral desde la investigación previa hasta el juicio oral. Con un enfoque
                estratégico y conocimiento profundo del derecho penal ecuatoriano, defendemos sus derechos con las mejores
                estrategias disponibles.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Especializados en delitos contra la propiedad, contra las personas, delitos económicos y financieros,
                brindamos asesoría inmediata y representación efectiva en todas las etapas del proceso penal.
              </p>
            </div>

            {/* Services Included */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Servicios Incluidos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Defensa en delitos contra la propiedad',
                  'Defensa en delitos contra las personas',
                  'Litigios en delitos económicos y financieros',
                  'Representación en audiencias y juicios penales',
                  'Medidas alternativas a la prisión preventiva',
                  'Recursos de apelación y casación',
                  'Asesoría en investigaciones fiscales',
                  'Defensa en procedimientos administrativos'
                ].map((service, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Proceso de Atención
              </h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Consulta Inicial', desc: 'Evaluación inmediata de la situación', icon: '📞' },
                  { step: 2, title: 'Análisis del Caso', desc: 'Revisión de evidencia y documentos', icon: '🔍' },
                  { step: 3, title: 'Estrategia de Defensa', desc: 'Plan personalizado de acción legal', icon: '🎯' },
                  { step: 4, title: 'Representación', desc: 'Audiencias, juicios y procedimientos', icon: '⚖️' },
                  { step: 5, title: 'Resolución', desc: 'Obtención del mejor resultado posible', icon: '✅' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center font-bold text-red-600 dark:text-red-300">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Paso {item.step}: {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tarifas</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Estándar</span>
                    <span className="font-bold text-red-600 dark:text-red-400">$180</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Urgente</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">$230</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>📝</span>
                  <span>{showForm ? 'Ocultar Formulario' : 'Solicitar Consulta'}</span>
                </button>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full mt-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200"
                >
                  Contactar por WhatsApp
                </button>
              </div>

              {/* Garantías */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Garantías</h3>
                <div className="space-y-3">
                  {[
                    { icon: '⚖️', text: 'Defensa especializada' },
                    { icon: '⏰', text: 'Atención inmediata' },
                    { icon: '🔒', text: 'Confidencialidad total' },
                    { icon: '📞', text: 'Comunicación constante' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Consulta */}
        {showForm && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Formulario de Consulta - Derecho Penal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="Juan Pérez García"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="0987654321"
                  />
                </div>

                {/* Tipo de Consulta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Consulta *
                  </label>
                  <select
                    name="tipoConsulta"
                    value={formData.tipoConsulta}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="defensa">Defensa Penal</option>
                    <option value="acusacion">Presentar Denuncia/Acusación</option>
                    <option value="medidas">Medidas Alternativas</option>
                    <option value="recursos">Recursos de Apelación</option>
                    <option value="investigacion">Asesoría en Investigación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Fecha del Incidente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha del Incidente
                  </label>
                  <input
                    type="date"
                    name="fechaIncidente"
                    value={formData.fechaIncidente}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Lugar del Incidente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lugar del Incidente
                  </label>
                  <input
                    type="text"
                    name="lugarIncidente"
                    value={formData.lugarIncidente}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="Ciudad/Provincia donde ocurrió"
                  />
                </div>

                {/* Fiscalía */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fiscalía (opcional)
                  </label>
                  <input
                    type="text"
                    name="fiscalia"
                    value={formData.fiscalia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="Fiscalía que lleva el caso"
                  />
                </div>

                {/* Número de Denuncia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Denuncia (opcional)
                  </label>
                  <input
                    type="text"
                    name="numeroDenuncia"
                    value={formData.numeroDenuncia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    placeholder="Número de expediente o denuncia"
                  />
                </div>

                {/* Urgencia */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de Urgencia *
                  </label>
                  <select
                    name="urgencia"
                    value={formData.urgencia}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="normal">Normal ($180)</option>
                    <option value="urgente">Urgente (+$50)</option>
                  </select>
                </div>
              </div>

              {/* Descripción del Caso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Detallada del Caso * (mínimo 20 caracteres)
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={6}
                  minLength={20}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="Describe los hechos: qué ocurrió exactamente, cuándo, dónde, quiénes estuvieron involucrados, qué acciones se han tomado hasta ahora, etc."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/20 caracteres mínimos
                </p>
              </div>

              {/* Evidencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidencia Disponible (opcional)
                </label>
                <textarea
                  name="evidencia"
                  value={formData.evidencia}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="Describe qué evidencia tienes (fotos, videos, documentos, etc.)"
                />
              </div>

              {/* Testigos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Testigos (opcional)
                </label>
                <textarea
                  name="testigos"
                  value={formData.testigos}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="Nombres y contactos de posibles testigos"
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Enviar Consulta y Agregar al Carrito</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Al enviar este formulario, tu consulta será registrada y se agregará al carrito para proceder con el pago.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenalConsultationPage;
