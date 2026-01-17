
export enum Tab {
  DASHBOARD = 'DASHBOARD',
  EXCHANGE = 'EXCHANGE',
  WALLET = 'WALLET',
  P2P = 'P2P',
  STAKING = 'STAKING',
  BINARY = 'BINARY',
  REFERRALS = 'REFERRALS',
  SETTINGS = 'SETTINGS',
  ARCHITECTURE = 'ARCHITECTURE',
  COPY_TRADING = 'COPY_TRADING',
  PLANS = 'PLANS'
}

export enum CryptoSymbol {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  EQC = 'EQC', // WI Global Native Token
  NEX = 'NEX',
  SOL = 'SOL',
  ADA = 'ADA',
  DOT = 'DOT',
  MATIC = 'MATIC',
  XRP = 'XRP',
  DOGE = 'DOGE',
  SHIB = 'SHIB',
  LTC = 'LTC',
  BCH = 'BCH',
  LINK = 'LINK',
  ATOM = 'ATOM'
}

export enum FiatSymbol {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  AUD = 'AUD',
  CAD = 'CAD',
  CNY = 'CNY'
}

export enum StockSymbol {
  AAPL = 'AAPL',
  TSLA = 'TSLA',
  SPY = 'SPY', // S&P 500
  NVDA = 'NVDA',
  MSFT = 'MSFT',
  GOOGL = 'GOOGL',
  META = 'META',
  AMZN = 'AMZN',
  QQQ = 'QQQ', // Nasdaq 100
  DJI = 'DJI', // Dow Jones
  SPX = 'SPX',  // S&P 500 Index
  NFLX = 'NFLX',
  AMD = 'AMD',
  INTC = 'INTC',
  COIN = 'COIN'
}

export enum CommoditySymbol {
  XAU = 'XAU', // Gold
  XAG = 'XAG', // Silver
  OIL = 'OIL', // Crude Oil
  NG = 'NG',    // Natural Gas
  PLAT = 'PLAT', // Platinum
  PAL = 'PAL'   // Palladium
}

export enum ForexSymbol {
  EURUSD = 'EUR/USD',
  GBPUSD = 'GBP/USD',
  USDJPY = 'USD/JPY',
  AUDUSD = 'AUD/USD',
  USDCAD = 'USD/CAD'
}

export type AssetType = 'CRYPTO' | 'FIAT' | 'STOCK' | 'FUTURE_POS' | 'COMMODITY' | 'FOREX';
export type Language = 'ES' | 'EN' | 'FR' | 'ZH';
export type UserTier = 'STANDARD' | 'GOLD' | 'PLATINUM';
export type ChartStyle = 'CANDLE' | 'HOLLOW_CANDLE' | 'HEIKIN' | 'LINE' | 'AREA' | 'BARS';
export type P2POrderState = 'CREATED' | 'PAID' | 'RELEASED' | 'CANCELLED' | 'DISPUTE';
export type WalletPocket = 'FIAT' | 'CRYPTO' | 'INVEST';
export type Theme = 'NEXUS' | 'LUXURY' | 'CYBER' | 'ROYAL' | 'MIDNIGHT';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  isVerified: boolean;
  joinedAt: string;
  language: Language;
  theme?: Theme;
  xp?: number;
  level?: number;
  streak?: number;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    icon: string; // Icon name
}

export interface NewsItem {
    id: string;
    title: string;
    source: string;
    time: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    category: string;
}

export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  type: AssetType;
  change24h?: number;
}

export interface FuturePosition {
  id: string;
  symbol: string;
  leverage: number;
  margin: number;
  entryPrice: number;
  amount: number;
  direction: 'LONG' | 'SHORT';
  pnl?: number;
  pnlPercent?: number;
  isOpen: boolean;
  liquidationPrice?: number;
}

export interface BinaryPosition {
  id: string;
  asset: string;
  amount: number;
  direction: 'CALL' | 'PUT'; 
  entryPrice: number;
  strikePrice: number;
  payoutPercent: number;
  startTime: string;
  expiryTime: string;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'PENDING';
  resultAmount: number;
  orderType: 'MARKET' | 'PENDING';
  targetPrice?: number; // For Pending
}

export interface Transaction {
  id: string;
  referenceId: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_INTERNAL' | 'TRANSFER_OUT' | 'SWAP' | 'TRADE_STOCK' | 'FUTURE_OPEN' | 'FUTURE_CLOSE' | 'P2P_BUY' | 'P2P_SELL' | 'STAKE' | 'REWARD' | 'BINARY_OPEN' | 'BINARY_CLOSE' | 'PLAN_PURCHASE' | 'COPY_ALLOCATE' | 'CONVERT' | 'INVEST_FIXED' | 'INTERNAL_MOVE';
  direction: 'INCOME' | 'OUTCOME';
  amount: number;
  asset: string;
  counterAmount?: number;
  counterAsset?: string;
  recipient?: string; // Email or ID for internal transfers
  sender?: string; // For incoming transfers
  fee: number;
  feeAsset: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'ESCROW_LOCKED';
  date: string;
  description: string;
  balanceAfter: number;
}

export interface StakingPosition {
  id: string;
  asset: CryptoSymbol;
  amount: number;
  apy: number;
  startDate: string;
  accumulatedRewards: number;
}

export interface FixedTermPlan {
    id: string;
    name: string;
    durationDays: number;
    apy: number;
    minAmount: number;
    color: string;
    risk: string;
    description: string;
    poolTotal: number;
    poolFilled: number;
}

export interface FixedInvestment {
    id: string;
    planName: string;
    amount: number;
    asset: string;
    startDate: string;
    maturityDate: string;
    projectedReturn: number;
    status: 'ACTIVE' | 'MATURED';
}

export interface P2POffer {
  id: string;
  merchant: string;
  type: 'BUY' | 'SELL';
  asset: CryptoSymbol;
  fiat: FiatSymbol;
  price: number;
  limitMin: number;
  limitMax: number;
  paymentMethods: string[];
  orders: number;
  completionRate: number;
}

export interface P2POrder {
    id: string;
    offerId: string;
    type: 'BUY' | 'SELL';
    asset: string;
    fiat: string;
    amountAsset: number;
    amountFiat: number;
    price: number;
    merchant: string;
    status: P2POrderState;
    chatHistory: { sender: 'ME' | 'MERCHANT' | 'SYSTEM', message: string, time: string }[];
    createdAt: string;
}

export interface TraderProfile {
  id: string;
  name: string;
  avatar: string;
  roi: number; // Return on Investment
  winRate: number;
  followers: number;
  aum: number; // Assets Under Management
  riskScore: number; // 1-10
  description: string;
  topPair: string;
  badges: string[]; // Gamification badges like 'Whale', 'Rising Star'
  chartHistory: number[]; // For sparkline
}

export interface CopyPosition {
  id: string;
  traderId: string;
  traderName: string;
  allocatedAmount: number;
  currentValue: number;
  pnl: number;
  startDate: string;
  settings: CopySettings;
}

export interface CopySettings {
    stopLossPercent?: number;
    takeProfitPercent?: number;
    mode: 'FIXED_AMOUNT' | 'PROPORTIONAL';
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    reward: string;
    participants: number;
    timeLeft: string;
    status: 'ACTIVE' | 'COMPLETED';
}

export interface SubscriptionPlan {
  id: UserTier;
  name: string;
  price: number;
  features: string[];
  color: string;
  maxLeverage: number;
  tradingFeeMaker: number;
  tradingFeeTaker: number;
  tradingFeeBinary: number;
}

export interface PendingOrder {
  id: string;
  symbol: string;
  type: 'LIMIT' | 'STOP';
  direction: 'LONG' | 'SHORT' | 'BUY' | 'SELL';
  price: number;
  amount: number;
  date: string;
  status: 'OPEN';
  stopLoss?: number;
  takeProfit?: number;
}

export interface PriceAlert {
    id: string;
    symbol: string;
    targetPrice: number;
    condition: 'ABOVE' | 'BELOW';
    isActive: boolean;
}

export interface UserScript {
    id: string;
    name: string;
    code: string;
    lastModified: string;
}

export interface TradingBot {
    id: string;
    name: string;
    strategy: 'GRID' | 'DCA' | 'ARBITRAGE';
    symbol: string;
    status: 'RUNNING' | 'STOPPED';
    pnl: number;
    investment: number;
    config: Record<string, any>; // grids, range, etc.
}

export interface SocialPost {
    id: string;
    userId: string;
    userName: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    shares: number;
    isLiked?: boolean;
}
