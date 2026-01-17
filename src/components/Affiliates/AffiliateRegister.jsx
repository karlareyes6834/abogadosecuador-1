import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../../config/supabase';
import { FaEnvelope, FaUser, FaLink } from 'react-icons/fa';

const AffiliateRegister = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.trim() || !name.trim() || !referralCode.trim()) {
        throw new Error('Todos los campos son obligatorios.');
      }
      
      if (name.trim().length < 2) {
        throw new Error('Su nombre debe tener al menos 2 caracteres');
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Por favor, ingrese un correo electrónico válido');
      }

      if (referralCode.trim().length < 3) {
        throw new Error('El código de referido debe tener al menos 3 caracteres');
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Debe iniciar sesión para registrarse como afiliado');
      }

      const { data, error: insertError } = await supabase
        .from('affiliates')
        .insert([
          { 
            user_id: user.id, 
            email: email.trim().toLowerCase(), 
            name: name.trim(), 
            referral_code: referralCode.trim().toUpperCase(), 
            created_at: new Date().toISOString() 
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setEmail('');
      setName('');
      setReferralCode('');
      toast.success('¡Registro como afiliado exitoso!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Conviértete en Afiliado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestro programa de afiliados y gana comisiones por referir clientes.
            ¿Ya eres afiliado? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Inicia sesión</Link>.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLink className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Crea tu código de referido único"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarme como Afiliado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AffiliateRegister;