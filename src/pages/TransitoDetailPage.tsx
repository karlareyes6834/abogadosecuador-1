/**
 * Página Detallada del Servicio de Derecho de Tránsito
 * Incluye formulario profesional con validación completa y guardado en BD
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const TransitoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    telefono: '',
    tipoConsulta: 'multa',
    descripcion: '',
    fechaIncidente: '',
    numeroActa: '',
    placa: '',
    modalidad: 'presencial',
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
            service_type: 'transito',
            consultation_type: formData.tipoConsulta,
            full_name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            description: formData.descripcion,
            incident_date: formData.fechaIncidente || null,
            case_number: formData.numeroActa || null,
            vehicle_plate: formData.placa || null,
            modality: formData.modalidad,
            urgency: formData.urgencia,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Calcular precio según modalidad y urgencia
      let basePrice = 120;
      if (formData.modalidad === 'presencial') basePrice = 150;
      if (formData.urgencia === 'urgente') basePrice += 30;
      
      // Agregar al carrito
      const servicio = {
        id: `transito-${Date.now()}`,
        name: `Consulta Derecho de Tránsito - ${formData.tipoConsulta}`,
        price: basePrice,
        type: 'service' as const,
        category: 'Derecho de Tránsito',
        image: '/images/services/transito.jpg',
        shortDescription: `Consulta ${formData.modalidad} sobre ${formData.tipoConsulta} (${formData.urgencia})`,
        priceInfo: `$${basePrice}`,
        slug: 'derecho-transito'
      };
      
      addToCart(servicio);
      
      toast.success('¡Consulta registrada exitosamente! Agregada al carrito.');
      
      // Resetear formulario
      setFormData({
        nombre: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        telefono: '',
        tipoConsulta: 'multa',
        descripcion: '',
        fechaIncidente: '',
        numeroActa: '',
        placa: '',
        modalidad: 'presencial',
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <span className="text-5xl">🚗</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Derecho de Tránsito</h1>
              <p className="text-green-100 text-lg">Especialistas en infracciones y accidentes viales</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">15-60 días</div>
              <div className="text-sm text-green-100">Duración promedio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-semibold">88% Éxito</div>
              <div className="text-sm text-green-100">Tasa de victoria</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Desde $120</div>
              <div className="text-sm text-green-100">Precio base</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">+200 casos</div>
              <div className="text-sm text-green-100">Resueltos</div>
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
                Nuestro equipo de abogados especialistas en derecho de tránsito ofrece defensa legal integral 
                en casos de infracciones, accidentes y trámites administrativos vehiculares. Con amplia experiencia 
                y conocimiento profundo de la normativa vial ecuatoriana, defendemos sus derechos con estrategias 
                efectivas y personalizadas.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Trabajamos para lograr la anulación de multas injustas, recuperación de puntos en licencias, 
                y resolución favorable de casos de accidentes de tránsito, siempre buscando el mejor resultado 
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
                  'Impugnación de multas de tránsito',
                  'Defensa en accidentes viales',
                  'Recuperación de puntos en licencias',
                  'Trámites administrativos de tránsito',
                  'Asesoría en seguros vehiculares',
                  'Peritajes técnicos vehiculares',
                  'Representación en audiencias',
                  'Recursos de apelación'
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
                  { step: 1, title: 'Consulta Inicial', desc: 'Evaluamos su caso y documentos', icon: '📋' },
                  { step: 2, title: 'Análisis Legal', desc: 'Revisión detallada de normativa aplicable', icon: '⚖️' },
                  { step: 3, title: 'Estrategia', desc: 'Diseñamos plan de acción personalizado', icon: '🎯' },
                  { step: 4, title: 'Ejecución', desc: 'Presentación de recursos y seguimiento', icon: '📄' },
                  { step: 5, title: 'Resolución', desc: 'Obtención del resultado favorable', icon: '✅' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-green-600 dark:text-green-300">
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
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Virtual</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$120</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Consulta Presencial</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$150</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Servicio Urgente</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+$30</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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
              Formulario de Consulta - Derecho de Tránsito
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="multa">Impugnación de Multa</option>
                    <option value="accidente">Accidente de Tránsito</option>
                    <option value="puntos">Recuperación de Puntos</option>
                    <option value="tramites">Trámites Administrativos</option>
                    <option value="seguros">Asesoría en Seguros</option>
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Número de Acta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Acta/Citación
                  </label>
                  <input
                    type="text"
                    name="numeroActa"
                    value={formData.numeroActa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    placeholder="ANT-2025-12345"
                  />
                </div>

                {/* Placa del Vehículo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Placa del Vehículo
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    placeholder="ABC-1234"
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modalidad de Consulta *
                  </label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="virtual">Virtual ($120)</option>
                    <option value="presencial">Presencial ($150)</option>
                  </select>
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente (+$30)</option>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="Describe los detalles de tu caso: qué sucedió, cuándo, dónde, quiénes estuvieron involucrados, etc."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/20 caracteres mínimos
                </p>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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

export default TransitoDetailPage;
