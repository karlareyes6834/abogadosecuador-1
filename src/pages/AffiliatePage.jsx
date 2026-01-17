import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaHandshake, FaGift, FaChartLine, FaLink, FaCopy,
  FaMoneyBillWave, FaStar, FaTrophy, FaCrown, FaRocket,
  FaCheckCircle, FaArrowRight, FaPercent, FaCalculator
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AffiliatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingCommission: 0,
    totalEarned: 0,
    conversionRate: 0,
    clickCount: 0,
    recentReferrals: []
  });

  useEffect(() => {
    if (user) {
      fetchAffiliateStats();
    }
  }, [user]);

  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      // Simular datos reales de afiliados
      const mockStats = {
        totalReferrals: 45,
        activeReferrals: 32,
        pendingCommission: 1250.00,
        totalEarned: 8750.50,
        conversionRate: 12.5,
        clickCount: 1250,
        recentReferrals: [
          { name: 'Ana García', amount: 299, date: '2024-01-15', status: 'completed' },
          { name: 'Carlos López', amount: 150, date: '2024-01-14', status: 'pending' },
          { name: 'María Rodríguez', amount: 450, date: '2024-01-13', status: 'completed' },
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      toast.error('Error al cargar estadísticas de afiliados');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `https://abogadowilson.com/ref/${user?.id || '123456'}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace de referido copiado al portapapeles');
  };

  const tiers = [
    {
      name: 'Bronze',
      minReferrals: 0,
      commission: 15,
      color: 'from-orange-400 to-orange-600',
      icon: <FaStar className="text-2xl" />,
      benefits: ['15% comisión', 'Soporte básico', 'Materiales de marketing']
    },
    {
      name: 'Silver',
      minReferrals: 10,
      commission: 20,
      color: 'from-gray-400 to-gray-600',
      icon: <FaTrophy className="text-2xl" />,
      benefits: ['20% comisión', 'Soporte prioritario', 'Materiales premium', 'Bonos mensuales']
    },
    {
      name: 'Gold',
      minReferrals: 25,
      commission: 25,
      color: 'from-yellow-400 to-yellow-600',
      icon: <FaCrown className="text-2xl" />,
      benefits: ['25% comisión', 'Soporte VIP', 'Materiales exclusivos', 'Bonos trimestrales', 'Acceso temprano']
    },
    {
      name: 'Platinum',
      minReferrals: 50,
      commission: 30,
      color: 'from-purple-400 to-purple-600',
      icon: <FaRocket className="text-2xl" />,
      benefits: ['30% comisión', 'Manager dedicado', 'Eventos exclusivos', 'Bonos especiales', 'Acceso total']
    }
  ];

  const currentTier = tiers.find(tier =>
    stats.totalReferrals >= tier.minReferrals
  ) || tiers[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <FaHandshake className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Programa de Afiliados</h1>
              <p className="text-xl text-purple-100">Gana dinero recomendando nuestros servicios legales profesionales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaUsers className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Referidos Activos</h3>
              <p className="text-2xl font-bold">{stats.activeReferrals}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaMoneyBillWave className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Comisiones Ganadas</h3>
              <p className="text-2xl font-bold">${stats.totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaChartLine className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Tasa de Conversión</h3>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Current Tier */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Tu Nivel Actual</h2>
          <div className="max-w-md mx-auto">
            <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 text-white text-center shadow-xl`}>
              <div className="mb-4">
                {currentTier.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentTier.name}</h3>
              <p className="text-lg mb-4">{currentTier.commission}% de comisión</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <ul className="text-sm space-y-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="mr-2 text-sm" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tiers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Niveles de Afiliado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  tier.name === currentTier.name ? 'ring-4 ring-purple-400' : ''
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
                    {tier.minReferrals}+ referidos • {tier.commission}% comisión
                  </p>
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <FaCheckCircle className="mr-2 text-green-500 text-xs" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Tu Enlace de Referido</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <FaLink className="text-2xl text-blue-600" />
                <div className="flex-1">
                  <p className="font-mono text-sm bg-gray-100 p-3 rounded-lg break-all">
                    https://abogadowilson.com/ref/{user?.id || '123456'}
                  </p>
                </div>
                <button
                  onClick={copyReferralLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaCopy className="mr-2" />
                  Copiar
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                Comparte este enlace con tus contactos. Ganarás una comisión por cada compra que realicen.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Referidos Recientes</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {stats.recentReferrals.length === 0 ? (
                <p className="text-center text-gray-500">Aún no tienes referidos</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentReferrals.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{referral.name}</p>
                        <p className="text-sm text-gray-600">{referral.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${referral.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          referral.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {referral.status === 'completed' ? 'Completado' : 'Pendiente'}
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Cómo Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Regístrate',
                description: 'Únete a nuestro programa de afiliados de forma gratuita',
                icon: <FaUsers className="text-4xl text-blue-600" />
              },
              {
                step: '2',
                title: 'Comparte',
                description: 'Comparte tu enlace único con tus contactos y redes sociales',
                icon: <FaLink className="text-4xl text-green-600" />
              },
              {
                step: '3',
                title: 'Gana',
                description: 'Recibe comisiones por cada compra realizada a través de tu enlace',
                icon: <FaMoneyBillWave className="text-4xl text-purple-600" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="mb-4 flex justify-center">
                  {item.icon}
                </div>
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

export default AffiliatePage;
