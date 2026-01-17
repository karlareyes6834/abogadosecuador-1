import React, { useState } from 'react';
import { FaEnvelope, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface NewsletterSignupProps {
  compact?: boolean;
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ compact = false, className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for demo
      const existingEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem('newsletter_emails', JSON.stringify(existingEmails));
      }
      
      setIsSubscribed(true);
      toast.success('¡Suscripción exitosa! Revise su correo para confirmar.');
    } catch (error) {
      toast.error('Error en la suscripción. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          <FaCheck className="mr-2" />
          ¡Gracias por suscribirse!
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Su email"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? '...' : <FaEnvelope />}
        </button>
      </form>
    );
  }

  return (
    <div className={`bg-blue-50 p-6 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        Suscríbase al Newsletter Legal
      </h3>
      <p className="text-blue-700 mb-4">
        Reciba actualizaciones sobre cambios en la legislación y consejos legales gratuitos.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Suscribirse'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;