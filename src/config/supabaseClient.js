// Este archivo ahora importa el cliente único de supabaseService
// Para evitar múltiples instancias de GoTrueClient
import { supabase } from '../services/supabaseService';

export { supabase };
export const getSupabase = () => supabase;
