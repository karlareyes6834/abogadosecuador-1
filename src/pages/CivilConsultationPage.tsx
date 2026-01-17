/**
 * Página Profesional de Consulta Civil
 * Formulario completo con validación y guardado en BD
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const CivilConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    telefono: '',
    tipoConsulta: 'contrato',
    descripcion: '',
    documentos: '',
    valorDisputa: '',
    contraparte: '',
    ubicacion: '',
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
            service_type: 'civil',
            consultation_type: formData.tipoConsulta,
            full_name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            description: formData.descripcion,
            documents: formData.documentos || null,
            dispute_amount: formData.valorDisputa ? parseFloat(formData.valorDisputa) : null,
            counterparty: formData.contraparte || null,
            location: formData.ubicacion || null,
            urgency: formData.urgencia,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Calcular precio según urgencia
      let basePrice = 150;
      if (formData.urgencia === 'urgente') basePrice += 50;

      // Agregar al carrito
      const servicio = {
        id: `civil-${Date.now()}`,
        name: `Consulta Derecho Civil - ${formData.tipoConsulta}`,
        price: basePrice,
        type: 'service' as const,
        category: 'Derecho Civil',
        image: '/images/services/civil.jpg',
        shortDescription: `Consulta ${formData.urgencia} sobre ${formData.tipoConsulta}`,
        priceInfo: `$${basePrice}`,
        slug: 'derecho-civil'
      };

      addToCart(servicio);

      toast.success('¡Consulta registrada exitosamente! Agregada al carrito.');

      // Resetear formulario
      setFormData({
        nombre: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        telefono: '',
        tipoConsulta: 'contrato',
        descripcion: '',
        documentos: '',
        valorDisputa: '',
        contraparte: '',
        ubicacion: '',
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <span className="text-5xl">📜</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Derecho Civil</h1>
              <p className="text-blue-100 text-lg">Asesoría especializada en contratos y obligaciones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">1-4 meses</div>
              <div className="text-sm text-blue-100">Duración promedio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold">95% Éxito</div>
              <div className="text-sm text-blue-100">Tasa de victoria</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Desde $150</div>
              <div className="text-sm text-blue-100">Precio base</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">300+ casos</div>
              <div className="text-sm text-blue-100">Resueltos</div>
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
                Nuestro equipo de abogados especialistas en derecho civil ofrece asesoría integral en contratos,
                propiedades, sucesiones y obligaciones civiles. Con amplia experiencia y conocimiento profundo de
                la normativa civil ecuatoriana, brindamos soluciones efectivas y personalizadas para proteger
                sus derechos e intereses.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Trabajamos para lograr acuerdos justos, resolver conflictos familiares y patrimoniales,
                y asegurar el cumplimiento de obligaciones contractuales, siempre buscando el mejor resultado
                para nuestros clientes.
              </p>
            </div>

            {/* Services Included */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Servicios Incluidos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Elaboración y revisión de contratos',
                  'Procesos de divorcios y pensiones alimenticias',
                  'Juicios de inquilinato y desalojos',
                  'Trámites sucesorios y testamentos',
                  'Compraventa de bienes inmuebles',
                  'Responsabilidad civil y daños',
                  'Ejecución de obligaciones',
                  'Nulidad de actos jurídicos'
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
                  { step: 1, title: 'Consulta Inicial', desc: 'Evaluamos tu situación y documentos', icon: '📋' },
                  { step: 2, title: 'Análisis Legal', desc: 'Revisión detallada de normativa aplicable', icon: '⚖️' },
                  { step: 3, title: 'Estrategia', desc: 'Diseñamos plan de acción personalizado', icon: '🎯' },
                  { step: 4, title: 'Ejecución', desc: 'Presentación de demandas y seguimiento', icon: '📄' },
                  { step: 5, title: 'Resolución', desc: 'Obtención del resultado favorable', icon: '✅' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
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
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Estándar</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">$150</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Urgente</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">$200</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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
                    { icon: '🔒', text: 'Confidencialidad absoluta' },
                    { icon: '⚡', text: 'Respuesta en 24 horas' },
                    { icon: '💯', text: 'Sin costos ocultos' },
                    { icon: '📞', text: 'Atención personalizada' }
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
              Formulario de Consulta - Derecho Civil
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="contrato">Revisión/Elaboración de Contrato</option>
                    <option value="divorcio">Proceso de Divorcio</option>
                    <option value="sucesion">Trámite Sucesorio</option>
                    <option value="inquilinato">Juicio de Inquilinato</option>
                    <option value="compraventa">Compraventa de Inmuebles</option>
                    <option value="responsabilidad">Responsabilidad Civil</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Valor en Disputa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor en Disputa (opcional)
                  </label>
                  <input
                    type="number"
                    name="valorDisputa"
                    value={formData.valorDisputa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>

                {/* Contraparte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraparte (opcional)
                  </label>
                  <input
                    type="text"
                    name="contraparte"
                    value={formData.contraparte}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la otra parte involucrada"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación del Caso (opcional)
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Ciudad/Provincia"
                  />
                </div>

                {/* Urgencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de Urgencia *
                  </label>
                  <select
                    name="urgencia"
                    value={formData.urgencia}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal ($150)</option>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe los detalles de tu caso: qué sucedió, cuándo, dónde, quiénes estuvieron involucrados, documentos relevantes, etc."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/20 caracteres mínimos
                </p>
              </div>

              {/* Documentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documentos Relacionados (opcional)
                </label>
                <textarea
                  name="documentos"
                  value={formData.documentos}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Lista los documentos que tienes relacionados con el caso (contrato, escritura, etc.)"
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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

export default CivilConsultationPage;
