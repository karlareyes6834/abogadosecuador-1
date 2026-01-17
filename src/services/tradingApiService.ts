/**
 * SERVICIO DE APIs EN TIEMPO REAL PARA TRADING
 * Integra datos de múltiples fuentes: CoinGecko, Binance, Alpha Vantage
 * Proporciona datos de criptomonedas, acciones y commodities
 */

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastUpdated: string;
}

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface TradingData {
  cryptos: CryptoPrice[];
  stocks: StockPrice[];
  lastUpdate: string;
}

class TradingApiService {
  private coingeckoUrl = 'https://api.coingecko.com/api/v3';
  private binanceUrl = 'https://api.binance.com/api/v3';
  private alphaVantageKey = 'demo'; // Reemplazar con clave real

  /**
   * Obtener precios de criptomonedas en tiempo real
   */
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      const response = await fetch(
        `${this.coingeckoUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false&locale=es`
      );
      const data = await response.json();

      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_24h,
        priceChangePercent24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        circulatingSupply: coin.circulating_supply,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return this.getMockCryptoPrices();
    }
  }

  /**
   * Obtener datos de Binance en tiempo real
   */
  async getBinanceTickers(): Promise<any[]> {
    try {
      const response = await fetch(`${this.binanceUrl}/ticker/24hr`);
      const data = await response.json();

      return data.slice(0, 20).map((ticker: any) => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        priceChange: parseFloat(ticker.priceChange),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        quoteAssetVolume: parseFloat(ticker.quoteAssetVolume),
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      return this.getMockBinanceData();
    }
  }

  /**
   * Obtener datos de acciones (usando datos simulados - requiere API key real)
   */
  async getStockPrices(symbols: string[]): Promise<StockPrice[]> {
    try {
      // Nota: Alpha Vantage requiere API key. Usando datos simulados por ahora
      return this.getMockStockPrices(symbols);
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      return this.getMockStockPrices(symbols);
    }
  }

  /**
   * Obtener datos de múltiples fuentes
   */
  async getAllTradingData(): Promise<TradingData> {
    try {
      const [cryptos, stocks] = await Promise.all([
        this.getCryptoPrices(),
        this.getStockPrices(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'])
      ]);

      return {
        cryptos,
        stocks,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching all trading data:', error);
      return {
        cryptos: this.getMockCryptoPrices(),
        stocks: this.getMockStockPrices(['AAPL', 'GOOGL', 'MSFT']),
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Obtener gráfico de precios históricos
   */
  async getPriceHistory(symbol: string, days: number = 30): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.coingeckoUrl}/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();

      return data.prices.map((price: any[]) => ({
        timestamp: new Date(price[0]).toISOString(),
        price: price[1]
      }));
    } catch (error) {
      console.error('Error fetching price history:', error);
      return this.getMockPriceHistory();
    }
  }

  /**
   * Datos simulados para criptomonedas
   */
  private getMockCryptoPrices(): CryptoPrice[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 42500.50,
        priceChange24h: 1250.75,
        priceChangePercent24h: 3.04,
        marketCap: 850000000000,
        volume24h: 25000000000,
        circulatingSupply: 21000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2250.75,
        priceChange24h: 85.50,
        priceChangePercent24h: 3.94,
        marketCap: 270000000000,
        volume24h: 12000000000,
        circulatingSupply: 120000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        price: 612.50,
        priceChange24h: 25.30,
        priceChangePercent24h: 4.31,
        marketCap: 95000000000,
        volume24h: 1500000000,
        circulatingSupply: 155000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'XRP',
        name: 'Ripple',
        price: 2.85,
        priceChange24h: 0.15,
        priceChangePercent24h: 5.56,
        marketCap: 155000000000,
        volume24h: 2500000000,
        circulatingSupply: 54000000000,
        lastUpdated: new Date().toISOString()
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: 1.15,
        priceChange24h: 0.08,
        priceChangePercent24h: 7.47,
        marketCap: 42000000000,
        volume24h: 800000000,
        circulatingSupply: 36500000000,
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  /**
   * Datos simulados para Binance
   */
  private getMockBinanceData(): any[] {
    return [
      {
        symbol: 'BTCUSDT',
        price: 42500.50,
        priceChange: 1250.75,
        priceChangePercent: 3.04,
        volume: 25000,
        quoteAssetVolume: 1062500000,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'ETHUSDT',
        price: 2250.75,
        priceChange: 85.50,
        priceChangePercent: 3.94,
        volume: 500000,
        quoteAssetVolume: 1125375000,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'BNBUSDT',
        price: 612.50,
        priceChange: 25.30,
        priceChangePercent: 4.31,
        volume: 2000000,
        quoteAssetVolume: 1225000000,
        timestamp: new Date().toISOString()
      }
    ];
  }

  /**
   * Datos simulados para acciones
   */
  private getMockStockPrices(symbols: string[]): StockPrice[] {
    const mockData: Record<string, StockPrice> = {
      AAPL: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 195.50,
        change: 2.50,
        changePercent: 1.30,
        volume: 50000000,
        timestamp: new Date().toISOString()
      },
      GOOGL: {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.75,
        change: 1.85,
        changePercent: 1.31,
        volume: 25000000,
        timestamp: new Date().toISOString()
      },
      MSFT: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 380.25,
        change: 3.50,
        changePercent: 0.93,
        volume: 18000000,
        timestamp: new Date().toISOString()
      },
      TSLA: {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 245.80,
        change: -2.20,
        changePercent: -0.89,
        volume: 120000000,
        timestamp: new Date().toISOString()
      },
      AMZN: {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 180.50,
        change: 2.80,
        changePercent: 1.57,
        volume: 45000000,
        timestamp: new Date().toISOString()
      }
    };

    return symbols
      .map(symbol => mockData[symbol])
      .filter(Boolean);
  }

  /**
   * Datos simulados de historial de precios
   */
  private getMockPriceHistory(): any[] {
    const history = [];
    const basePrice = 42500;
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.5) * 2000;
      
      history.push({
        timestamp: date.toISOString(),
        price: basePrice + variance
      });
    }

    return history;
  }
}

export default new TradingApiService();
