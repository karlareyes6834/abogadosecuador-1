import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff } from 'lucide-react';
import tradingApiService from '../services/tradingApiService';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
}

const TradingDashboard: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [showValues, setShowValues] = useState(true);

  useEffect(() => {
    loadTradingData();
    const interval = setInterval(loadTradingData, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadTradingData = async () => {
    try {
      setLoading(true);
      const prices = await tradingApiService.getCryptoPrices();
      setCryptos(prices);
      setLastUpdate(new Date().toLocaleTimeString('es-ES'));
    } catch (error) {
      console.error('Error loading trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Trading en Tiempo Real</h1>
            <p className="text-gray-400">
              Datos actualizados: {lastUpdate || 'Cargando...'}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title={showValues ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={loadTradingData}
              disabled={loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Tabla de criptomonedas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cryptos.map((crypto) => (
            <div
              key={crypto.symbol}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
            >
              {/* Encabezado */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{crypto.name}</h3>
                  <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  crypto.priceChangePercent24h >= 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {crypto.priceChangePercent24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {crypto.priceChangePercent24h >= 0 ? '+' : ''}
                    {crypto.priceChangePercent24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Precio actual */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Precio Actual</p>
                <p className="text-3xl font-bold">
                  {showValues ? formatPrice(crypto.price) : '••••'}
                </p>
                <p className={`text-sm mt-1 ${
                  crypto.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {crypto.priceChange24h >= 0 ? '+' : ''}
                  {showValues ? formatPrice(crypto.priceChange24h) : '••••'} en 24h
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Cap. de Mercado
                  </p>
                  <p className="font-semibold">
                    {showValues ? '$' + formatNumber(crypto.marketCap) : '••••'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Vol. 24h
                  </p>
                  <p className="font-semibold">
                    {showValues ? '$' + formatNumber(crypto.volume24h) : '••••'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Suministro Circulante
                  </p>
                  <p className="font-semibold">
                    {showValues ? formatNumber(crypto.circulatingSupply) + ' ' + crypto.symbol : '••••'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Información */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 Los datos se actualizan automáticamente cada minuto. Haz clic en "Actualizar" para obtener datos en tiempo real.
            Los precios provienen de CoinGecko y Binance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;
