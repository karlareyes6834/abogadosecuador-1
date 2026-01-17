import React, { useState } from 'react';
import { X, Send, LifeBuoy, FileText, CheckCircle, HelpCircle } from './Icons';
import { WalletService } from '../services/api';

export const Support: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'TICKET'>('CHAT');
  const [messages, setMessages] = useState<{sender: 'USER'|'BOT', text: string}[]>([
      { sender: 'BOT', text: 'Hi! I am Nexus AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  
  // Ticket State
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSend = () => {
      if(!input) return;
      const userMsg = input;
      setMessages(prev => [...prev, { sender: 'USER', text: userMsg }]);
      setInput('');

      setTimeout(() => {
          let reply = "I can help with that. Could you provide more details?";
          if(userMsg.toLowerCase().includes('deposit')) reply = "To deposit funds, go to Wallet > Receive and select your preferred method (Bank, Card, Crypto).";
          if(userMsg.toLowerCase().includes('withdraw')) reply = "Withdrawals are processed within 24 hours. Go to Wallet > Withdraw.";
          if(userMsg.toLowerCase().includes('kyc') || userMsg.toLowerCase().includes('verify')) reply = "You can verify your identity in Settings > Profile.";
          if(userMsg.toLowerCase().includes('card')) reply = "You can add a new card in the Wallet section by clicking 'Receive' -> 'Card' -> 'Add New'.";
          
          setMessages(prev => [...prev, { sender: 'BOT', text: reply }]);
      }, 1000);
  };

  const submitTicket = () => {
      if(!subject || !desc) return;
      WalletService.createSupportTicket(subject, desc);
      setTicketSent(true);
      setTimeout(() => {
          setTicketSent(false);
          setSubject('');
          setDesc('');
          setActiveTab('CHAT');
      }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
        {/* Widget Window */}
        {isOpen && (
            <div className="bg-[var(--bg-secondary)] w-80 h-96 rounded-2xl border border-[var(--border-color)] shadow-2xl mb-4 flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-300">
                {/* Header */}
                <div className="bg-[var(--bg-primary)] p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                    <div className="flex items-center font-bold text-[var(--text-main)]">
                        <LifeBuoy className="w-5 h-5 mr-2 text-[var(--accent)]"/> Support 24/7
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X className="w-4 h-4"/></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border-color)]">
                    <button onClick={() => setActiveTab('CHAT')} className={`flex-1 py-3 text-xs font-bold transition ${activeTab==='CHAT'?'text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--accent)]/5':'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Live Chat</button>
                    <button onClick={() => setActiveTab('TICKET')} className={`flex-1 py-3 text-xs font-bold transition ${activeTab==='TICKET'?'text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--accent)]/5':'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Create Ticket</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[var(--bg-primary)]">
                    {activeTab === 'CHAT' ? (
                        <div className="space-y-3">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender==='USER'?'justify-end':'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${m.sender==='USER'?'bg-[var(--accent)] text-white rounded-br-none':'bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-bl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ticketSent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <CheckCircle className="w-12 h-12 text-green-500 mb-3"/>
                                <h4 className="text-[var(--text-main)] font-bold">Ticket Created!</h4>
                                <p className="text-xs text-[var(--text-muted)]">We'll respond via email shortly.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Subject</label>
                                    <input value={subject} onChange={e=>setSubject(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent)]"/>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Description</label>
                                    <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full h-24 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent)] resize-none"/>
                                </div>
                                <button onClick={submitTicket} className="w-full py-2 bg-[var(--accent)] text-white rounded font-bold text-xs shadow-lg">Submit Ticket</button>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Input (Chat Only) */}
                {activeTab === 'CHAT' && (
                    <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex gap-2">
                        <input 
                            value={input} 
                            onChange={e=>setInput(e.target.value)} 
                            onKeyDown={e=>e.key==='Enter' && handleSend()}
                            placeholder="Type a message..." 
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full px-3 py-2 text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent)]"
                        />
                        <button onClick={handleSend} className="p-2 bg-[var(--accent)] text-white rounded-full"><Send className="w-3 h-3"/></button>
                    </div>
                )}
            </div>
        )}

        {/* Toggle Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="bg-[var(--accent)] hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/30 transition transform hover:scale-110 pointer-events-auto flex items-center justify-center"
        >
            {isOpen ? <X className="w-6 h-6"/> : <HelpCircle className="w-6 h-6"/>}
        </button>
    </div>
  );
};