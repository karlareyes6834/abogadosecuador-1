import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export interface ProgresJuego {
  id: string;
  userId: string;
  gameId: string;
  nivel: number;
  puntuacion: number;
  tiempoJugado: number;
  logrosDesbloqueados: string[];
  ultimaJugada: string;
  completado: boolean;
}

export interface EstadisticasUsuario {
  userId: string;
  totalTokens: number;
  totalXP: number;
  nivel: number;
  juegosComprados: number;
  juegosCompletados: number;
  horasJugadas: number;
  ultimaActividad: string;
}

export class GameProgressService {
  static async guardarProgreso(
    userId: string,
    gameId: string,
    nivel: number,
    puntuacion: number,
    tiempoJugado: number,
    logros: string[] = []
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_progress')
        .upsert({
          user_id: userId,
          game_id: gameId,
          level: nivel,
          score: puntuacion,
          time_played: tiempoJugado,
          achievements: logros,
          last_played: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,game_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error guardando progreso:', error);
      throw error;
    }
  }

  static async obtenerProgreso(userId: string, gameId: string): Promise<ProgresJuego | null> {
    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      return null;
    }
  }

  static async obtenerTodosLosProgresos(userId: string): Promise<ProgresJuego[]> {
    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_played', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo progresos:', error);
      return [];
    }
  }

  static async agregarTokens(userId: string, cantidad: number, razon: string): Promise<number> {
    try {
      const { data: datosActuales } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const nuevoBalance = (datosActuales?.balance || 0) + cantidad;

      const { error: errorUpdate } = await supabase
        .from('user_tokens')
        .update({ balance: nuevoBalance })
        .eq('user_id', userId);

      if (errorUpdate) throw errorUpdate;

      // Registrar transacción
      await supabase
        .from('token_transactions')
        .insert({
          user_id: userId,
          tipo: 'recompensa',
          cantidad: cantidad,
          razon: razon,
          fecha: new Date().toISOString()
        });

      return nuevoBalance;
    } catch (error) {
      console.error('Error agregando tokens:', error);
      throw error;
    }
  }

  static async agregarXP(userId: string, cantidad: number): Promise<number> {
    try {
      const { data: datosActuales } = await supabase
        .from('user_profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      const xpActual = datosActuales?.xp || 0;
      const nuevoXP = xpActual + cantidad;
      
      // Calcular nuevo nivel (cada 1000 XP = 1 nivel)
      const nuevoNivel = Math.floor(nuevoXP / 1000) + 1;

      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          xp: nuevoXP,
          level: nuevoNivel
        })
        .eq('id', userId);

      if (error) throw error;

      return nuevoNivel;
    } catch (error) {
      console.error('Error agregando XP:', error);
      throw error;
    }
  }

  static async desbloquearLogro(userId: string, gameId: string, logroId: string): Promise<void> {
    try {
      const progreso = await this.obtenerProgreso(userId, gameId);
      const logrosActuales = progreso?.logrosDesbloqueados || [];

      if (!logrosActuales.includes(logroId)) {
        logrosActuales.push(logroId);
        
        await supabase
          .from('game_progress')
          .update({ achievements: logrosActuales })
          .eq('user_id', userId)
          .eq('game_id', gameId);
      }
    } catch (error) {
      console.error('Error desbloqueando logro:', error);
      throw error;
    }
  }

  static async obtenerEstadisticas(userId: string): Promise<EstadisticasUsuario | null> {
    try {
      const { data: datosTokens } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const { data: datosPerfil } = await supabase
        .from('user_profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      const { data: juegosComprados } = await supabase
        .from('user_games')
        .select('id')
        .eq('user_id', userId);

      const { data: progresos } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId);

      const juegosCompletados = (progresos || []).filter(p => p.completed).length;
      const tiempoTotal = (progresos || []).reduce((sum: number, p: any) => sum + (p.time_played || 0), 0);

      return {
        userId,
        totalTokens: datosTokens?.balance || 0,
        totalXP: datosPerfil?.xp || 0,
        nivel: datosPerfil?.level || 1,
        juegosComprados: juegosComprados?.length || 0,
        juegosCompletados,
        horasJugadas: Math.round(tiempoTotal / 3600),
        ultimaActividad: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  static async comprarJuego(userId: string, gameId: string, precioTokens: number): Promise<boolean> {
    try {
      // Verificar saldo
      const { data: datosTokens } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const saldoActual = datosTokens?.balance || 0;
      if (saldoActual < precioTokens) {
        throw new Error('Saldo insuficiente');
      }

      // Restar tokens
      const { error: errorTokens } = await supabase
        .from('user_tokens')
        .update({ balance: saldoActual - precioTokens })
        .eq('user_id', userId);

      if (errorTokens) throw errorTokens;

      // Agregar juego a propiedad
      const { error: errorJuego } = await supabase
        .from('user_games')
        .insert({
          user_id: userId,
          game_id: gameId,
          purchased_at: new Date().toISOString()
        });

      if (errorJuego) throw errorJuego;

      // Registrar transacción
      await supabase
        .from('token_transactions')
        .insert({
          user_id: userId,
          tipo: 'compra_juego',
          cantidad: -precioTokens,
          game_id: gameId,
          fecha: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Error comprando juego:', error);
      throw error;
    }
  }

  static async verificarPropiedad(userId: string, gameId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .select('id')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error verificando propiedad:', error);
      return false;
    }
  }
}

export default GameProgressService;
