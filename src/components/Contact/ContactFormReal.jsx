import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle,
  FaSpinner, FaExclamationCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { supabase } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';

/**
 * Formulario de Contacto con Backend Real
 * Guarda mensajes en base de datos Supabase
 */
const ContactFormReal = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para insertar en Supabase
      const messageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
        status: 'pending',
        user_id: user?.id || null,
        created_at: new Date().toISOString()
      };

      // Insertar en tabla contact_messages
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select();

      if (error) {
        throw new Error(error.message || 'Error al enviar mensaje');
      }

      toast.success('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.');
      setSubmitted(true);

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Resetear estado después de 5 segundos
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error(error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
      >
        <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-green-700 mb-4">
          Gracias por contactarnos. Responderemos a tu mensaje lo más pronto posible.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Envíanos un Mensaje
      </h2>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Juan Pérez"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="juan@ejemplo.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono (Opcional)
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+593 999 999 999"
            />
          </div>
        </div>

        {/* Asunto */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Asunto (Opcional)
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
              errors.message 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Escribe tu mensaje aquí..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.message.length} / 1000 caracteres
          </p>
        </div>
      </div>

      {/* Botón de envío */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`mt-6 w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Enviando mensaje...
          </>
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            Enviar Mensaje
          </>
        )}
      </motion.button>

      {/* Información de seguridad */}
      <p className="mt-4 text-center text-sm text-gray-500">
        🔒 Tu información está protegida y será guardada de forma segura
      </p>
    </motion.form>
  );
};

export default ContactFormReal;
