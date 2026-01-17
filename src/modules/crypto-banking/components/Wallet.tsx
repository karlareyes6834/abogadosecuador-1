import React, { useState, useEffect } from 'react';
import { Copy, Landmark, Wallet as WalletIcon, TrendingUp, ArrowDown, ArrowUpRight, Search, QrCode, CreditCard, Lock, Users, ArrowRightLeft, RefreshCw, ArrowRight, CheckCircle, ArrowLeft, Briefcase, ChevronDown, Plus } from './Icons';
import { WalletService, PRICES } from '../services/api';
import { Transaction, Asset, WalletPocket, FixedTermPlan } from '../types';

interface WalletProps {
  onTransaction: () => void;
  initialParams?: any;
}

type WalletTab = 'FIAT' | 'CRYPTO' | 'INVEST';
type ReceiveMethod = 'BANK' | 'PAYPAL' | 'BINANCE' | 'CRYPTO' | 'INTERNAL_FIAT' | 'INTERNAL_CRYPTO' | 'CARD';

export const Wallet: React.FC<WalletProps> = ({ onTransaction, initialParams }) => {
  const [activeTab, setActiveTab] = useState<WalletTab>('FIAT');
  const [history, setHistory] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<Asset[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'INCOME' | 'OUTCOME'>('ALL');
  
  // Modals
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransferUser, setShowTransferUser] = useState(false); 
  const [showInternalMove, setShowInternalMove] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  // Deposit/Receive State
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>('BANK');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  
  // Withdraw State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'BINANCE' | 'PAYPAL' | 'BANK' | null>(null);
  
  // Banking Details
  const [bankAccountNum, setBankAccountNum] = useState('');
  const [bankAccountType, setBankAccountType] = useState('AHORROS');
  const [bankId, setBankId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [binanceId, setBinanceId] = useState('');
  
  // Transfers
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAsset, setTransferAsset] = useState('USD');

  // Internal Move
  const [moveFrom, setMoveFrom] = useState<WalletPocket>('FIAT');
  const [moveTo, setMoveTo] = useState<WalletPocket>('CRYPTO');
  const [moveAsset, setMoveAsset] = useState('USD');
  const [moveAmount, setMoveAmount] = useState('');

  // Invest Flow
  const [investPlans, setInvestPlans] = useState<FixedTermPlan[]>([]);
  const [selectedInvestPlan, setSelectedInvestPlan] = useState<FixedTermPlan | null>(null);
  const [investInputAmount, setInvestInputAmount] = useState('');

  // Add Card Flow
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const [loading, setLoading] = useState(false);
  const [linkedCards, setLinkedCards] = useState<any[]>([]);

  useEffect(() => { 
      loadData(); 
      if(initialParams && initialParams.action) {
          if(initialParams.action === 'deposit') setShowDeposit(true);
          if(initialParams.action === 'transfer') setShowTransferUser(true);
          if(initialParams.action === 'invest') { setActiveTab('INVEST'); setShowInvestModal(true); }
      }
  }, [initialParams]);

  const loadData = () => {
    setHistory(WalletService.getHistory());
    setBalances(WalletService.getBalances());
    setInvestPlans(WalletService.getFixedTermPlans());
    setLinkedCards(WalletService.getLinkedCards());
  };

  const fiats = balances.filter(b => b.type === 'FIAT');
  const cryptos = balances.filter(b => b.type === 'CRYPTO');
  const stocks = balances.filter(b => b.type === 'STOCK' || b.type === 'COMMODITY');

  const handleAddCard = async () => {
      if(!cardNumber || !cardExpiry || !cardCVC) return;
      setLoading(true);
      try {
          WalletService.addCard(cardNumber, cardExpiry, cardCVC);
          setShowAddCard(false);
          setCardNumber(''); setCardExpiry(''); setCardCVC('');
          loadData();
          alert("Card Added Successfully");
      } catch(e:any) { alert(e.message); }
      finally { setLoading(false); }
  }

  const handleDeposit = async () => {
     if(!depositAmount) return;
     setLoading(true);
     try {
         if (receiveMethod === 'INTERNAL_FIAT') {
             await WalletService.moveFundsBetweenPockets('FIAT', 'INVEST', 'USD', parseFloat(depositAmount));
         } else if (receiveMethod === 'INTERNAL_CRYPTO') {
             await WalletService.moveFundsBetweenPockets('CRYPTO', 'INVEST', 'USDT', parseFloat(depositAmount));
         } else {
             let methodLabel = 'Transferencia Bancaria';
             if(receiveMethod === 'PAYPAL') methodLabel = 'PayPal Deposit';
             if(receiveMethod === 'BINANCE') methodLabel = 'Binance Pay Deposit';
             if(receiveMethod === 'CRYPTO') methodLabel = 'Blockchain Transfer';
             if(receiveMethod === 'CARD') methodLabel = `Card Deposit (${selectedCardId ? 'Saved' : 'New'})`;
             
             await WalletService.deposit(parseFloat(depositAmount), methodLabel);
         }
         
         setShowDeposit(false);
         setDepositAmount('');
         loadData();
         onTransaction();
         alert("Funds credited successfully.");
     } catch(e:any) { alert(e.message); }
     finally { setLoading(false); }
  };

  // ... (Other handlers: handleWithdraw, handleTransferToUser, handleInternalMove, handleDirectInvest - same as previous) ...
  const handleWithdraw = async () => {
    if(!withdrawAmount || !withdrawMethod) { alert("Complete todos los campos."); return; }
    let destination = '';
    if (withdrawMethod === 'BANK') {
        if(!bankAccountNum || !bankId) { alert("Ingrese datos bancarios"); return; }
        destination = `Pichincha ${bankAccountType} ${bankAccountNum}`;
    } else if (withdrawMethod === 'PAYPAL') destination = `PayPal ${paypalEmail}`;
    else if (withdrawMethod === 'BINANCE') destination = `Binance ID ${binanceId}`;

    setLoading(true);
    try {
        await WalletService.withdraw(parseFloat(withdrawAmount), 'USD', destination);
        setShowWithdraw(false);
        setWithdrawAmount('');
        setWithdrawMethod(null);
        loadData();
        onTransaction();
        alert(`Retiro exitoso a ${destination}.`);
    } catch(e:any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleTransferToUser = async () => {
      if(!transferEmail || !transferAmount) return;
      setLoading(true);
      try {
          await WalletService.transferInternal(transferEmail, parseFloat(transferAmount), transferAsset);
          setShowTransferUser(false);
          setTransferAmount('');
          loadData();
          onTransaction();
          alert(`Transferencia exitosa a ${transferEmail}`);
      } catch(e:any) { alert(e.message); }
      finally { setLoading(false); }
  };

  const handleInternalMove = async () => {
      if(!moveAmount || !moveAsset) return;
      setLoading(true);
      try {
          await WalletService.moveFundsBetweenPockets(moveFrom, moveTo, moveAsset, parseFloat(moveAmount));
          setShowInternalMove(false);
          setMoveAmount('');
          loadData();
          onTransaction();
          alert("Fondos movidos exitosamente.");
      } catch(e: any) { alert(e.message); }
      finally { setLoading(false); }
  };

  const handleDirectInvest = async () => {
      if(!selectedInvestPlan || !investInputAmount) return;
      setLoading(true);
      try {
          const usdt = balances.find(b => b.symbol === 'USDT' || b.symbol === 'USD'); 
          
          await WalletService.investFixedTerm(selectedInvestPlan.id, parseFloat(investInputAmount), 'USDT');
          setShowInvestModal(false);
          setInvestInputAmount('');
          setSelectedInvestPlan(null);
          loadData();
          onTransaction();
          alert("Investment Successful! Funds locked in Vault.");
      } catch(e:any) { 
          if(e.message.includes('Insufficient')) {
              if(window.confirm("Insufficient Balance. Deposit funds now?")) {
                  setShowInvestModal(false);
                  setShowDeposit(true);
              }
          } else {
              alert(e.message);
          }
      }
      finally { setLoading(false); }
  }

  const filteredHistory = history.filter(tx => historyFilter === 'ALL' || tx.direction === historyFilter);

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          <button onClick={() => setActiveTab('FIAT')} className={`px-4 md:px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'FIAT' ? 'bg-blue-600 text-white shadow-lg' : 'bg-nexus-800 text-slate-400 hover:bg-nexus-700'}`}>
             <Landmark className="w-4 h-4" /> <span>Banca Fiat</span>
          </button>
          <button onClick={() => setActiveTab('CRYPTO')} className={`px-4 md:px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'CRYPTO' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-nexus-800 text-slate-400 hover:bg-nexus-700'}`}>
             <WalletIcon className="w-4 h-4" /> <span>Bóveda Crypto</span>
          </button>
          <button onClick={() => setActiveTab('INVEST')} className={`px-4 md:px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'INVEST' ? 'bg-purple-600 text-white shadow-lg' : 'bg-nexus-800 text-slate-400 hover:bg-nexus-700'}`}>
             <TrendingUp className="w-4 h-4" /> <span>Inversiones</span>
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Main Asset Card */}
         <div className="md:col-span-2 bg-gradient-to-br from-nexus-800/80 to-nexus-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                 <h2 className="text-slate-400 font-medium uppercase text-xs md:text-sm tracking-wider mb-2">
                     {activeTab === 'FIAT' && 'Liquidez Disponible (Cash)'}
                     {activeTab === 'CRYPTO' && 'Valor Total Activos Digitales'}
                     {activeTab === 'INVEST' && 'Valor de Mercado Portafolio'}
                 </h2>
                 <div className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
                     {activeTab === 'FIAT' && `$${fiats.reduce((a,b)=>a+b.balance,0).toLocaleString(undefined,{minimumFractionDigits:2})}`}
                     {activeTab === 'CRYPTO' && `$${cryptos.reduce((a,b)=>a+(b.balance*b.valueUsd),0).toLocaleString(undefined,{minimumFractionDigits:2})}`}
                     {activeTab === 'INVEST' && `$${stocks.reduce((a,b)=>a+(b.balance*b.valueUsd),0).toLocaleString(undefined,{minimumFractionDigits:2})}`}
                     <span className="text-lg md:text-2xl text-slate-500 font-normal ml-3">USD</span>
                 </div>
                 
                 <div className="flex flex-wrap gap-3">
                     <button onClick={() => setShowDeposit(true)} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center shadow-lg transition active:scale-95">
                         <ArrowDown className="w-5 h-5 mr-2" /> Recibir
                     </button>
                     <button onClick={() => setShowWithdraw(true)} className="px-6 py-3 bg-nexus-700 hover:bg-nexus-600 text-white rounded-xl font-bold flex items-center shadow-lg transition active:scale-95 border border-white/5">
                         <ArrowUpRight className="w-5 h-5 mr-2" /> Retirar
                     </button>
                     <button onClick={() => setShowInternalMove(true)} className="px-6 py-3 bg-nexus-700 hover:bg-nexus-600 text-white rounded-xl font-bold flex items-center shadow-lg transition active:scale-95 border border-white/5">
                         <RefreshCw className="w-5 h-5 mr-2" /> Mover
                     </button>
                     {activeTab === 'INVEST' && (
                         <button onClick={() => setShowInvestModal(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center shadow-lg transition active:scale-95">
                             <Briefcase className="w-5 h-5 mr-2" /> Invertir
                         </button>
                     )}
                 </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
         </div>

         {/* Quick Transfer User Card */}
         <div className="bg-nexus-800/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
             <div>
                 <h3 className="text-white font-bold mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-400"/> Transferir a Usuario</h3>
                 <p className="text-xs text-slate-400 mb-6">Envía fondos instantáneamente a otros usuarios de WI Global sin comisiones.</p>
                 <button onClick={() => setShowTransferUser(true)} className="w-full py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl font-bold border border-blue-500/30 transition">
                     Nueva Transferencia
                 </button>
             </div>
         </div>
      </div>

      {/* ASSET LIST & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[400px]">
          {/* Asset List */}
          <div className="lg:col-span-2 bg-nexus-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-white">Mis Activos</h3>
                  <div className="bg-nexus-900/50 rounded-lg p-1 flex items-center border border-white/5">
                      <Search className="w-4 h-4 text-slate-500 ml-2" />
                      <input type="text" placeholder="Buscar..." className="bg-transparent border-none text-sm text-white px-2 py-1 outline-none w-32" />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-nexus-900/30 text-slate-500 text-xs uppercase sticky top-0 backdrop-blur-sm">
                          <tr>
                              <th className="p-4">Activo</th>
                              <th className="p-4">Balance</th>
                              <th className="p-4 text-right">Valor USD</th>
                              <th className="p-4 text-right">Acción</th>
                          </tr>
                      </thead>
                      <tbody>
                          {(activeTab === 'FIAT' ? fiats : activeTab === 'CRYPTO' ? cryptos : stocks).map((asset) => (
                              <tr key={asset.symbol} className="border-b border-white/5 hover:bg-white/5 transition">
                                  <td className="p-4">
                                      <div className="flex items-center">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mr-3 ${activeTab==='FIAT'?'bg-green-500/20 text-green-500': activeTab==='CRYPTO'?'bg-indigo-500/20 text-indigo-500':'bg-purple-500/20 text-purple-500'}`}>
                                              {asset.symbol[0]}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white text-sm">{asset.symbol}</div>
                                              <div className="text-xs text-slate-500">{asset.name}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-4 font-mono text-sm text-slate-300">{asset.balance.toLocaleString()}</td>
                                  <td className="p-4 text-right font-bold text-white text-sm">${(asset.balance * asset.valueUsd).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                  <td className="p-4 text-right">
                                      <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition"><ArrowRightLeft className="w-4 h-4"/></button>
                                  </td>
                              </tr>
                          ))}
                          {(activeTab === 'FIAT' ? fiats : activeTab === 'CRYPTO' ? cryptos : stocks).length === 0 && (
                               <tr><td colSpan={4} className="p-8 text-center text-slate-500">No hay activos en esta cuenta.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Transaction History */}
          <div className="bg-nexus-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col h-full">
               <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                   <h3 className="font-bold text-white text-sm">Historial</h3>
                   <div className="flex space-x-1">
                       <button onClick={()=>setHistoryFilter('ALL')} className={`px-2 py-1 rounded text-[10px] font-bold ${historyFilter==='ALL'?'bg-blue-600 text-white':'text-slate-500'}`}>Todos</button>
                       <button onClick={()=>setHistoryFilter('INCOME')} className={`px-2 py-1 rounded text-[10px] font-bold ${historyFilter==='INCOME'?'bg-green-600 text-white':'text-slate-500'}`}>Ingresos</button>
                       <button onClick={()=>setHistoryFilter('OUTCOME')} className={`px-2 py-1 rounded text-[10px] font-bold ${historyFilter==='OUTCOME'?'bg-red-600 text-white':'text-slate-500'}`}>Egresos</button>
                   </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                   {filteredHistory.length > 0 ? (
                       <div className="divide-y divide-white/5">
                           {filteredHistory.map((tx) => (
                               <div key={tx.id} className="p-4 hover:bg-white/5 transition group">
                                   <div className="flex justify-between items-start mb-1">
                                       <div className="flex items-center">
                                           <div className={`p-1.5 rounded-full mr-3 ${tx.direction === 'INCOME' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                               {tx.direction === 'INCOME' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                           </div>
                                           <div>
                                               <span className="text-white font-bold text-sm block">{tx.type.replace('_', ' ')}</span>
                                               <span className="text-[10px] text-slate-500 block">{new Date(tx.date).toLocaleDateString()} • {tx.status}</span>
                                           </div>
                                       </div>
                                       <span className={`font-mono font-bold text-sm ${tx.direction === 'INCOME' ? 'text-green-400' : 'text-slate-200'}`}>
                                           {tx.direction === 'INCOME' ? '+' : '-'}{tx.amount} {tx.asset}
                                       </span>
                                   </div>
                                   <p className="text-[10px] text-slate-500 pl-10 truncate">{tx.description}</p>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="p-8 text-center text-slate-500 text-xs">Sin transacciones recientes.</div>
                   )}
               </div>
          </div>
      </div>

      {/* DEPOSIT MODAL */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-6">Recibir Fondos</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setReceiveMethod('BANK')} className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center justify-center transition ${receiveMethod === 'BANK' ? 'bg-blue-600 text-white border-blue-500' : 'bg-nexus-900 text-slate-400 border-nexus-700 hover:border-slate-500'}`}><Landmark className="w-6 h-6 mb-2"/> Banco</button>
                <button onClick={() => setReceiveMethod('PAYPAL')} className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center justify-center transition ${receiveMethod === 'PAYPAL' ? 'bg-blue-600 text-white border-blue-500' : 'bg-nexus-900 text-slate-400 border-nexus-700 hover:border-slate-500'}`}><CreditCard className="w-6 h-6 mb-2"/> PayPal</button>
                <button onClick={() => setReceiveMethod('BINANCE')} className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center justify-center transition ${receiveMethod === 'BINANCE' ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-nexus-900 text-slate-400 border-nexus-700 hover:border-slate-500'}`}><RefreshCw className="w-6 h-6 mb-2"/> Binance</button>
                <button onClick={() => setReceiveMethod('CRYPTO')} className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center justify-center transition ${receiveMethod === 'CRYPTO' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-nexus-900 text-slate-400 border-nexus-700 hover:border-slate-500'}`}><QrCode className="w-6 h-6 mb-2"/> Crypto</button>
                <button onClick={() => setReceiveMethod('CARD')} className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center justify-center transition ${receiveMethod === 'CARD' ? 'bg-purple-600 text-white border-purple-500' : 'bg-nexus-900 text-slate-400 border-nexus-700 hover:border-slate-500'}`}><CreditCard className="w-6 h-6 mb-2"/> Card</button>
            </div>
            
            {activeTab === 'INVEST' && (
                <div className="mb-4 bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
                    <p className="text-xs text-purple-200 font-bold mb-2">Internal Transfer to Investment Vault</p>
                    <div className="flex gap-2">
                        <button onClick={()=>setReceiveMethod('INTERNAL_FIAT')} className={`flex-1 py-1 text-[10px] rounded border ${receiveMethod==='INTERNAL_FIAT'?'bg-purple-600 text-white border-purple-500':'border-white/10 text-slate-400'}`}>From Fiat</button>
                        <button onClick={()=>setReceiveMethod('INTERNAL_CRYPTO')} className={`flex-1 py-1 text-[10px] rounded border ${receiveMethod==='INTERNAL_CRYPTO'?'bg-purple-600 text-white border-purple-500':'border-white/10 text-slate-400'}`}>From Crypto</button>
                    </div>
                </div>
            )}

            {receiveMethod === 'CARD' && (
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Select Card</label>
                    {linkedCards.length > 0 ? (
                        <div className="space-y-2">
                            {linkedCards.map(c => (
                                <div key={c.id} onClick={()=>setSelectedCardId(c.id)} className={`p-2 rounded border cursor-pointer flex justify-between ${selectedCardId===c.id ? 'border-purple-500 bg-purple-900/20' : 'border-white/10 bg-nexus-900'}`}>
                                    <span className="text-sm text-white font-bold">{c.brand} **** {c.last4}</span>
                                    {selectedCardId===c.id && <CheckCircle className="w-4 h-4 text-purple-500"/>}
                                </div>
                            ))}
                            <button onClick={()=>{setShowDeposit(false); setShowAddCard(true)}} className="text-xs text-blue-400 hover:text-white flex items-center mt-2"><Plus className="w-3 h-3 mr-1"/> Add New Card</button>
                        </div>
                    ) : (
                        <button onClick={()=>{setShowDeposit(false); setShowAddCard(true)}} className="w-full p-2 border border-dashed border-white/20 rounded text-slate-400 text-sm hover:text-white hover:border-white/40">+ Add New Card</button>
                    )}
                </div>
            )}

            <div className="mb-6">
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Monto Enviado</label>
               <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white font-bold outline-none" placeholder="0.00"/>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeposit(false)} className="flex-1 py-3 rounded-lg border border-nexus-600 text-slate-300 font-bold hover:bg-nexus-700">Cancelar</button>
              <button onClick={handleDeposit} disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CARD MODAL */}
      {showAddCard && (
          <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
                  <h3 className="text-xl font-bold text-white mb-4">Add New Card</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-slate-400">Card Number</label>
                          <input type="text" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} className="w-full bg-nexus-900 border border-white/10 rounded p-2 text-white" placeholder="0000 0000 0000 0000"/>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="text-xs text-slate-400">Expiry</label>
                              <input type="text" value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)} className="w-full bg-nexus-900 border border-white/10 rounded p-2 text-white" placeholder="MM/YY"/>
                          </div>
                          <div>
                              <label className="text-xs text-slate-400">CVC</label>
                              <input type="text" value={cardCVC} onChange={e=>setCardCVC(e.target.value)} className="w-full bg-nexus-900 border border-white/10 rounded p-2 text-white" placeholder="123"/>
                          </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                          <button onClick={()=>setShowAddCard(false)} className="flex-1 py-2 text-slate-400">Cancel</button>
                          <button onClick={handleAddCard} disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded font-bold">Save Card</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
             <h3 className="text-xl font-bold text-white mb-6">Retirar Fondos</h3>
             {!withdrawMethod ? (
                 <div className="space-y-3">
                     <button onClick={()=>setWithdrawMethod('BANK')} className="w-full p-4 bg-nexus-900 hover:bg-nexus-700 border border-nexus-700 rounded-xl flex items-center justify-between group transition">
                         <div className="flex items-center"><Landmark className="w-5 h-5 mr-3 text-blue-400"/> <span className="font-bold text-white">Transferencia Bancaria</span></div><ArrowRight className="w-4 h-4 text-slate-500"/>
                     </button>
                     <button onClick={()=>setWithdrawMethod('PAYPAL')} className="w-full p-4 bg-nexus-900 hover:bg-nexus-700 border border-nexus-700 rounded-xl flex items-center justify-between group transition">
                         <div className="flex items-center"><CreditCard className="w-5 h-5 mr-3 text-blue-400"/> <span className="font-bold text-white">PayPal</span></div><ArrowRight className="w-4 h-4 text-slate-500"/>
                     </button>
                     <button onClick={()=>setWithdrawMethod('BINANCE')} className="w-full p-4 bg-nexus-900 hover:bg-nexus-700 border border-nexus-700 rounded-xl flex items-center justify-between group transition">
                         <div className="flex items-center"><RefreshCw className="w-5 h-5 mr-3 text-yellow-500"/> <span className="font-bold text-white">Binance Pay</span></div><ArrowRight className="w-4 h-4 text-slate-500"/>
                     </button>
                     <button onClick={()=>setShowWithdraw(false)} className="w-full py-3 mt-4 text-slate-400 hover:text-white">Cancelar</button>
                 </div>
             ) : (
                 <div className="space-y-4">
                     <input type="number" value={withdrawAmount} onChange={e=>setWithdrawAmount(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white font-bold" placeholder="Monto USD"/>
                     {withdrawMethod==='BANK'&&<input type="text" value={bankAccountNum} onChange={e=>setBankAccountNum(e.target.value)} placeholder="Numero Cuenta" className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white"/>}
                     {withdrawMethod==='PAYPAL'&&<input type="text" value={paypalEmail} onChange={e=>setPaypalEmail(e.target.value)} placeholder="Email PayPal" className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white"/>}
                     {withdrawMethod==='BINANCE'&&<input type="text" value={binanceId} onChange={e=>setBinanceId(e.target.value)} placeholder="Binance ID/PayID" className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white"/>}
                     <button onClick={handleWithdraw} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg">Confirmar</button>
                     <button onClick={()=>setWithdrawMethod(null)} className="w-full text-slate-400">Volver</button>
                 </div>
             )}
          </div>
        </div>
      )}

      {/* INVEST MODAL (NEW) */}
      {showInvestModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
                  <h3 className="text-xl font-bold text-white mb-4">Invest in Vaults</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar mb-4">
                      {investPlans.map(plan => (
                          <div key={plan.id} onClick={()=>setSelectedInvestPlan(plan)} className={`p-4 rounded-xl border cursor-pointer transition ${selectedInvestPlan?.id===plan.id ? 'bg-blue-600/20 border-blue-500' : 'bg-nexus-900 border-white/10 hover:bg-white/5'}`}>
                              <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-white">{plan.name}</span>
                                  <span className="text-green-400 font-bold">{plan.apy}% APY</span>
                              </div>
                              <div className="text-xs text-slate-400 flex justify-between">
                                  <span>{plan.durationDays} Days Lock</span>
                                  <span>Min: ${plan.minAmount}</span>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  {selectedInvestPlan && (
                      <div className="mb-6 space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">Amount to Invest (USDT)</label>
                          <input type="number" value={investInputAmount} onChange={e=>setInvestInputAmount(e.target.value)} className="w-full bg-nexus-900 border border-white/10 rounded-lg p-3 text-white font-bold outline-none focus:border-blue-500" placeholder="0.00"/>
                      </div>
                  )}

                  <div className="flex gap-3">
                      <button onClick={()=>setShowInvestModal(false)} className="flex-1 py-3 text-slate-400 font-bold hover:text-white">Cancel</button>
                      <button onClick={handleDirectInvest} disabled={!selectedInvestPlan || loading} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg disabled:opacity-50">Confirm Investment</button>
                  </div>
              </div>
          </div>
      )}
      
      {/* OTHER MODALS (Transfer, Internal Move) */}
      {showInternalMove && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-md w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6">Mover Fondos</h3>
                  <div className="space-y-4">
                      <select value={moveFrom} onChange={e=>setMoveFrom(e.target.value as any)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-2 text-white"><option value="FIAT">Fiat</option><option value="CRYPTO">Crypto</option><option value="INVEST">Invest</option></select>
                      <ArrowRight className="w-5 h-5 text-slate-500 mx-auto"/>
                      <select value={moveTo} onChange={e=>setMoveTo(e.target.value as any)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-2 text-white"><option value="FIAT">Fiat</option><option value="CRYPTO">Crypto</option><option value="INVEST">Invest</option></select>
                      <input type="number" value={moveAmount} onChange={e=>setMoveAmount(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white" placeholder="Amount"/>
                      <select value={moveAsset} onChange={e=>setMoveAsset(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white">{balances.map(b=><option key={b.symbol} value={b.symbol}>{b.symbol}</option>)}</select>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={()=>setShowInternalMove(false)} className="flex-1 text-slate-400">Cancel</button><button onClick={handleInternalMove} className="flex-1 bg-blue-600 text-white rounded py-3">Move</button></div>
             </div>
          </div>
      )}
      {showTransferUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-nexus-800 rounded-2xl border border-nexus-600 p-6 max-w-md w-full shadow-2xl">
             <h3 className="text-xl font-bold text-white mb-6">Transferir a Usuario</h3>
             <div className="space-y-4">
                 <input type="text" value={transferEmail} onChange={e=>setTransferEmail(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white" placeholder="Email/ID"/>
                 <input type="number" value={transferAmount} onChange={e=>setTransferAmount(e.target.value)} className="w-full bg-nexus-900 border border-nexus-600 rounded p-3 text-white" placeholder="Amount"/>
             </div>
             <div className="flex gap-3 mt-6"><button onClick={()=>setShowTransferUser(false)} className="flex-1 text-slate-400">Cancel</button><button onClick={handleTransferToUser} className="flex-1 bg-blue-600 text-white rounded py-3">Send</button></div>
          </div>
        </div>
      )}
    </div>
  );
};