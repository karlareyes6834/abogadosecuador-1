import { supabase } from '../config/supabase';

/**
 * Servicio centralizado de base de datos para toda la plataforma
 * Integra usuarios, jugadores, tokens, compras, mejoras y más
 */

// ============================================================================
// TIPOS DE DATOS
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  total_balance: number;
  total_tokens: number;
  referral_code?: string;
  referral_count: number;
}

export interface PlayerProfile {
  id: string;
  user_id: string;
  username: string;
  level: number;
  experience: number;
  total_score: number;
  games_played: number;
  games_won: number;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface Token {
  id: string;
  user_id: string;
  token_type: 'credit' | 'reward' | 'referral' | 'purchase';
  amount: number;
  description: string;
  created_at: string;
  expires_at?: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  item_type: 'game' | 'upgrade' | 'subscription' | 'crypto';
  item_name: string;
  amount: number;
  currency: 'USD' | 'BTC' | 'ETH' | 'BNB';
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'paypal' | 'binance' | 'pichincha' | 'card';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GameImprovement {
  id: string;
  player_id: string;
  improvement_type: 'skill' | 'equipment' | 'power_up' | 'cosmetic';
  improvement_name: string;
  cost: number;
  level: number;
  purchased_at: string;
}

export interface CryptoWallet {
  id: string;
  user_id: string;
  wallet_address: string;
  currency: 'BTC' | 'ETH' | 'BNB' | 'USDT';
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'transfer' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: 'active' | 'inactive';
  commission_earned: number;
  created_at: string;
}

// ============================================================================
// SERVICIO DE BASE DE DATOS
// ============================================================================

class DatabaseService {
  // ========== USUARIOS ==========

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async createUserProfile(userId: string, email: string, name: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            total_balance: 0,
            total_tokens: 0,
            referral_count: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  // ========== JUGADORES ==========

  async getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player profile:', error);
      return null;
    }
  }

  async createPlayerProfile(userId: string, username: string): Promise<PlayerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .insert([
          {
            user_id: userId,
            username,
            level: 1,
            experience: 0,
            total_score: 0,
            games_played: 0,
            games_won: 0,
            achievements: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating player profile:', error);
      return null;
    }
  }

  async updatePlayerStats(playerId: string, updates: Partial<PlayerProfile>): Promise<PlayerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating player stats:', error);
      return null;
    }
  }

  // ========== TOKENS ==========

  async getUserTokens(userId: string): Promise<Token[]> {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
    }
  }

  async addTokens(userId: string, amount: number, tokenType: string, description: string): Promise<Token | null> {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .insert([
          {
            user_id: userId,
            token_type: tokenType,
            amount,
            description,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Actualizar balance total del usuario
      await this.updateUserTokenBalance(userId);

      return data;
    } catch (error) {
      console.error('Error adding tokens:', error);
      return null;
    }
  }

  async updateUserTokenBalance(userId: string): Promise<void> {
    try {
      const { data: tokens } = await supabase
        .from('tokens')
        .select('amount')
        .eq('user_id', userId);

      const totalTokens = tokens?.reduce((sum, token) => sum + token.amount, 0) || 0;

      await supabase
        .from('user_profiles')
        .update({ total_tokens: totalTokens })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating token balance:', error);
    }
  }

  // ========== COMPRAS ==========

  async createPurchase(purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>): Promise<Purchase | null> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert([
          {
            ...purchase,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      return null;
    }
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }
  }

  async updatePurchaseStatus(purchaseId: string, status: 'pending' | 'completed' | 'failed'): Promise<Purchase | null> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating purchase status:', error);
      return null;
    }
  }

  // ========== MEJORAS DE JUEGO ==========

  async getPlayerImprovements(playerId: string): Promise<GameImprovement[]> {
    try {
      const { data, error } = await supabase
        .from('game_improvements')
        .select('*')
        .eq('player_id', playerId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching improvements:', error);
      return [];
    }
  }

  async addGameImprovement(improvement: Omit<GameImprovement, 'id' | 'purchased_at'>): Promise<GameImprovement | null> {
    try {
      const { data, error } = await supabase
        .from('game_improvements')
        .insert([
          {
            ...improvement,
            purchased_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding game improvement:', error);
      return null;
    }
  }

  // ========== WALLETS DE CRYPTO ==========

  async getUserWallets(userId: string): Promise<CryptoWallet[]> {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wallets:', error);
      return [];
    }
  }

  async createWallet(userId: string, currency: string, walletAddress: string): Promise<CryptoWallet | null> {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .insert([
          {
            user_id: userId,
            currency,
            wallet_address: walletAddress,
            balance: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      return null;
    }
  }

  async updateWalletBalance(walletId: string, balance: number): Promise<CryptoWallet | null> {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .update({
          balance,
          updated_at: new Date().toISOString()
        })
        .eq('id', walletId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return null;
    }
  }

  // ========== TRANSACCIONES ==========

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            ...transaction,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // ========== REFERRALS ==========

  async createReferral(referrerId: string, referredId: string): Promise<Referral | null> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          {
            referrer_id: referrerId,
            referred_id: referredId,
            status: 'active',
            commission_earned: 0,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating referral:', error);
      return null;
    }
  }

  async getReferrals(referrerId: string): Promise<Referral[]> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', referrerId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }
  }

  // ========== UTILIDADES ==========

  async syncUserData(userId: string): Promise<any> {
    try {
      const [profile, player, tokens, purchases, wallets, transactions] = await Promise.all([
        this.getUserProfile(userId),
        this.getPlayerProfile(userId),
        this.getUserTokens(userId),
        this.getUserPurchases(userId),
        this.getUserWallets(userId),
        this.getUserTransactions(userId)
      ]);

      return {
        profile,
        player,
        tokens,
        purchases,
        wallets,
        transactions
      };
    } catch (error) {
      console.error('Error syncing user data:', error);
      return null;
    }
  }

  async deleteUserData(userId: string): Promise<boolean> {
    try {
      await Promise.all([
        supabase.from('user_profiles').delete().eq('id', userId),
        supabase.from('player_profiles').delete().eq('user_id', userId),
        supabase.from('tokens').delete().eq('user_id', userId),
        supabase.from('purchases').delete().eq('user_id', userId),
        supabase.from('crypto_wallets').delete().eq('user_id', userId),
        supabase.from('transactions').delete().eq('user_id', userId),
        supabase.from('referrals').delete().eq('referrer_id', userId)
      ]);

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
