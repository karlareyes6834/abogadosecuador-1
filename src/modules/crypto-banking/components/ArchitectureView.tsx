import React from 'react';
import { Server, Shield, BrainCircuit, Database, Layers, Zap, Cpu, FileText, Award } from './Icons';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-nexus-900 p-8 rounded-2xl border border-nexus-700 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">NexusFi Unified Architecture V1</h2>
        <p className="text-slate-300 leading-relaxed max-w-5xl">
          A hybrid financial ecosystem designed for extreme performance, regulatory compliance, and non-custodial security. 
          Our architecture bridges the gap between centralized liquidity and decentralized sovereignty.
        </p>
      </div>

      {/* Core Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Backend & Microservices */}
        <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Core Backend (Go/Rust)</h3>
          </div>
          <ul className="space-y-3 text-slate-400 text-sm list-none">
            <li className="flex items-start"><span className="text-nexus-accent mr-2">▪</span><strong className="text-slate-300">Matching Engine:</strong> Rust-based limit order book (LOB) capable of 100k TPS with microsecond latency.</li>
            <li className="flex items-start"><span className="text-nexus-accent mr-2">▪</span><strong className="text-slate-300">Ledger Service:</strong> Double-entry accounting system with ACIDS compliance (Atomicity, Consistency, Isolation, Durability).</li>
            <li className="flex items-start"><span className="text-nexus-accent mr-2">▪</span><strong className="text-slate-300">API Gateway:</strong> Kong-based gateway handling ratelimiting, JWT auth, and routing to 20+ microservices.</li>
          </ul>
        </div>

        {/* Security Architecture */}
        <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Defense-in-Depth Security</h3>
          </div>
          <ul className="space-y-3 text-slate-400 text-sm list-none">
             <li className="flex items-start"><span className="text-emerald-500 mr-2">▪</span><strong className="text-slate-300">MPC Custody:</strong> Institutional-grade Multi-Party Computation for hot wallet operations.</li>
             <li className="flex items-start"><span className="text-emerald-500 mr-2">▪</span><strong className="text-slate-300">Non-Custodial:</strong> Client-side WASM modules for generating private keys locally—server never sees them.</li>
             <li className="flex items-start"><span className="text-emerald-500 mr-2">▪</span><strong className="text-slate-300">Anti-Fraud:</strong> AI-driven anomaly detection analyzing withdrawal patterns and device fingerprints.</li>
          </ul>
        </div>

        {/* Data & AI Pipeline */}
        <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI & Data Mesh</h3>
          </div>
          <ul className="space-y-3 text-slate-400 text-sm list-none">
            <li className="flex items-start"><span className="text-purple-500 mr-2">▪</span><strong className="text-slate-300">Gemini 2.5 Flash:</strong> Real-time sentiment analysis, P2P dispute mediation, and customized financial insights.</li>
            <li className="flex items-start"><span className="text-purple-500 mr-2">▪</span><strong className="text-slate-300">Dynamic Fee Engine:</strong> Reinforcement learning agents optimizing spread (3-5%) based on network congestion.</li>
            <li className="flex items-start"><span className="text-purple-500 mr-2">▪</span><strong className="text-slate-300">Market Data:</strong> Aggregation from 10+ external CEXs via WebSocket firehose (Kafka stream).</li>
          </ul>
        </div>

        {/* Infrastructure */}
        <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:bg-orange-500/20 transition">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cloud Infrastructure</h3>
          </div>
           <ul className="space-y-3 text-slate-400 text-sm list-none">
            <li className="flex items-start"><span className="text-orange-500 mr-2">▪</span><strong className="text-slate-300">Orchestration:</strong> Multi-region Kubernetes (EKS) clusters with auto-scaling node groups.</li>
            <li className="flex items-start"><span className="text-orange-500 mr-2">▪</span><strong className="text-slate-300">Databases:</strong> CockroachDB (Global Consistency) for ledgers, ScyllaDB for tick data.</li>
            <li className="flex items-start"><span className="text-orange-500 mr-2">▪</span><strong className="text-slate-300">CDN & WAF:</strong> Cloudflare Enterprise for DDoS mitigation and edge caching.</li>
          </ul>
        </div>

        {/* Modules */}
        <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 group-hover:bg-pink-500/20 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Functional Modules</h3>
          </div>
           <ul className="space-y-3 text-slate-400 text-sm list-none">
            <li className="flex items-start"><span className="text-pink-500 mr-2">▪</span><strong className="text-slate-300">Exchange:</strong> Spot, Margin, and Auto-Convert.</li>
            <li className="flex items-start"><span className="text-pink-500 mr-2">▪</span><strong className="text-slate-300">P2P Escrow:</strong> Smart contract-based holding with reputation scoring.</li>
            <li className="flex items-start"><span className="text-pink-500 mr-2">▪</span><strong className="text-slate-300">Ramps:</strong> Fiat On/Off ramps integration (MoonPay, Banxa).</li>
          </ul>
        </div>

         {/* Monetization */}
         <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 hover:border-nexus-600 transition group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:bg-yellow-500/20 transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Monetization Model</h3>
          </div>
           <ul className="space-y-3 text-slate-400 text-sm list-none">
            <li className="flex items-start"><span className="text-yellow-500 mr-2">▪</span><strong className="text-slate-300">Dynamic Spreads:</strong> 3-5% margin on swaps based on volatility.</li>
            <li className="flex items-start"><span className="text-yellow-500 mr-2">▪</span><strong className="text-slate-300">NEX Token:</strong> Staking lowers fees by up to 50%.</li>
            <li className="flex items-start"><span className="text-yellow-500 mr-2">▪</span><strong className="text-slate-300">API Access:</strong> Commercial tier for HFT firms.</li>
          </ul>
        </div>
      </div>

      {/* Roadmap Visualization */}
      <div className="bg-nexus-800 rounded-xl border border-nexus-700 overflow-hidden">
        <div className="px-8 py-6 border-b border-nexus-700 flex justify-between items-center">
          <h3 className="font-bold text-xl text-white flex items-center">
            <FileText className="w-5 h-5 mr-3 text-slate-400" />
            Technical Roadmap
          </h3>
          <span className="text-xs font-mono text-slate-500">Updated: Q4 2024</span>
        </div>
        <div className="p-8 relative">
           {/* Timeline Line */}
          <div className="absolute left-10 top-8 bottom-8 w-1 bg-nexus-700/50"></div>

          <div className="space-y-10 relative">
            {/* Phase 1 */}
            <div className="ml-12 relative group">
              <div className="absolute -left-[3.25rem] top-1.5 w-6 h-6 rounded-full bg-nexus-900 border-4 border-nexus-success flex items-center justify-center">
                 <div className="w-2 h-2 bg-nexus-success rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-white font-bold text-lg flex items-center">
                Phase 1: Foundation (MVP)
                <span className="ml-3 px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30">Live</span>
              </h4>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                Launch of Hybrid Exchange MVP. Basic Spot Trading, Non-Custodial Wallet integration (EVM), P2P UI with manual mediation. 
                Integration of Gemini AI for basic market summaries.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="ml-12 relative group">
              <div className="absolute -left-[3.25rem] top-1.5 w-6 h-6 rounded-full bg-nexus-900 border-4 border-nexus-accent flex items-center justify-center"></div>
              <h4 className="text-slate-200 font-bold text-lg flex items-center">
                Phase 2: Advanced Liquidity & Compliance
                <span className="ml-3 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30">In Progress</span>
              </h4>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                Connection to Binance Cloud for liquidity aggregation. Implementation of Sumsub for automated tiered KYC/AML. 
                Deployment of the "Dynamic Fee Engine" (3-5%) into production.
              </p>
            </div>

             {/* Phase 3 */}
             <div className="ml-12 relative group">
              <div className="absolute -left-[3.25rem] top-1.5 w-6 h-6 rounded-full bg-nexus-900 border-4 border-slate-600 flex items-center justify-center"></div>
              <h4 className="text-slate-400 font-bold text-lg">Phase 3: Institutional Scale</h4>
              <p className="text-slate-500 text-sm mt-2 max-w-2xl">
                Rollout of FIX API for institutional clients. Physical Debit Card issuance via Visa partnership. 
                Cross-chain atomic swaps (BTC ↔ ETH) without wrapping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};