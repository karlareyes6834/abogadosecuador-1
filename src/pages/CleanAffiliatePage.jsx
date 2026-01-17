import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaHandshake, FaGift, FaChartLine, FaLink, FaCopy,
  FaMoneyBillWave, FaStar, FaTrophy, FaCrown, FaRocket,
  FaCheckCircle, FaArrowRight, FaPercent, FaCalculator
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AffiliatePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 45,
    activeReferrals: 32,
    pendingCommission: 1250.00,
    totalEarned: 8750.50,
    conversionRate: 12.5,
    recentReferrals: [
      { name: 'Ana García', amount: 299, date: '2024-01-15', status: 'completed' },
      { name: 'Carlos López', amount: 150, date: '2024-01-14', status: 'pending' },
      { name: 'María Rodríguez', amount: 450, date: '2024-01-13', status: 'completed' },
    ]
  });

  useEffect(() => {
    if (user) {
      fetchAffiliateStats();
    }
  }, [user]);

  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      toast.error('Error al cargar estadísticas');
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `https://abogadowilson.com/ref/${user?.id || '123456'}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const tiers = [
    {
      name: 'Bronze',
      minReferrals: 0,
      commission: 15,
      color: 'from-orange-400 to-orange-600',
      benefits: ['15% comisión', 'Soporte básico', 'Materiales de marketing']
    },
    {
      name: 'Silver',
      minReferrals: 10,
      commission: 20,
      color: 'from-gray-400 to-gray-600',
      benefits: ['20% comisión', 'Soporte prioritario', 'Materiales premium']
    },
    {
      name: 'Gold',
      minReferrals: 25,
      commission: 25,
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['25% comisión', 'Soporte VIP', 'Materiales exclusivos']
    },
    {
      name: 'Platinum',
      minReferrals: 50,
      commission: 30,
      color: 'from-purple-400 to-purple-600',
      benefits: ['30% comisión', 'Manager dedicado', 'Eventos exclusivos']
    }
  ];

  const currentTier = tiers.find(tier =>
    stats.totalReferrals >= tier.minReferrals
  ) || tiers[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <p className="text-xl text-purple-100">Gana dinero recomendando nuestros servicios</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaUsers className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Referidos</h3>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaMoneyBillWave className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Ganado</h3>
              <p className="text-2xl font-bold">${stats.totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaChartLine className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Conversión</h3>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <FaCalculator className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Pendiente</h3>
              <p className="text-2xl font-bold">${stats.pendingCommission.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Current Tier */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tu Nivel Actual</h2>
          <div className="max-w-md mx-auto">
            <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 text-white text-center shadow-xl`}>
              <h3 className="text-2xl font-bold mb-2">{currentTier.name}</h3>
              <p className="text-lg mb-4">{currentTier.commission}% de comisión</p>
              <ul className="text-sm space-y-2">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <FaCheckCircle className="mr-2 text-sm" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Referral Link */}
        <motion.div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tu Enlace de Afiliado</h2>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaCopy className="mr-2" />
                  Copiar
                </button>
              </div>
              <p className="text-gray-600 text-sm text-center">
                Comparte este enlace y gana {currentTier.commission}% por cada compra realizada
              </p>
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
                title: 'Regístrate',
                description: 'Únete gratis a nuestro programa de afiliados',
                icon: <FaUsers className="text-4xl text-blue-600" />
              },
              {
                step: '2',
                title: 'Comparte',
                description: 'Comparte tu enlace único con contactos interesados',
                icon: <FaLink className="text-4xl text-green-600" />
              },
              {
                step: '3',
                title: 'Gana',
                description: 'Recibe comisiones automáticas por cada compra',
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

export default AffiliatePage;
