import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Customized } from 'recharts';
import { TrendingUp, ChevronDown, Lock, Pencil, Ruler, Eraser, Brush, ArrowLeft, ArrowRight, BellRing, Plus, ChartBar, ChartCandle, ChartLine, ChartArea, Maximize2, Minimize2, ChevronUp, Play, Pause, StopCircle, Edit2, PlusCircle, Folder, Save, Columns, PanelRight, Minus, Grid, Sidebar, MousePointer2, PenTool, Scissors, MoreVertical, Square, Circle, Type, Wifi, Info, MinusSquare, X, BarChart2, FileCode, Cpu, List } from './Icons';
import { WalletService, fetchLivePrices, PRICES, getChartData, calculateHeikinAshi, AuthService } from '../services/api';
import { FuturePosition, Language, PendingOrder, PriceAlert, ChartStyle, UserScript, TradingBot } from '../types';
import { Plans } from './Plans';

interface ExchangeProps {
  onTransaction: () => void;
  lang: Language;
  selectedSymbol?: string;
}

type MarketType = 'SPOT' | 'FUTURES' | 'STOCKS' | 'FOREX' | 'COMMODITY';
type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT';

const Candle = (props: any) => {
  const { x, y, width, height, low, high, open, close, type } = props;
  const isUp = close > open;
  const color = isUp ? '#22c55e' : '#ef4444';
  const ratio = Math.abs(height / (high - low));
  const lineTop = y;
  const lineBottom = y + height;
  const bodyTop = y + (high - Math.max(open, close)) * ratio;
  const bodyHeight = Math.abs(open - close) * ratio;
  const bodyWidth = width * 0.6;
  const bodyX = x + width * 0.2;
  const isHollow = type === 'HOLLOW_CANDLE' && isUp;

  return (
    <g stroke={color} fill={isHollow ? 'transparent' : color} strokeWidth="2">
      <line x1={x + width / 2} y1={lineTop} x2={x + width / 2} y2={lineBottom} />
      <rect x={bodyX} y={bodyTop} width={bodyWidth} height={Math.max(2, bodyHeight)} stroke={color} fill={isHollow ? 'transparent' : color} />
    </g>
  );
};

const BarShape = (props: any) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isUp = close > open;
    const color = isUp ? '#22c55e' : '#ef4444';
    const ratio = Math.abs(height / (high - low));
    const openY = y + (high - open) * ratio;
    const closeY = y + (high - close) * ratio;
    const centerX = x + width / 2;

    return (
        <g stroke={color} strokeWidth="2">
            <line x1={centerX} y1={y} x2={centerX} y2={y + height} />
            <line x1={centerX} y1={openY} x2={x} y2={openY} />
            <line x1={centerX} y1={closeY} x2={x + width} y2={closeY} />
        </g>
    )
}

export const Exchange: React.FC<ExchangeProps> = ({ onTransaction, lang, selectedSymbol }) => {
  const [market, setMarket] = useState<MarketType>('SPOT');
  const [symbol, setSymbol] = useState(selectedSymbol || 'BTC');
  const [chartType, setChartType] = useState<ChartStyle>('CANDLE');
  const [timeframe, setTimeframe] = useState('1h');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  
  // Layout State - Independent Panels
  const [isBookMinimized, setIsBookMinimized] = useState(false);
  const [isDeskMinimized, setIsDeskMinimized] = useState(false);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [showTradingDesk, setShowTradingDesk] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);
  
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [showBotManager, setShowBotManager] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);

  const [balances, setBalances] = useState<Record<string, number>>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<{bids: any[], asks: any[]}>({bids:[], asks:[]});
  const [userTier, setUserTier] = useState('STANDARD');
  
  // Trading Form
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'TRADE'|'PENDING'>('TRADE');

  // Bots & Scripts
  const [userScripts, setUserScripts] = useState<UserScript[]>([]);
  const [myBots, setMyBots] = useState<TradingBot[]>([]);
  const [scriptCode, setScriptCode] = useState('// Pine Script v5\nstrategy("My Strategy", overlay=true)');

  const timeframes = ['1s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];

  useEffect(() => {
      refresh();
      const u = AuthService.getCurrentUser();
      if(u) setUserTier(u.tier);
      setUserScripts(WalletService.getScripts());
      setMyBots(WalletService.getBots());

      const interval = setInterval(refresh, 2000);
      return () => clearInterval(interval);
  }, [symbol, timeframe, chartType, isSplitView]);

  const refresh = async () => {
      const prices = await fetchLivePrices();
      const currentPrice = prices[symbol] || 100;
      if(!price && orderType !== 'MARKET') setPrice(currentPrice.toFixed(2));
      
      const assets = WalletService.getBalances();
      const b: Record<string, number> = {};
      assets.forEach(a => b[a.symbol] = a.balance);
      setBalances(b);
      setPendingOrders(WalletService.getPendingOrders());
      setOrderBook(WalletService.getOrderBook(symbol));

      let data = getChartData(symbol, timeframe);
      if (chartType === 'HEIKIN') data = calculateHeikinAshi(data);
      setChartData(data);

      if(isSplitView) {
          const compData = getChartData('ETH', timeframe); // Default comparison
          setCompareData(compData);
      }
  };

  const handleTrade = async (direction: 'BUY'|'SELL'|'LONG'|'SHORT') => {
      try {
          const val = parseFloat(amount);
          if (market === 'FUTURES') {
              await WalletService.openFuturePosition(symbol, val, direction as any, leverage);
          } else {
              if (direction === 'BUY') await WalletService.tradeSpot(symbol, 'USD', val);
              else await WalletService.tradeSpot('USD', symbol, val);
          }
          alert("Order Executed");
          onTransaction();
          refresh();
      } catch(e:any) { alert(e.message); }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-nexus-900 overflow-hidden relative">
        
        {/* CHART CANVAS */}
        <div className="flex-1 relative bg-nexus-900">
            {/* Top Toolbar Floating */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center bg-nexus-800/80 backdrop-blur-xl border border-white/10 p-2 rounded-xl shadow-2xl">
                <div className="flex items-center space-x-2">
                    <button onClick={()=>setShowAssetMenu(!showAssetMenu)} className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-sm transition">
                        {symbol} <ChevronDown className="w-4 h-4"/>
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <div className="flex bg-black/20 rounded-lg p-1 space-x-1">
                        {['1m','5m','1h','4h','1d'].map(tf => (
                            <button key={tf} onClick={()=>setTimeframe(tf)} className={`px-2 py-1 text-xs rounded font-bold ${timeframe===tf ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>{tf}</button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <button onClick={()=>setShowChartTypeMenu(!showChartTypeMenu)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><ChartCandle className="w-4 h-4"/></button>
                    {showChartTypeMenu && (
                        <div className="absolute top-12 left-40 bg-nexus-800 border border-white/10 rounded-lg p-2 z-50 shadow-xl w-40">
                            {[
                                {id:'CANDLE', label:'Candles', icon:<ChartCandle className="w-4 h-4"/>},
                                {id:'BARS', label:'Bars', icon:<BarChart2 className="w-4 h-4"/>},
                                {id:'LINE', label:'Line', icon:<ChartLine className="w-4 h-4"/>},
                                {id:'AREA', label:'Area', icon:<ChartArea className="w-4 h-4"/>},
                                {id:'HEIKIN', label:'Heikin Ashi', icon:<ChartCandle className="w-4 h-4 text-yellow-500"/>},
                            ].map(t => (
                                <button key={t.id} onClick={()=>{setChartType(t.id as any); setShowChartTypeMenu(false)}} className="flex items-center w-full p-2 hover:bg-white/5 rounded text-xs text-white">
                                    <span className="mr-2">{t.icon}</span> {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <button onClick={()=>setShowScriptEditor(true)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-blue-400"><FileCode className="w-4 h-4"/></button>
                    <button onClick={()=>setShowBotManager(true)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-green-400"><Cpu className="w-4 h-4"/></button>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={()=>setIsSplitView(!isSplitView)} className={`p-2 rounded hover:bg-white/10 ${isSplitView?'text-blue-400':'text-slate-400'}`}><Columns className="w-4 h-4"/></button>
                    <button className="p-2 hover:bg-white/10 rounded text-slate-400"><BellRing className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Left Drawing Tools Floating */}
            <div className="absolute left-4 top-20 bottom-20 w-10 flex flex-col items-center bg-nexus-800/60 backdrop-blur-md border border-white/10 rounded-lg py-2 z-10 space-y-2">
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><MousePointer2 className="w-4 h-4"/></button>
                <div className="h-px w-6 bg-white/10"></div>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><PenTool className="w-4 h-4"/></button>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Brush className="w-4 h-4"/></button>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Type className="w-4 h-4"/></button>
                <div className="h-px w-6 bg-white/10"></div>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Square className="w-4 h-4"/></button>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Circle className="w-4 h-4"/></button>
                <div className="h-px w-6 bg-white/10"></div>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Ruler className="w-4 h-4"/></button>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-red-400"><Scissors className="w-4 h-4"/></button>
            </div>

            <div className={`grid h-full ${isSplitView ? 'grid-cols-2 gap-px bg-white/10' : 'grid-cols-1'}`}>
                <div className="h-full w-full">
                    <ResponsiveContainer>
                        <ComposedChart data={chartData} margin={{top:60, bottom: 20, right: 60, left: 50}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                            <YAxis orientation="right" domain={['auto','auto']} stroke="#475569" />
                            <Tooltip contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155'}} itemStyle={{color:'#fff'}}/>
                            {chartType === 'AREA' && <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />}
                            {chartType === 'LINE' && <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />}
                            {(chartType === 'CANDLE' || chartType === 'HOLLOW_CANDLE' || chartType === 'HEIKIN') && <Customized component={<Candle type={chartType}/>} dataKey="value"/>}
                            {chartType === 'BARS' && <Customized component={<BarShape/>} dataKey="value"/>}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                {isSplitView && (
                    <div className="h-full w-full bg-nexus-900 border-l border-white/10 relative">
                        <div className="absolute top-20 left-4 text-xs font-bold text-slate-500">ETH/USDT</div>
                        <ResponsiveContainer>
                            <ComposedChart data={compareData} margin={{top:60, bottom: 20, right: 60, left: 10}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <YAxis orientation="right" domain={['auto','auto']} stroke="#475569" />
                                <Customized component={<Candle type="CANDLE"/>} dataKey="value"/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT DOCK - FLOATING WIDGETS */}
        <div className="w-80 flex flex-col gap-4 p-4 bg-transparent absolute right-0 top-14 bottom-0 z-30 pointer-events-none">
            
            {/* ORDER BOOK WIDGET */}
            {showOrderBook && (
                <div className={`bg-nexus-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 flex flex-col ${isBookMinimized ? 'h-10' : 'flex-1'}`}>
                    <div className="flex justify-between items-center p-2 bg-white/5 cursor-move">
                        <span className="text-xs font-bold text-slate-300 flex items-center"><List className="w-3 h-3 mr-2"/> Order Book</span>
                        <div className="flex space-x-1">
                            <button onClick={()=>setIsBookMinimized(!isBookMinimized)} className="text-slate-400 hover:text-white p-1">{isBookMinimized ? <PlusCircle className="w-3 h-3"/> : <MinusSquare className="w-3 h-3"/>}</button>
                            <button onClick={()=>setShowOrderBook(false)} className="text-slate-400 hover:text-red-400 p-1"><X className="w-3 h-3"/></button>
                        </div>
                    </div>
                    {!isBookMinimized && (
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="flex justify-between px-2 text-[10px] text-slate-500 py-1">
                                <span>Price</span>
                                <span>Amount</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse justify-end">
                                {orderBook.asks.map((ask,i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 text-[10px] hover:bg-white/5 cursor-pointer relative">
                                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{width: `${Math.random()*80}%`}}></div>
                                        <span className="text-red-400 relative z-10">{ask.price.toFixed(2)}</span>
                                        <span className="text-slate-400 relative z-10">{ask.amount.toFixed(4)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-y border-white/10 py-1 text-center font-mono font-bold text-lg text-white bg-black/20">
                                {PRICES[symbol]?.toFixed(2)}
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {orderBook.bids.map((bid,i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 text-[10px] hover:bg-white/5 cursor-pointer relative">
                                        <div className="absolute right-0 top-0 bottom-0 bg-green-500/10" style={{width: `${Math.random()*80}%`}}></div>
                                        <span className="text-green-400 relative z-10">{bid.price.toFixed(2)}</span>
                                        <span className="text-slate-400 relative z-10">{bid.amount.toFixed(4)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t border-white/10 flex justify-between text-[9px] text-slate-500">
                                <span className="flex items-center"><Wifi className="w-3 h-3 mr-1 text-green-500"/> Stable</span>
                                <span>Fee: {userTier==='PLATINUM'?'0%':'0.1%'}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TRADING DESK WIDGET */}
            {showTradingDesk && (
                <div className={`bg-nexus-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 flex flex-col ${isDeskMinimized ? 'h-10' : 'h-auto'}`}>
                    <div className="flex justify-between items-center p-2 bg-white/5 cursor-move">
                        <span className="text-xs font-bold text-slate-300 flex items-center"><TrendingUp className="w-3 h-3 mr-2"/> Trade</span>
                        <div className="flex space-x-1">
                            <button onClick={()=>setIsDeskMinimized(!isDeskMinimized)} className="text-slate-400 hover:text-white p-1">{isDeskMinimized ? <PlusCircle className="w-3 h-3"/> : <MinusSquare className="w-3 h-3"/>}</button>
                            <button onClick={()=>setShowTradingDesk(false)} className="text-slate-400 hover:text-red-400 p-1"><X className="w-3 h-3"/></button>
                        </div>
                    </div>
                    {!isDeskMinimized && (
                        <div className="p-4 space-y-3">
                            <div className="flex bg-black/30 p-1 rounded-lg">
                                <button onClick={()=>setActiveTab('TRADE')} className={`flex-1 py-1 text-[10px] font-bold rounded ${activeTab==='TRADE'?'bg-nexus-700 text-white':'text-slate-500'}`}>Market</button>
                                <button onClick={()=>setActiveTab('PENDING')} className={`flex-1 py-1 text-[10px] font-bold rounded ${activeTab==='PENDING'?'bg-nexus-700 text-white':'text-slate-500'}`}>Pending</button>
                            </div>

                            {activeTab === 'TRADE' ? (
                                <>
                                    <div className="flex space-x-1">
                                        <button onClick={()=>setMarket('SPOT')} className={`flex-1 py-1 rounded text-[10px] font-bold ${market==='SPOT'?'bg-blue-600 text-white':'bg-nexus-800 text-slate-500 border border-white/5'}`}>Spot</button>
                                        <button onClick={()=>setMarket('FUTURES')} className={`flex-1 py-1 rounded text-[10px] font-bold ${market==='FUTURES'?'bg-purple-600 text-white':'bg-nexus-800 text-slate-500 border border-white/5'}`}>Futures</button>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Amount</span><span>Avail: ${(balances['USD']||0).toFixed(0)}</span></div>
                                        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-nexus-800 border border-white/10 rounded p-2 text-white text-sm outline-none font-bold" placeholder="0.00"/>
                                    </div>
                                    {market === 'FUTURES' && (
                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Leverage</span><span className="text-yellow-500">{leverage}x</span></div>
                                            <input type="range" min="1" max="100" value={leverage} onChange={e=>setLeverage(Number(e.target.value))} className="w-full h-1 bg-nexus-700 rounded-lg appearance-none cursor-pointer"/>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={()=>handleTrade(market==='FUTURES'?'LONG':'BUY')} className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-xs shadow-lg transition">
                                            {market==='FUTURES'?'Long':'Buy'}
                                        </button>
                                        <button onClick={()=>handleTrade(market==='FUTURES'?'SHORT':'SELL')} className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-xs shadow-lg transition">
                                            {market==='FUTURES'?'Short':'Sell'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-[10px] text-slate-500 mb-2">Active Limit Orders</div>
                                    {pendingOrders.map(o => (
                                        <div key={o.id} className="bg-nexus-800 p-2 rounded border border-white/5 flex justify-between items-center text-[10px]">
                                            <div>
                                                <div className={`font-bold ${o.direction.includes('BUY')||o.direction.includes('LONG')?'text-green-400':'text-red-400'}`}>{o.direction} {o.symbol}</div>
                                                <div className="text-white">@{o.price}</div>
                                            </div>
                                            <button className="text-slate-500 hover:text-white"><X className="w-3 h-3"/></button>
                                        </div>
                                    ))}
                                    {pendingOrders.length === 0 && <div className="text-center text-slate-600 text-[10px] py-4">No active orders</div>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* MODALS */}
        {showScriptEditor && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
                <div className="bg-nexus-800 w-full h-full max-w-5xl rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl">
                    <div className="w-64 bg-nexus-900 border-r border-white/10 p-4">
                        <div className="flex justify-between items-center mb-4 text-white font-bold"><span className="flex items-center"><Folder className="w-4 h-4 mr-2"/> Scripts</span> <PlusCircle className="w-4 h-4 text-blue-400 cursor-pointer"/></div>
                        <div className="space-y-2">
                            {userScripts.map(s => (
                                <div key={s.id} className="p-2 hover:bg-white/5 rounded text-xs text-slate-300 cursor-pointer flex justify-between group">
                                    <span>{s.name}</span>
                                    <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100"/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="h-12 bg-nexus-900 border-b border-white/10 flex items-center justify-between px-4">
                            <span className="text-white font-bold text-sm flex items-center"><FileCode className="w-4 h-4 mr-2 text-yellow-500"/> editor.pine</span>
                            <div className="flex space-x-2">
                                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500">Save & Run</button>
                                <button onClick={()=>setShowScriptEditor(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <textarea className="flex-1 bg-nexus-800 text-green-400 font-mono p-4 text-sm outline-none resize-none" value={scriptCode} onChange={e=>setScriptCode(e.target.value)} spellCheck={false}/>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};