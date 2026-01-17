/**
 * Este archivo ahora importa el cliente único de supabaseService
 * Para evitar múltiples instancias de GoTrueClient y problemas de sincronización
 * 
 * IMPORTANTE: No crear nuevas instancias aquí, usar el cliente único
 */

import { supabase, supabaseService } from '../services/supabaseService';

// Exportar el cliente único
export { supabase };

// Utilidad para verificar la conexión con Supabase
export const testSupabaseConnection = async () => {
  return await supabaseService.checkConnection();
};

export default supabase;
