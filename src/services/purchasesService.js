import { supabase } from './supabaseService';

const TABLES = {
  PURCHASES: 'purchases',
};

const purchasesService = {
  async getUserPurchases(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PURCHASES)
        .select('course_id, ebook_id, token_amount')
        .eq('user_id', userId);

      if (error) throw error;

      const purchasedIds = data.map(p => p.course_id || p.ebook_id).filter(Boolean);

      return { purchases: purchasedIds, error: null };
    } catch (error) {
      console.error(`Error al obtener las compras del usuario ${userId}:`, error);
      return { purchases: [], error };
    }
  },
};

export default purchasesService;
