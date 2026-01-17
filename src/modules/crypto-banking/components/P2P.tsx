
import React, { useState, useEffect } from 'react';
import { P2POffer, CryptoSymbol, FiatSymbol, P2POrder } from '../types';
import { ShieldCheck, AlertCircle, Star, Users, Zap, MessageCircle, Send, CheckCircle, Clock, List, FileText, Check, ChevronsRight, X } from './Icons';
import { WalletService } from '../services/api';

const mockOffers: P2POffer[] = [
  { id: '1', merchant: 'CambiosEc_Oficial', type: 'SELL', asset: CryptoSymbol.USDT, fiat: FiatSymbol.USD, price: 1.02, limitMin: 100, limitMax: 5000, paymentMethods: ['Banco Pichincha', 'Produbanco'], orders: 1542, completionRate: 99.5 },
  { id: '2', merchant: 'FastTrade_Latam', type: 'SELL', asset: CryptoSymbol.USDT, fiat: FiatSymbol.USD, price: 1.01, limitMin: 500, limitMax: 10000, paymentMethods: ['Guayaquil', 'Pacifico'], orders: 890, completionRate: 99.1 },
  { id: '3', merchant: 'PedroCrypto', type: 'BUY', asset: CryptoSymbol.BTC, fiat: FiatSymbol.USD, price: 66000, limitMin: 50, limitMax: 2000, paymentMethods: ['PayPal', 'Binance Pay'], orders: 320, completionRate: 95.0 },
];

interface P2PProps {
  onTransaction: () => void;
}

export const P2P: React.FC<P2PProps> = ({ onTransaction }) => {
  const [view, setView] = useState<'MARKET' | 'ORDERS' | 'HISTORY'>('MARKET');
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [activeOrder, setActiveOrder] = useState<P2POrder | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState<P2POrder[]>([]);
  
  // Create Order Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);
  const [orderAmount, setOrderAmount] = useState('');

  useEffect(() => {
      loadOrders();
      const interval = setInterval(loadOrders, 3000);
      return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
      setMyOrders(WalletService.getP2POrders());
  };

  const initiateOrder = (offer: P2POffer) => {
      setSelectedOffer(offer);
      setOrderAmount('');
      setShowBuyModal(true);
  };

  const confirmCreateOrder = async () => {
      if(!selectedOffer || !orderAmount) return;
      const val = parseFloat(orderAmount);
      if(isNaN(val) || val < selectedOffer.limitMin || val > selectedOffer.limitMax) {
          alert(`Please enter an amount between ${selectedOffer.limitMin} and ${selectedOffer.limitMax}`);
          return;
      }
      
      setLoading(true);
      try {
          // Force close modal first
          setShowBuyModal(false);
          const order = WalletService.createP2POrder(selectedOffer, val);
          
          // CRITICAL FIX: Set active order AND change view to trigger re-render of detail view
          setActiveOrder(order);
          setView('ORDERS'); 
          loadOrders();
      } catch(e:any) { alert(e.message); }
      finally { setLoading(false); }
  };

  const updateStatus = async (status: any) => {
      if(!activeOrder) return;
      setLoading(true);
      try {
          await new Promise(r => setTimeout(r, 1000));
          const updated = WalletService.updateP2POrder(activeOrder.id, { status });
          setActiveOrder(updated);
          loadOrders();
          if(status === 'RELEASED' || status === 'CANCELLED') {
              alert(status === 'RELEASED' ? "Order Completed Successfully!" : "Order Cancelled");
              onTransaction();
              setActiveOrder(null);
              setView('HISTORY');
          }
      } catch(e:any) { alert(e.message); }
      finally { setLoading(false); }
  };

  const sendMessage = () => {
      if(!activeOrder || !chatInput) return;
      WalletService.addP2PChat(activeOrder.id, chatInput, 'ME');
      setTimeout(() => {
          WalletService.addP2PChat(activeOrder.id, "Received, please wait.", 'MERCHANT');
          const orders = WalletService.getP2POrders();
          const active = orders.find(o => o.id === activeOrder.id);
          if(active) setActiveOrder(active);
      }, 1500);
      setChatInput('');
      const orders = WalletService.getP2POrders();
      const active = orders.find(o => o.id === activeOrder.id);
      if(active) setActiveOrder(active);
  };

  if(activeOrder) {
      // ORDER DETAIL VIEW
      return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
              <div className="md:col-span-2 space-y-6">
                  <button onClick={() => setActiveOrder(null)} className="text-slate-400 hover:text-white flex items-center"><List className="w-4 h-4 mr-2"/> Back to Orders</button>
                  <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-xl">
                      <div className="flex justify-between items-center mb-6 border-b border-nexus-700 pb-4">
                          <div>
                              <h2 className="text-xl font-bold text-white mb-1">
                                  {activeOrder.type === 'BUY' ? 'Buy' : 'Sell'} {activeOrder.asset}
                              </h2>
                              <p className="text-sm text-slate-400">Order ID: <span className="font-mono text-white">{activeOrder.id}</span></p>
                          </div>
                          <div className="text-right">
                              <div className="text-2xl font-bold text-nexus-accent">{activeOrder.status}</div>
                          </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex justify-between mb-8 relative px-8">
                          <div className="absolute top-1/2 left-8 right-8 h-1 bg-nexus-700 -z-0"></div>
                          {['CREATED', 'PAID', 'RELEASED'].map((s, i) => {
                              const steps = ['CREATED', 'PAID', 'RELEASED'];
                              const currentIdx = steps.indexOf(activeOrder.status);
                              const isDone = i <= currentIdx;
                              return (
                                  <div key={s} className="relative z-10 flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${isDone ? 'bg-blue-600 border-blue-600 text-white' : 'bg-nexus-900 border-nexus-600 text-slate-500'}`}>
                                          {i + 1}
                                      </div>
                                      <span className={`text-[10px] mt-2 font-bold ${isDone ? 'text-blue-400' : 'text-slate-500'}`}>{s}</span>
                                  </div>
                              )
                          })}
                      </div>

                      <div className="grid grid-cols-2 gap-6 text-sm bg-nexus-900/50 p-4 rounded-lg border border-nexus-700">
                          <div><span className="text-slate-400 block mb-1">Total Amount</span><span className="text-white font-bold text-lg">${activeOrder.amountFiat}</span></div>
                          <div><span className="text-slate-400 block mb-1">Price</span><span className="text-white font-bold text-lg">${activeOrder.price}</span></div>
                          <div><span className="text-slate-400 block mb-1">Receive Quantity</span><span className="text-white font-bold text-lg text-green-400">{activeOrder.amountAsset.toFixed(6)} {activeOrder.asset}</span></div>
                          <div><span className="text-slate-400 block mb-1">Merchant</span><span className="text-white font-bold text-lg flex items-center">{activeOrder.merchant} <CheckCircle className="w-4 h-4 text-blue-400 ml-2"/></span></div>
                      </div>
                  </div>

                  <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-xl">
                      <h3 className="font-bold text-white mb-4">Action Required</h3>
                      {activeOrder.status === 'CREATED' && activeOrder.type === 'BUY' && (
                          <div className="space-y-4">
                             <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm">
                                 Please make payment within 15:00 minutes. Use the chat to confirm details.
                             </div>
                             <button onClick={() => updateStatus('PAID')} disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-lg shadow-lg">
                                  {loading ? 'Processing...' : 'Transferred, Notify Seller'}
                             </button>
                             <button onClick={() => updateStatus('CANCELLED')} disabled={loading} className="w-full py-3 bg-nexus-700 hover:bg-nexus-600 text-slate-300 font-bold rounded-lg transition">
                                  Cancel Order
                             </button>
                          </div>
                      )}
                      {activeOrder.status === 'PAID' && activeOrder.type === 'BUY' && (
                          <div className="text-center p-8 bg-nexus-900/30 rounded-lg border border-nexus-700">
                              <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse"/>
                              <h4 className="text-xl font-bold text-white">Releasing Assets...</h4>
                              <p className="text-slate-400 text-sm mt-2">The seller is verifying your payment. Please wait.</p>
                          </div>
                      )}
                      {activeOrder.status === 'PAID' && activeOrder.type === 'SELL' && (
                           <button onClick={() => updateStatus('RELEASED')} disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition text-lg shadow-lg">
                               Payment Received, Release Crypto
                           </button>
                      )}
                      {(activeOrder.status === 'RELEASED' || activeOrder.status === 'CANCELLED') && (
                          <div className="text-center p-4">
                              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2"/>
                              <p className="text-white font-bold">This order is closed.</p>
                          </div>
                      )}
                  </div>
              </div>

              {/* Chat */}
              <div className="bg-nexus-800 border border-nexus-700 rounded-xl flex flex-col overflow-hidden shadow-xl h-full">
                  <div className="p-4 bg-nexus-900 border-b border-nexus-700 font-bold text-white flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-400"/> Live Chat
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-nexus-900/50">
                      {activeOrder.chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'ME' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${msg.sender === 'ME' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-nexus-700 text-slate-200 rounded-bl-none'}`}>
                                  <p>{msg.message}</p>
                                  <span className="text-[9px] opacity-50 block text-right mt-1">{new Date(msg.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-3 bg-nexus-900 border-t border-nexus-700 flex gap-2">
                      <input 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-nexus-800 border border-nexus-600 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-blue-500 transition"
                        placeholder="Type a message..."
                      />
                      <button onClick={sendMessage} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg transition"><Send className="w-4 h-4"/></button>
                  </div>
              </div>
          </div>
      )
  }

  // MAIN LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-nexus-700 pb-1">
          <div className="flex space-x-6">
              <button onClick={() => setView('MARKET')} className={`pb-3 border-b-2 font-bold text-sm transition ${view==='MARKET'?'border-blue-500 text-white':'border-transparent text-slate-400 hover:text-white'}`}>P2P Market</button>
              <button onClick={() => setView('ORDERS')} className={`pb-3 border-b-2 font-bold text-sm transition ${view==='ORDERS'?'border-blue-500 text-white':'border-transparent text-slate-400 hover:text-white'}`}>Active Orders ({myOrders.filter(o => ['CREATED','PAID','DISPUTE'].includes(o.status)).length})</button>
              <button onClick={() => setView('HISTORY')} className={`pb-3 border-b-2 font-bold text-sm transition ${view==='HISTORY'?'border-blue-500 text-white':'border-transparent text-slate-400 hover:text-white'}`}>History</button>
          </div>
      </div>

      {view === 'MARKET' && (
          <>
            <div className="flex space-x-2 bg-nexus-800 p-2 rounded-lg w-fit border border-nexus-700">
              <button onClick={() => setMode('BUY')} className={`px-6 py-2 rounded font-bold transition text-sm ${mode === 'BUY' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Buy</button>
              <button onClick={() => setMode('SELL')} className={`px-6 py-2 rounded font-bold transition text-sm ${mode === 'SELL' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Sell</button>
            </div>
            
            <div className="grid gap-4">
                {mockOffers.filter(o => o.type !== mode).map((offer) => (
                    <div key={offer.id} className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 flex flex-col md:flex-row items-center justify-between shadow-lg hover:border-nexus-500 transition group">
                        <div className="flex-1">
                            <div className="font-bold text-white text-lg flex items-center mb-1">
                                {offer.merchant} 
                                <CheckCircle className="w-4 h-4 text-blue-400 ml-2" title="Verified Merchant"/>
                                <span className="ml-2 text-[10px] bg-yellow-500/10 text-yellow-500 px-1 rounded border border-yellow-500/20">Gold</span>
                            </div>
                            <div className="text-xs text-slate-400 flex space-x-3 mb-3">
                                <span>{offer.orders} orders</span>
                                <span className="text-slate-600">|</span>
                                <span className="text-green-400">{offer.completionRate}% completion</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {offer.paymentMethods.map(pm => (
                                    <span key={pm} className={`text-[10px] px-2 py-0.5 rounded border ${pm.includes('Binance') ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : pm.includes('PayPal') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-nexus-900 text-slate-300 border-nexus-600'}`}>
                                        {pm}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right px-8 py-4 md:py-0 border-l border-nexus-700/50 mx-4">
                            <div className="text-2xl font-bold text-white font-mono">{offer.price} <span className="text-sm text-slate-500">{offer.fiat}</span></div>
                            <div className="text-xs text-slate-400 mt-1">Available: {offer.limitMax} {offer.asset}</div>
                            <div className="text-xs text-slate-500">Limit: {offer.limitMin} - {offer.limitMax}</div>
                        </div>
                        <button onClick={() => initiateOrder(offer)} className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg whitespace-nowrap ${mode === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                            {mode === 'BUY' ? 'Buy' : 'Sell'} {offer.asset}
                        </button>
                    </div>
                ))}
            </div>
          </>
      )}

      {(view === 'ORDERS' || view === 'HISTORY') && (
          <div className="bg-nexus-800 rounded-xl border border-nexus-700 overflow-hidden shadow-xl">
              <table className="w-full text-sm">
                  <thead className="bg-nexus-900/50 text-slate-400 text-xs uppercase text-left">
                      <tr>
                          <th className="p-4">ID</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Asset</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {myOrders.filter(o => {
                          if(view === 'ORDERS') return ['CREATED','PAID','DISPUTE'].includes(o.status);
                          return ['RELEASED','CANCELLED'].includes(o.status);
                      }).map(order => (
                          <tr key={order.id} className="border-t border-nexus-700/50 hover:bg-nexus-700/30 transition">
                              <td className="p-4 text-slate-400 font-mono text-xs">{order.id}</td>
                              <td className={`p-4 font-bold ${order.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{order.type}</td>
                              <td className="p-4 font-bold text-white">{order.asset}</td>
                              <td className="p-4 text-slate-200">{order.amountAsset.toFixed(4)}</td>
                              <td className="p-4 font-mono">${order.amountFiat}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'RELEASED' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : order.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'}`}>
                                      {order.status}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <button onClick={() => setActiveOrder(order)} className="flex items-center text-blue-400 hover:text-white font-bold text-xs transition">
                                      Details <ChevronsRight className="w-3 h-3 ml-1"/>
                                  </button>
                              </td>
                          </tr>
                      ))}
                      {myOrders.filter(o => {
                          if(view === 'ORDERS') return ['CREATED','PAID','DISPUTE'].includes(o.status);
                          return ['RELEASED','CANCELLED'].includes(o.status);
                      }).length === 0 && (
                          <tr><td colSpan={7} className="p-12 text-center text-slate-500">No orders found in this category.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      )}

      {/* CREATE ORDER MODAL */}
      {showBuyModal && selectedOffer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
              <div className="bg-nexus-800 rounded-2xl max-w-sm w-full border border-nexus-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="p-4 bg-nexus-900 border-b border-nexus-700 flex justify-between items-center">
                      <h3 className="font-bold text-white">
                          {selectedOffer.type === 'SELL' ? 'Buy' : 'Sell'} {selectedOffer.asset}
                      </h3>
                      <button onClick={() => setShowBuyModal(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4"/></button>
                  </div>
                  <div className="p-6">
                      <div className="text-xs text-slate-400 mb-4 flex justify-between">
                          <span>Merchant: <span className="text-white font-bold">{selectedOffer.merchant}</span></span>
                          <span>Price: <span className="text-green-400 font-mono">${selectedOffer.price}</span></span>
                      </div>
                      
                      <div className="mb-4">
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Amount to Pay ({selectedOffer.fiat})</label>
                          <input 
                            type="number" 
                            value={orderAmount} 
                            onChange={e => setOrderAmount(e.target.value)}
                            className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white font-bold text-lg outline-none focus:border-blue-500"
                            placeholder={`${selectedOffer.limitMin} - ${selectedOffer.limitMax}`}
                          />
                      </div>
                      
                      {orderAmount && !isNaN(parseFloat(orderAmount)) && (
                          <div className="bg-nexus-900/50 p-3 rounded mb-6 text-sm flex justify-between border border-nexus-700">
                              <span className="text-slate-400">You will receive:</span>
                              <span className="text-white font-bold">{(parseFloat(orderAmount)/selectedOffer.price).toFixed(6)} {selectedOffer.asset}</span>
                          </div>
                      )}

                      <button 
                        onClick={confirmCreateOrder} 
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg"
                      >
                          {loading ? 'Creating Order...' : 'Confirm Order'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
