import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaUserPlus, FaGift, FaCalculator, FaTrophy,
  FaStar, FaCrown, FaRocket, FaCheckCircle, FaArrowRight,
  FaShareAlt, FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp,
  FaCopy, FaLink
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ReferralsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    totalReferrals: 28,
    activeReferrals: 22,
    totalEarned: 2450.75,
    pendingAmount: 320.50,
    referrals: [
      { name: 'Ana García', email: 'ana@example.com', joinDate: '2024-01-15', status: 'active', earned: 450 },
      { name: 'Carlos López', email: 'carlos@example.com', joinDate: '2024-01-10', status: 'active', earned: 320 },
      { name: 'María Rodríguez', email: 'maria@example.com', joinDate: '2024-01-08', status: 'inactive', earned: 150 },
      { name: 'Juan Pérez', email: 'juan@example.com', joinDate: '2024-01-05', status: 'active', earned: 680 },
    ]
  });

  useEffect(() => {
    if (user) {
      setReferralCode(user.id || 'ABC123');
      setStats(prev => ({ ...prev, referrals: prev.referrals }));
    }
  }, [user]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Código copiado al portapapeles');
  };

  const shareOnSocial = (platform) => {
    const url = `https://abogadowilson.com/ref/${referralCode}`;
    const text = `¡Únete al mejor servicio legal! Usa mi código ${referralCode} y obtén beneficios exclusivos.`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    window.open(shareUrls[platform], '_blank');
  };

  const tiers = [
    {
      name: 'Principiante',
      minReferrals: 0,
      reward: '5% descuento',
      color: 'from-blue-400 to-blue-600',
      icon: <FaStar className="text-2xl" />
    },
    {
      name: 'Activo',
      minReferrals: 5,
      reward: '10% descuento + bono',
      color: 'from-green-400 to-green-600',
      icon: <FaTrophy className="text-2xl" />
    },
    {
      name: 'Experto',
      minReferrals: 15,
      reward: '15% descuento + prioridad',
      color: 'from-purple-400 to-purple-600',
      icon: <FaCrown className="text-2xl" />
    },
    {
      name: 'Maestro',
      minReferrals: 30,
      reward: '20% descuento + VIP',
      color: 'from-yellow-400 to-yellow-600',
      icon: <FaRocket className="text-2xl" />
    }
  ];

  const currentTier = tiers.find(tier =>
    stats.totalReferrals >= tier.minReferrals
  ) || tiers[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <FaUsers className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Sistema de Referidos</h1>
              <p className="text-xl text-blue-100">Invita amigos y gana beneficios exclusivos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaUsers className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Referidos Totales</h3>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaUserPlus className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Referidos Activos</h3>
              <p className="text-2xl font-bold">{stats.activeReferrals}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaGift className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Total Ganado</h3>
              <p className="text-2xl font-bold">${stats.totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaCalculator className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Pendiente</h3>
              <p className="text-2xl font-bold">${stats.pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Current Tier */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tu Nivel de Referidor</h2>
          <div className="max-w-md mx-auto">
            <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 text-white text-center shadow-xl`}>
              <div className="mb-4">
                {currentTier.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentTier.name}</h3>
              <p className="text-lg mb-4">{currentTier.reward}</p>
              <p className="text-sm opacity-90">
                {stats.totalReferrals} referidos • Próximo nivel: {Math.max(0, tiers[tiers.indexOf(currentTier) + 1]?.minReferrals - stats.totalReferrals || 0)} más
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral Code */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tu Código de Referido</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                    <p className="font-mono text-2xl font-bold text-center">{referralCode}</p>
                  </div>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaShareAlt className="mr-2" />
                  Compartir Código
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter className="text-xl" />
                </button>
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </button>
                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </button>
                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tiers */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Niveles de Referidor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  tier.name === currentTier.name ? 'ring-4 ring-blue-400' : ''
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white`}>
                      {tier.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{tier.name}</h3>
                  <p className="text-center text-gray-600 mb-4">
                    {tier.minReferrals}+ referidos
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-center font-semibold text-blue-600">{tier.reward}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tus Referidos</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {referrals.length === 0 ? (
                <p className="text-center text-gray-500">Aún no tienes referidos</p>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${referral.status === 'active' ? 'from-green-400 to-green-600' : 'from-gray-400 to-gray-600'} flex items-center justify-center text-white font-bold`}>
                          {referral.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{referral.name}</p>
                          <p className="text-sm text-gray-600">{referral.email}</p>
                          <p className="text-xs text-gray-500">Se unió: {referral.joinDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${referral.earned}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div>
          <h2 className="text-3xl font-bold text-center mb-8">Cómo Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Obtén tu Código',
                description: 'Recibe tu código único de referidor al registrarte',
                icon: <FaUserPlus className="text-4xl text-blue-600" />
              },
              {
                step: '2',
                title: 'Invita Amigos',
                description: 'Comparte tu código con amigos, familiares y contactos',
                icon: <FaShareAlt className="text-4xl text-green-600" />
              },
              {
                step: '3',
                title: 'Gana Beneficios',
                description: 'Recibe descuentos y beneficios por cada referido activo',
                icon: <FaGift className="text-4xl text-purple-600" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReferralsPage;
