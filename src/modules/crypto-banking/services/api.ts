import {
  User, Asset, Transaction, FixedTermPlan, FixedInvestment,
  P2POffer, P2POrder, TraderProfile, CopyPosition, BinaryPosition,
  PendingOrder, TradingBot, UserScript, UserTier, Language,
  AssetType, WalletPocket, Challenge, CopySettings, Theme, Quest, NewsItem,
  FuturePosition, SocialPost
} from '../types';

const DB_KEYS = {
  USER: 'wi_user',
  BALANCES: 'wi_balances',
  TRANSACTIONS: 'wi_transactions',
  STAKING: 'wi_staking',
  FIXED_INV: 'wi_fixed_inv',
  FUTURES: 'wi_futures',
  BINARY: 'wi_binary',
  COPY_POS: 'wi_copy_pos',
  LANG: 'wi_lang',
  ORDERS: 'wi_orders',
  ALERTS: 'wi_alerts',
  P2P_ORDERS: 'wi_p2p_orders',
  TRADING_BOTS: 'wi_bots',
  SCRIPTS: 'wi_scripts',
  LINKED_CARDS: 'wi_cards',
  SUPPORT_TICKETS: 'wi_tickets',
  SOCIAL_FEED: 'wi_social'
};

export const PRICES: Record<string, number> = {
  BTC: 64230.50, ETH: 3450.20, EQC: 2.85, NEX: 1.45, USDT: 1.00,
  SOL: 145.20, ADA: 0.45, DOT: 7.20, MATIC: 0.85, XRP: 0.62, DOGE: 0.16, SHIB: 0.000028,
  LTC: 85.20, BCH: 450.10, LINK: 18.50, ATOM: 11.20,
  USD: 1.00, EUR: 1.08, GBP: 1.25, JPY: 0.0065, AUD: 0.65, CAD: 0.73, CNY: 0.14,
  AAPL: 172.40, TSLA: 178.90, SPY: 512.30, NVDA: 885.60, MSFT: 420.50,
  GOOGL: 175.30, META: 495.20, AMZN: 185.10, QQQ: 440.00, DJI: 38500.00, SPX: 5200.00,
  NFLX: 620.00, AMD: 170.50, INTC: 35.40, COIN: 250.00,
  XAU: 2350.00, XAG: 28.50, OIL: 85.50, NG: 1.80, PLAT: 950.00, PAL: 1050.00,
  'EUR/USD': 1.08, 'GBP/USD': 1.25, 'USD/JPY': 151.20, 'AUD/USD': 0.65, 'USD/CAD': 1.36
};

const VOLATILITY: Record<string, number> = {
    BTC: 0.02, ETH: 0.025, EQC: 0.05, TSLA: 0.03, NVDA: 0.04, META: 0.03,
    XAU: 0.005, EUR: 0.002, 'EUR/USD': 0.002
};

const MARKET_STATS: Record<string, {change: number, vol: number}> = {};

Object.keys(PRICES).forEach(k => {
    if(k !== 'USD') {
        MARKET_STATS[k] = {
            change: (Math.random() * 10) - 5,
            vol: Math.floor(Math.random() * 500) + 10
        };
    }
});

const DICTIONARY: Record<Language, Record<string, string>> = {
  ES: {
    'nav.home': 'Inicio', 'nav.market': 'Mercado', 'nav.wallet': 'Billetera', 'nav.p2p': 'P2P', 'nav.invest': 'Inversiones',
    'nav.binary': 'Binarias', 'nav.copy': 'Copy Trading', 'nav.referrals': 'Referidos', 'nav.settings': 'Ajustes',
    'nav.system': 'Arquitectura', 'nav.plans': 'Planes Pro', 'nav.logout': 'Cerrar Sesión',
    'ex.spot': 'Spot', 'ex.futures': 'Futuros', 'ex.stocks': 'Acciones', 'ex.forex': 'Forex', 'ex.convert': 'Convertir',
    'ex.buy': 'Comprar', 'ex.sell': 'Vender', 'ex.long': 'Long', 'ex.short': 'Short',
    'ex.positions': 'Posiciones', 'ex.orders': 'Órdenes', 'ex.history': 'Historial'
  },
  EN: {
    'nav.home': 'Dashboard', 'nav.market': 'Exchange', 'nav.wallet': 'Wallet', 'nav.p2p': 'P2P', 'nav.invest': 'Invest',
    'nav.binary': 'Binary', 'nav.copy': 'Copy Trading', 'nav.referrals': 'Referrals', 'nav.settings': 'Settings',
    'nav.system': 'System', 'nav.plans': 'Pro Plans', 'nav.logout': 'Logout',
    'ex.spot': 'Spot', 'ex.futures': 'Futures', 'ex.stocks': 'Stocks', 'ex.forex': 'Forex', 'ex.convert': 'Convert',
    'ex.buy': 'Buy', 'ex.sell': 'Sell', 'ex.long': 'Long', 'ex.short': 'Short',
    'ex.positions': 'Positions', 'ex.orders': 'Orders', 'ex.history': 'History'
  },
  FR: {
    'nav.home': 'Tableau', 'nav.market': 'Marché', 'nav.wallet': 'Portefeuille', 'nav.p2p': 'P2P', 'nav.invest': 'Investir',
    'nav.binary': 'Binaires', 'nav.copy': 'Copy Trading', 'nav.referrals': 'Parrainage', 'nav.settings': 'Paramètres',
    'nav.system': 'Système', 'nav.plans': 'Plans Pro', 'nav.logout': 'Déconnexion',
    'ex.spot': 'Spot', 'ex.futures': 'Futures', 'ex.stocks': 'Actions', 'ex.forex': 'Forex', 'ex.convert': 'Convertir',
    'ex.buy': 'Acheter', 'ex.sell': 'Vendre', 'ex.long': 'Long', 'ex.short': 'Court',
    'ex.positions': 'Positions', 'ex.orders': 'Ordres', 'ex.history': 'Historique'
  },
  ZH: {
    'nav.home': '首页', 'nav.market': '市场', 'nav.wallet': '钱包', 'nav.p2p': 'P2P', 'nav.invest': '投资',
    'nav.binary': '二元期权', 'nav.copy': '跟单交易', 'nav.referrals': '推荐', 'nav.settings': '设置',
    'nav.system': '系统架构', 'nav.plans': '会员计划', 'nav.logout': '登出',
    'ex.spot': '现货', 'ex.futures': '期货', 'ex.stocks': '股票', 'ex.forex': '外汇', 'ex.convert': '兑换',
    'ex.buy': '买入', 'ex.sell': '卖出', 'ex.long': '做多', 'ex.short': '做空',
    'ex.positions': '持仓', 'ex.orders': '订单', 'ex.history': '历史'
  }
};

export const t = (key: string, lang: Language): string => {
   return DICTIONARY[lang]?.[key] || DICTIONARY['EN'][key] || key; 
};

export const fetchLivePrices = async () => {
  try {
    Object.keys(PRICES).forEach(k => {
      if(k !== 'USD' && k !== 'USDT') {
         const vol = VOLATILITY[k] || 0.01;
         const change = 1 + ((Math.random() * vol * 0.1) - (vol*0.05)); 
         PRICES[k] = parseFloat((PRICES[k] * change).toFixed(k.includes('USD') || k === 'XRP' || k === 'DOGE' ? 4 : 2));
      }
    });
    // Critical: Run checks
    WalletService.checkBinaryExpiries();
    WalletService.checkPriceAlerts();
    WalletService.checkBinaryPending();
    WalletService.triggerPendingOrders();
    WalletService.checkMaturedInvestments();
    WalletService.runBots();
  } catch (error) { console.warn("Price fetch error"); }
  return PRICES;
};

export const getChartData = (symbol: string, period: string) => {
    const data = [];
    let price = PRICES[symbol] || 100;
    const now = new Date();
    const vol = VOLATILITY[symbol] || 0.02;

    let intervalMs = 60000; 
    let count = 60;
    
    if (period.includes('s')) { intervalMs = parseInt(period) * 1000; count = 100; } 
    else if (period.includes('m')) { intervalMs = parseInt(period) * 60000; count = 80; } 
    else if (period.includes('h')) { intervalMs = parseInt(period) * 3600000; count = 60; } 
    else if (period.includes('d')) { intervalMs = parseInt(period) * 86400000; count = 40; }

    for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() - (count - i) * intervalMs);
        const open = price;
        const change = (Math.random() * vol) - (vol/2);
        const close = open * (1 + change);
        
        const maxVal = Math.max(open, close);
        const minVal = Math.min(open, close);
        const high = maxVal * (1 + Math.random() * (vol * 0.2));
        const low = minVal * (1 - Math.random() * (vol * 0.2));
        const volume = Math.floor(Math.random() * 10000 + 1000);
        
        let label = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if (period.includes('s')) label = time.toLocaleTimeString([], {minute:'2-digit', second:'2-digit'});
        if (period === '1d' || period === '1M' || period === '1Y') label = time.toLocaleDateString();
        
        data.push({
            time: label,
            open, high, low, close, volume,
            value: close 
        });
        price = close;
    }
    return data;
};

export const calculateHeikinAshi = (data: any[]) => {
    if(data.length === 0) return [];
    const haData = [];
    let prevOpen = data[0].open;
    let prevClose = data[0].close;

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const haClose = (d.open + d.high + d.low + d.close) / 4;
        const haOpen = i === 0 ? d.open : (prevOpen + prevClose) / 2;
        const haHigh = Math.max(d.high, haOpen, haClose);
        const haLow = Math.min(d.low, haOpen, haClose);
        
        haData.push({ ...d, open: haOpen, close: haClose, high: haHigh, low: haLow });
        prevOpen = haOpen;
        prevClose = haClose;
    }
    return haData;
};

export class AuthService {
  static getCurrentUser(): User | null {
    const data = localStorage.getItem(DB_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  static async login(email: string, pass: string): Promise<User> {
    await new Promise(r => setTimeout(r, 800)); 
    const saved = localStorage.getItem(DB_KEYS.USER);
    if(saved) {
        const u = JSON.parse(saved);
        u.streak = u.streak || 5;
        u.xp = u.xp || 1200;
        u.level = u.level || 3;
        u.theme = u.theme || 'NEXUS';
        return u;
    }

    const user: User = {
      id: 'U-' + Math.floor(Math.random() * 10000),
      email,
      name: email.split('@')[0],
      tier: 'STANDARD',
      isVerified: true,
      joinedAt: new Date().toISOString(),
      language: 'ES',
      theme: 'NEXUS',
      xp: 1200,
      level: 3,
      streak: 5
    };
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
    return user;
  }

  static async register(email: string, pass: string, name: string): Promise<User> {
    return this.login(email, pass);
  }

  static logout() {
    localStorage.removeItem(DB_KEYS.USER);
  }

  static setTheme(theme: Theme) {
      const u = this.getCurrentUser();
      if(u) {
          u.theme = theme;
          localStorage.setItem(DB_KEYS.USER, JSON.stringify(u));
      }
  }

  static upgradeTier(tier: UserTier, price: number) {
      const u = this.getCurrentUser();
      if(u) {
          u.tier = tier;
          localStorage.setItem(DB_KEYS.USER, JSON.stringify(u));
          WalletService.withdraw(price, 'USD', 'Plan Upgrade');
      }
  }
}

export class WalletService {
  static getBalances(): Asset[] {
    const data = localStorage.getItem(DB_KEYS.BALANCES);
    return data ? JSON.parse(data) : [
        { symbol: 'USD', name: 'US Dollar', balance: 10000, valueUsd: 1, type: 'FIAT' },
        { symbol: 'BTC', name: 'Bitcoin', balance: 0.05, valueUsd: PRICES['BTC'], type: 'CRYPTO' }
    ];
  }
  
  static saveBalances(balances: Asset[]) {
    localStorage.setItem(DB_KEYS.BALANCES, JSON.stringify(balances));
  }

  static getHistory(): Transaction[] {
      const data = localStorage.getItem(DB_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
  }

  static addTransaction(tx: Transaction) {
      const hist = WalletService.getHistory();
      hist.unshift(tx);
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(hist));
  }

  static deposit(amount: number, method: string) {
      const bals = WalletService.getBalances();
      const usd = bals.find(b => b.symbol === 'USD');
      if(usd) usd.balance += amount;
      else bals.push({ symbol: 'USD', name: 'US Dollar', balance: amount, valueUsd: 1, type: 'FIAT' });
      WalletService.saveBalances(bals);
      
      WalletService.addTransaction({
          id: 'TX-'+Date.now(), referenceId: 'DEP-'+Math.floor(Math.random()*10000),
          type: 'DEPOSIT', direction: 'INCOME', amount, asset: 'USD',
          fee: 0, feeAsset: 'USD', status: 'COMPLETED', date: new Date().toISOString(),
          description: `Deposit via ${method}`, balanceAfter: usd ? usd.balance : amount
      });
  }

  static withdraw(amount: number, asset: string, method: string) {
      const bals = WalletService.getBalances();
      const bal = bals.find(b => b.symbol === asset);
      if(!bal || bal.balance < amount + 5) throw new Error("Insufficient Balance");
      
      bal.balance -= (amount + 5);
      WalletService.saveBalances(bals);
      
      WalletService.addTransaction({
          id: 'TX-'+Date.now(), referenceId: 'WTH-'+Math.floor(Math.random()*10000),
          type: 'WITHDRAW', direction: 'OUTCOME', amount, asset,
          fee: 5, feeAsset: 'USD', status: 'COMPLETED', date: new Date().toISOString(),
          description: `Withdraw to ${method}`, balanceAfter: bal.balance
      });
  }

  static moveFundsBetweenPockets(fromPocket: WalletPocket, toPocket: WalletPocket, asset: string, amount: number) {
      if(fromPocket === toPocket) throw new Error("Source and Destination cannot be the same");
      const bals = WalletService.getBalances();
      
      let sourceAssetSymbol = asset;
      let destAssetSymbol = asset;

      if(fromPocket === 'FIAT' && toPocket === 'CRYPTO') {
          if(asset === 'USD') destAssetSymbol = 'USDT'; 
      }
      else if(fromPocket === 'CRYPTO' && toPocket === 'FIAT') {
          destAssetSymbol = 'USD';
      }
      
      const currentAsset = bals.find(b => b.symbol === sourceAssetSymbol);
      if(!currentAsset || currentAsset.balance < amount) throw new Error(`Insufficient ${sourceAssetSymbol}`);

      const sourcePrice = PRICES[sourceAssetSymbol] || 1;
      const destPrice = PRICES[destAssetSymbol] || 1;
      const destAmount = (amount * sourcePrice) / destPrice;

      currentAsset.balance -= amount;
      
      const destAsset = bals.find(b => b.symbol === destAssetSymbol);
      if(destAsset) {
          destAsset.balance += destAmount;
      } else {
          let newType = 'CRYPTO';
          if(toPocket === 'FIAT') newType = 'FIAT';
          if(toPocket === 'INVEST' && ['AAPL','TSLA'].includes(destAssetSymbol)) newType = 'STOCK';

          bals.push({
              symbol: destAssetSymbol,
              name: destAssetSymbol,
              balance: destAmount,
              valueUsd: destPrice,
              type: newType as any
          });
      }
      WalletService.saveBalances(bals);
      WalletService.addTransaction({
          id: 'TX-'+Date.now(), referenceId: 'MOV-'+Math.floor(Math.random()*10000),
          type: 'INTERNAL_MOVE', direction: 'OUTCOME', amount, asset: sourceAssetSymbol,
          fee: 0, feeAsset: sourceAssetSymbol, status: 'COMPLETED', date: new Date().toISOString(),
          description: `Move ${fromPocket} to ${toPocket} (${destAssetSymbol})`, balanceAfter: currentAsset.balance
      });
  }

  static transferInternal(to: string, amount: number, asset: string) {
       const bals = WalletService.getBalances();
       const bal = bals.find(b => b.symbol === asset);
       if(!bal || bal.balance < amount) throw new Error("Insufficient Balance");
       
       bal.balance -= amount;
       WalletService.saveBalances(bals);
       
       WalletService.addTransaction({
          id: 'TX-'+Date.now(), referenceId: 'INT-'+Math.floor(Math.random()*10000),
          type: 'TRANSFER_INTERNAL', direction: 'OUTCOME', amount, asset, recipient: to,
          fee: 0, feeAsset: asset, status: 'COMPLETED', date: new Date().toISOString(),
          description: `Transfer to ${to}`, balanceAfter: bal.balance
      });
  }

  static tradeSpot(buyAsset: string, sellAsset: string, sellAmount: number) {
       const bals = WalletService.getBalances();
       const sellBal = bals.find(b => b.symbol === sellAsset);
       if(!sellBal || sellBal.balance < sellAmount) throw new Error(`Insufficient ${sellAsset}`);
       
       const buyPrice = PRICES[buyAsset];
       const sellPrice = PRICES[sellAsset];
       const buyAmount = (sellAmount * sellPrice) / buyPrice;
       
       sellBal.balance -= sellAmount;
       const buyBal = bals.find(b => b.symbol === buyAsset);
       if(buyBal) buyBal.balance += buyAmount;
       else bals.push({ symbol: buyAsset, name: buyAsset, balance: buyAmount, valueUsd: buyPrice, type: 'CRYPTO' });
       
       WalletService.saveBalances(bals);
       return { buyAmount };
  }

  // --- FUTURES ---
  static getFuturesPositions(): FuturePosition[] {
      const d = localStorage.getItem(DB_KEYS.FUTURES);
      return d ? JSON.parse(d) : [];
  }
  
  static openFuturePosition(symbol: string, marginAmount: number, direction: 'LONG'|'SHORT', leverage: number) {
      const bals = WalletService.getBalances();
      const usd = bals.find(b => b.symbol === 'USD');
      if(!usd || usd.balance < marginAmount) throw new Error("Insufficient USD Margin");
      
      usd.balance -= marginAmount;
      WalletService.saveBalances(bals);

      const positions = WalletService.getFuturesPositions();
      const entryPrice = PRICES[symbol];
      const amount = (marginAmount * leverage) / entryPrice;

      const newPos: FuturePosition = {
          id: 'POS-' + Date.now(), symbol, leverage, margin: marginAmount, entryPrice, amount, direction, pnl: 0, isOpen: true,
          liquidationPrice: direction === 'LONG' ? entryPrice * (1 - (1/leverage)) : entryPrice * (1 + (1/leverage))
      };
      positions.push(newPos);
      localStorage.setItem(DB_KEYS.FUTURES, JSON.stringify(positions));
  }

  static closeFuturePosition(id: string): number {
      const positions = WalletService.getFuturesPositions();
      const idx = positions.findIndex(p => p.id === id);
      if(idx === -1) throw new Error("Position not found");
      const pos = positions[idx];
      const currentPrice = PRICES[pos.symbol] || pos.entryPrice;
      const pnl = (pos.direction === 'LONG' ? 1 : -1) * (currentPrice - pos.entryPrice) * pos.amount;
      const totalReturn = pos.margin + pnl;
      
      const bals = WalletService.getBalances();
      const usd = bals.find(b => b.symbol === 'USD');
      if(usd) usd.balance += totalReturn;
      WalletService.saveBalances(bals);
      
      positions.splice(idx, 1);
      localStorage.setItem(DB_KEYS.FUTURES, JSON.stringify(positions));
      return pnl;
  }

  // --- BINARY ---
  static getBinaryPositions(): BinaryPosition[] {
      const d = localStorage.getItem(DB_KEYS.BINARY);
      return d ? JSON.parse(d) : [];
  }

  static openBinaryOption(symbol: string, amount: number, direction: 'CALL'|'PUT', duration: number) {
      const bals = WalletService.getBalances();
      const usd = bals.find(b => b.symbol === 'USD');
      if(!usd || usd.balance < amount) throw new Error("Insufficient Balance");
      
      usd.balance -= amount;
      WalletService.saveBalances(bals);

      const positions = WalletService.getBinaryPositions();
      positions.push({
          id: Date.now().toString(), asset: symbol, amount, direction, 
          entryPrice: PRICES[symbol], strikePrice: PRICES[symbol], payoutPercent: 0.88,
          startTime: new Date().toISOString(), expiryTime: new Date(Date.now() + duration * 1000).toISOString(),
          status: 'ACTIVE', resultAmount: 0, orderType: 'MARKET'
      });
      localStorage.setItem(DB_KEYS.BINARY, JSON.stringify(positions));
  }

  static checkBinaryExpiries() {
      const positions = WalletService.getBinaryPositions();
      let changed = false;
      const now = new Date();
      positions.forEach(p => {
          if (p.status === 'ACTIVE' && new Date(p.expiryTime) <= now) {
              const currentPrice = PRICES[p.asset];
              const isWin = (p.direction === 'CALL' && currentPrice > p.strikePrice) || (p.direction === 'PUT' && currentPrice < p.strikePrice);
              p.status = isWin ? 'WON' : 'LOST';
              if(isWin) {
                  p.resultAmount = p.amount * (1 + p.payoutPercent);
                  const bals = WalletService.getBalances();
                  const usd = bals.find(b => b.symbol === 'USD');
                  if(usd) usd.balance += p.resultAmount;
                  WalletService.saveBalances(bals);
              }
              changed = true;
          }
      });
      if(changed) localStorage.setItem(DB_KEYS.BINARY, JSON.stringify(positions));
  }

  static placePendingBinary(symbol: string, amount: number, direction: 'CALL'|'PUT', duration: number, targetPrice: number) {
      const positions = WalletService.getBinaryPositions();
      positions.push({
          id: Date.now().toString(), asset: symbol, amount, direction, targetPrice,
          entryPrice: 0, strikePrice: 0, payoutPercent: 0.88,
          startTime: '', expiryTime: '',
          status: 'PENDING', resultAmount: 0, orderType: 'PENDING'
      });
      localStorage.setItem(DB_KEYS.BINARY, JSON.stringify(positions));
  }

  static checkBinaryPending() {
      const positions = WalletService.getBinaryPositions();
      let changed = false;
      positions.forEach(p => {
          if(p.status === 'PENDING' && p.targetPrice) {
              const current = PRICES[p.asset];
              // Simple trigger logic: if within 0.1% range
              if(Math.abs(current - p.targetPrice) / p.targetPrice < 0.001) {
                  p.status = 'ACTIVE';
                  p.entryPrice = current;
                  p.strikePrice = current;
                  p.startTime = new Date().toISOString();
                  p.expiryTime = new Date(Date.now() + 60000).toISOString(); // Default 1m for pending
                  const bals = WalletService.getBalances();
                  const usd = bals.find(b => b.symbol === 'USD');
                  if(usd && usd.balance >= p.amount) {
                      usd.balance -= p.amount;
                      WalletService.saveBalances(bals);
                      changed = true;
                  }
              }
          }
      });
      if(changed) localStorage.setItem(DB_KEYS.BINARY, JSON.stringify(positions));
  }

  // --- GENERAL ORDERS ---
  static getPendingOrders(): PendingOrder[] {
      const d = localStorage.getItem(DB_KEYS.ORDERS);
      return d ? JSON.parse(d) : [];
  }

  static placePendingOrder(symbol: string, amount: number, direction: string, price: number) {
      const orders = WalletService.getPendingOrders();
      orders.push({ id: Date.now().toString(), symbol, amount, direction: direction as any, price, type: 'LIMIT', date: new Date().toISOString(), status: 'OPEN' });
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  }

  static cancelPendingOrder(id: string) {
      const orders = WalletService.getPendingOrders().filter(o => o.id !== id);
      localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  }

  static triggerPendingOrders() {
      // Simulation: check limit orders vs prices
  }

  static getOrderBook(symbol: string) {
      const price = PRICES[symbol] || 100;
      const spread = price * 0.0005; 
      const bids = [], asks = [];
      for(let i=0; i<12; i++) {
          bids.push({ price: price - (spread * (i+1)), amount: Math.random() * 2 });
          asks.push({ price: price + (spread * (i+1)), amount: Math.random() * 2 });
      }
      return { bids, asks };
  }

  static getMarketOverview() {
      return Object.keys(PRICES).map(s => ({ symbol: s, price: PRICES[s], change: (Math.random()*10)-5, vol: Math.random()*1000, category: 'CRYPTO' }));
  }

  // --- INVESTMENTS ---
  static getFixedTermPlans(): FixedTermPlan[] {
      return [
          { id: '1', name: 'Green Energy Bond', durationDays: 30, apy: 12, minAmount: 100, color: 'bg-green-500', risk: 'Low', description: 'Sustainable energy projects funding.', poolTotal: 1000000, poolFilled: 750000 },
          { id: '2', name: 'AI Tech Fund', durationDays: 90, apy: 18, minAmount: 500, color: 'bg-blue-500', risk: 'Medium', description: 'Investment in emerging AI startups.', poolTotal: 500000, poolFilled: 120000 },
          { id: '3', name: 'High Yield Crypto', durationDays: 180, apy: 25, minAmount: 1000, color: 'bg-purple-500', risk: 'High', description: 'DeFi yield farming aggregator.', poolTotal: 2000000, poolFilled: 1800000 }
      ];
  }

  static getFixedInvestments(): FixedInvestment[] {
      const d = localStorage.getItem(DB_KEYS.FIXED_INV);
      return d ? JSON.parse(d) : [];
  }

  static investFixedTerm(planId: string, amount: number, asset: string) {
      const plans = WalletService.getFixedTermPlans();
      const plan = plans.find(p => p.id === planId);
      if(!plan) throw new Error("Plan not found");
      
      const bals = WalletService.getBalances();
      const bal = bals.find(b => b.symbol === asset || (asset==='USDT' && b.symbol==='USD')); // Allow USD for USDT
      if(!bal || bal.balance < amount) throw new Error(`Insufficient ${asset}`);
      
      bal.balance -= amount;
      WalletService.saveBalances(bals);

      const invs = WalletService.getFixedInvestments();
      invs.push({
          id: Date.now().toString(), planName: plan.name, amount, asset,
          startDate: new Date().toISOString(),
          maturityDate: new Date(Date.now() + plan.durationDays * 86400000).toISOString(),
          projectedReturn: amount * (plan.apy / 100) * (plan.durationDays / 365),
          status: 'ACTIVE'
      });
      localStorage.setItem(DB_KEYS.FIXED_INV, JSON.stringify(invs));
  }

  static calculateAccruedInterest(inv: FixedInvestment) {
      const start = new Date(inv.startDate).getTime();
      const now = Date.now();
      const end = new Date(inv.maturityDate).getTime();
      const totalDuration = end - start;
      const elapsed = Math.min(now - start, totalDuration);
      const progress = elapsed / totalDuration;
      return inv.projectedReturn * progress;
  }

  static checkMaturedInvestments() {
      const invs = WalletService.getFixedInvestments();
      let changed = false;
      invs.forEach(inv => {
          if(inv.status === 'ACTIVE' && new Date() >= new Date(inv.maturityDate)) {
              inv.status = 'MATURED';
              const bals = WalletService.getBalances();
              const usd = bals.find(b => b.symbol === 'USD');
              if(usd) usd.balance += (inv.amount + inv.projectedReturn);
              WalletService.saveBalances(bals);
              changed = true;
          }
      });
      if(changed) localStorage.setItem(DB_KEYS.FIXED_INV, JSON.stringify(invs));
  }

  // --- TRADERS / COPY ---
  static getTraders(): TraderProfile[] {
      return [
          { id: 't1', name: 'AlexReturns', avatar: '', roi: 145, winRate: 78, followers: 1200, aum: 500000, riskScore: 4, description: 'Conservative growth.', topPair: 'BTC/USDT', badges: ['Safe Haven', 'Verified'], chartHistory: [10,12,15,14,18,22,25] },
          { id: 't2', name: 'CryptoKing', avatar: '', roi: 320, winRate: 65, followers: 3500, aum: 1200000, riskScore: 8, description: 'High risk high reward.', topPair: 'ETH/USDT', badges: ['Whale', 'Elite'], chartHistory: [10,20,15,30,25,40,60] },
      ];
  }

  static getCopyPositions(): CopyPosition[] {
      const d = localStorage.getItem(DB_KEYS.COPY_POS);
      return d ? JSON.parse(d) : [];
  }

  static copyTrader(traderId: string, amount: number, settings: CopySettings) {
      const bals = WalletService.getBalances();
      const usd = bals.find(b => b.symbol === 'USD');
      if(!usd || usd.balance < amount) throw new Error("Insufficient Balance");
      usd.balance -= amount;
      WalletService.saveBalances(bals);

      const positions = WalletService.getCopyPositions();
      const traders = WalletService.getTraders();
      const trader = traders.find(t => t.id === traderId);
      
      positions.push({
          id: Date.now().toString(), traderId, traderName: trader?.name || 'Unknown',
          allocatedAmount: amount, currentValue: amount, pnl: 0, startDate: new Date().toISOString(), settings
      });
      localStorage.setItem(DB_KEYS.COPY_POS, JSON.stringify(positions));
  }

  static getSocialFeed(): SocialPost[] {
      const d = localStorage.getItem(DB_KEYS.SOCIAL_FEED);
      if (d) return JSON.parse(d);
      return [
          { id: '1', userId: 't1', userName: 'AlexReturns', avatar: '', content: 'Bitcoin looking strong at support level. Long 50x.', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 45, shares: 12 },
          { id: '2', userId: 't2', userName: 'CryptoKing', avatar: '', content: 'Just closed my ETH short. +400% profit! 🚀', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 120, shares: 34 }
      ];
  }

  static postSocialUpdate(content: string) {
      const posts = WalletService.getSocialFeed();
      const user = AuthService.getCurrentUser();
      if(!user) return;
      
      posts.unshift({
          id: 'p-' + Date.now(),
          userId: user.id,
          userName: user.name,
          avatar: '',
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          shares: 0
      });
      localStorage.setItem(DB_KEYS.SOCIAL_FEED, JSON.stringify(posts));
  }

  // --- MISC ---
  static getNews(): NewsItem[] {
      return [
          { id: '1', title: 'Bitcoin Hits New High', source: 'NexusNews', time: '2h ago', sentiment: 'POSITIVE', category: 'Market' },
          { id: '2', title: 'Regulatory Updates in EU', source: 'CoinDesk', time: '5h ago', sentiment: 'NEUTRAL', category: 'Regulation' }
      ];
  }

  static getTrivia() {
      return { question: 'What is the max supply of Bitcoin?', options: ['21 Million', '18 Million', 'Infinite'], answer: '21 Million' };
  }

  static getQuests(): Quest[] {
      return [
          { id: 'q1', title: 'First Trade', description: 'Complete one spot trade', xpReward: 100, completed: false, icon: 'Zap' },
          { id: 'q2', title: 'Safe Saver', description: 'Subscribe to an Earn plan', xpReward: 200, completed: true, icon: 'Shield' }
      ];
  }

  static getChallenges(): Challenge[] {
      return [
          { id: 'c1', title: 'Weekly ROI Race', description: 'Highest ROI wins 1000 USDT', reward: '1000 USDT', participants: 450, timeLeft: '2d 4h', status: 'ACTIVE' }
      ];
  }

  static getScripts(): UserScript[] {
      const d = localStorage.getItem(DB_KEYS.SCRIPTS);
      return d ? JSON.parse(d) : [];
  }
  static saveScript(script: UserScript) {
      const scripts = WalletService.getScripts();
      scripts.push(script);
      localStorage.setItem(DB_KEYS.SCRIPTS, JSON.stringify(scripts));
  }

  static getBots(): TradingBot[] {
      const d = localStorage.getItem(DB_KEYS.TRADING_BOTS);
      return d ? JSON.parse(d) : [];
  }
  static createBot(bot: TradingBot) {
      const bots = WalletService.getBots();
      bots.push(bot);
      localStorage.setItem(DB_KEYS.TRADING_BOTS, JSON.stringify(bots));
  }
  static runBots() {
      // Sim PnL update
  }

  static checkPriceAlerts() {
      // Sim alert check
  }
  static createAlert(symbol: string, price: number) {}
  static getAlerts() { return []; }

  // --- SUPPORT & CARDS ---
  static createSupportTicket(subject: string, description: string) {
      const tickets = JSON.parse(localStorage.getItem(DB_KEYS.SUPPORT_TICKETS) || '[]');
      tickets.push({ id: Date.now(), subject, description, status: 'OPEN', date: new Date().toISOString() });
      localStorage.setItem(DB_KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
  }

  static getLinkedCards(): {id: string, last4: string, brand: string}[] {
      const cards = localStorage.getItem(DB_KEYS.LINKED_CARDS);
      return cards ? JSON.parse(cards) : [];
  }

  static addCard(number: string, expiry: string, cvc: string) {
      const cards = WalletService.getLinkedCards();
      cards.push({ id: Date.now().toString(), last4: number.slice(-4), brand: 'Visa' }); // Mock
      localStorage.setItem(DB_KEYS.LINKED_CARDS, JSON.stringify(cards));
  }

  // --- P2P ---
  static getP2POrders(): P2POrder[] {
      const d = localStorage.getItem(DB_KEYS.P2P_ORDERS);
      return d ? JSON.parse(d) : [];
  }
  static createP2POrder(offer: P2POffer, amount: number): P2POrder {
      const orders = WalletService.getP2POrders();
      const order: P2POrder = {
          id: 'ORD-'+Date.now(), offerId: offer.id, type: offer.type==='SELL'?'BUY':'SELL',
          asset: offer.asset, fiat: offer.fiat, amountAsset: amount/offer.price, amountFiat: amount,
          price: offer.price, merchant: offer.merchant, status: 'CREATED',
          chatHistory: [], createdAt: new Date().toISOString()
      };
      orders.push(order);
      localStorage.setItem(DB_KEYS.P2P_ORDERS, JSON.stringify(orders));
      return order;
  }
  static updateP2POrder(id: string, update: Partial<P2POrder>) {
      const orders = WalletService.getP2POrders();
      const idx = orders.findIndex(o => o.id === id);
      if(idx !== -1) {
          orders[idx] = { ...orders[idx], ...update };
          localStorage.setItem(DB_KEYS.P2P_ORDERS, JSON.stringify(orders));
          return orders[idx];
      }
      throw new Error("Order not found");
  }
  static addP2PChat(id: string, message: string, sender: any) {
      const orders = WalletService.getP2POrders();
      const idx = orders.findIndex(o => o.id === id);
      if(idx !== -1) {
          orders[idx].chatHistory.push({ sender, message, time: new Date().toISOString() });
          localStorage.setItem(DB_KEYS.P2P_ORDERS, JSON.stringify(orders));
      }
  }
}
