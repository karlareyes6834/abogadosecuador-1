import { supabase } from '../config/supabase';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'guest';
  createdAt: string;
  balance: number;
  tokens: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Validar contraseña
      if (password.length < 8) {
        return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
      }

      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // Crear registro en tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user?.id,
            email,
            nombre: name,
            password_hash: hashedPassword,
            rol: 'client',
            balance: 0,
            tokens: 0,
            creado_en: new Date().toISOString(),
            activo: true
          }
        ])
        .select()
        .single();

      if (userError) {
        return { success: false, error: userError.message };
      }

      // Registrar en log de actividad
      await this.logActivity(authData.user?.id || '', 'REGISTRO', 'Usuario registrado exitosamente');

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.nombre,
          role: userData.rol,
          createdAt: userData.creado_en,
          balance: userData.balance,
          tokens: userData.tokens
        },
        token: authData.session?.access_token
      };
    } catch (error) {
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Autenticar con Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { success: false, error: 'Email o contraseña incorrectos' };
      }

      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (userError || !userData) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Registrar login en log de actividad
      await this.logActivity(userData.id, 'LOGIN', 'Inicio de sesión exitoso');

      // Guardar en localStorage para sincronización con subproyectos
      const userData_sync = {
        id: userData.id,
        email: userData.email,
        name: userData.nombre,
        tier: userData.rol === 'admin' ? 'ADMIN' : 'STANDARD',
        isVerified: true,
        joinedAt: userData.creado_en,
        language: 'ES',
        theme: 'NEXUS',
        xp: 1200,
        level: 3,
        streak: 5
      };
      localStorage.setItem('wi_user', JSON.stringify(userData_sync));
      localStorage.setItem('nexuspro_user', JSON.stringify(userData_sync));

      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.nombre,
          role: userData.rol,
          createdAt: userData.creado_en,
          balance: userData.balance,
          tokens: userData.tokens
        },
        token: authData.session?.access_token
      };
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('wi_user');
      localStorage.removeItem('nexuspro_user');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userData) return null;

      return {
        id: userData.id,
        email: userData.email,
        name: userData.nombre,
        role: userData.rol,
        createdAt: userData.creado_en,
        balance: userData.balance,
        tokens: userData.tokens
      };
    } catch (error) {
      return null;
    }
  }

  async updateBalance(userId: string, amount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ balance: amount })
        .eq('id', userId);

      if (error) return false;

      await this.logActivity(userId, 'BALANCE_UPDATE', `Balance actualizado: ${amount}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateTokens(userId: string, amount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ tokens: amount })
        .eq('id', userId);

      if (error) return false;

      await this.logActivity(userId, 'TOKENS_UPDATE', `Tokens actualizados: ${amount}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async logActivity(userId: string, action: string, description: string): Promise<void> {
    try {
      await supabase
        .from('activity_logs')
        .insert([
          {
            usuario_id: userId,
            accion: action,
            descripcion: description,
            timestamp: new Date().toISOString(),
            ip_address: await this.getClientIP()
          }
        ]);
    } catch (error) {
      console.error('Error al registrar actividad:', error);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }
}

export default new AuthService();
