// Servicio de autenticación local sin dependencia de Supabase
// Funciona completamente en localStorage

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  error?: string;
}

const USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'app_current_user';

export const localAuthService = {
  // Obtener todos los usuarios registrados
  getAllUsers: (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Registrar nuevo usuario
  register: (email: string, password: string, name: string): AuthResponse => {
    try {
      const users = localAuthService.getAllUsers();

      // Validar que el email no exista
      if (users.some(u => u.email === email)) {
        return {
          success: false,
          message: 'El email ya está registrado',
          error: 'Email already exists'
        };
      }

      // Validar email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
          success: false,
          message: 'Email inválido',
          error: 'Invalid email'
        };
      }

      // Validar contraseña
      if (!password || password.length < 8) {
        return {
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres',
          error: 'Password too short'
        };
      }

      // Validar nombre
      if (!name || name.trim().length < 2) {
        return {
          success: false,
          message: 'El nombre debe tener al menos 2 caracteres',
          error: 'Name too short'
        };
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: name.trim(),
        password, // En producción, esto debería estar hasheado
        createdAt: new Date().toISOString()
      };

      // Guardar usuario
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Auto-login después del registro
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).password;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return {
        success: true,
        message: 'Registro exitoso',
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Iniciar sesión
  login: (email: string, password: string): AuthResponse => {
    try {
      const users = localAuthService.getAllUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return {
          success: false,
          message: 'Email o contraseña incorrectos',
          error: 'Invalid credentials'
        };
      }

      // Guardar usuario actual
      const userWithoutPassword = { ...user };
      delete (userWithoutPassword as any).password;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al iniciar sesión',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Cerrar sesión
  logout: (): AuthResponse => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      return {
        success: true,
        message: 'Sesión cerrada'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al cerrar sesión',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  }
};

export default localAuthService;
