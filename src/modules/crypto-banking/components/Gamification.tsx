
import React, { useState, useEffect } from 'react';
import { User, Quest } from '../types';
import { WalletService } from '../services/api';
import { Flame, Trophy, Star, CheckCircle, Gamepad, X, ChevronDown, Zap } from './Icons';

interface GamificationProps {
    user: User;
    onClose: () => void;
}

export const Gamification: React.FC<GamificationProps> = ({ user, onClose }) => {
    const [quests, setQuests] = useState<Quest[]>([]);
    
    useEffect(() => {
        setQuests(WalletService.getQuests());
    }, []);

    const nextLevelXp = (user.level || 1) * 1000;
    const progress = ((user.xp || 0) / nextLevelXp) * 100;

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center">
                        <Gamepad className="w-6 h-6 mr-2 text-[var(--accent)]"/> Arcade Hub
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex items-center justify-between bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)] mb-4">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mr-3">
                            <Flame className="w-6 h-6 animate-pulse"/>
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-bold uppercase">Daily Streak</div>
                            <div className="text-xl font-bold text-[var(--text-main)]">{user.streak || 0} Days</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-[var(--text-muted)] font-bold uppercase">Multiplier</div>
                        <div className="text-xl font-bold text-yellow-500">1.5x</div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-[var(--text-main)]">Level {user.level || 1}</span>
                        <span className="text-[var(--text-muted)]">{user.xp} / {nextLevelXp} XP</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase mb-3 flex items-center"><Star className="w-4 h-4 mr-2"/> Daily Quests</h3>
                    <div className="space-y-3">
                        {quests.map(q => (
                            <div key={q.id} className={`p-4 rounded-xl border flex items-center justify-between transition ${q.completed ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30' : 'bg-[var(--bg-primary)] border-[var(--border-color)]'}`}>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg mr-3 ${q.completed ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                                        {q.completed ? <CheckCircle className="w-5 h-5"/> : <Zap className="w-5 h-5"/>}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${q.completed ? 'text-[var(--accent)] line-through opacity-70' : 'text-[var(--text-main)]'}`}>{q.title}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{q.description}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-yellow-500">+{q.xpReward} XP</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-2xl border border-indigo-500/30 text-center">
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3"/>
                    <h3 className="text-white font-bold text-lg">Weekly Tournament</h3>
                    <p className="text-indigo-200 text-xs mb-4">Rank in the top 100 traders to win exclusive badges and USDT rewards.</p>
                    <button className="w-full py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition text-sm">Join Leaderboard</button>
                </div>
            </div>
        </div>
    );
};
