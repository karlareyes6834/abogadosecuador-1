// Determinar la URL de API según el entorno
const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8787';
  }
  // En producción, usar la URL actual del worker
  return typeof window !== 'undefined' ? window.location.origin : 'https://abogados.ecuador.workers.dev';
};

export const globalConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || '',
  apiUrl: getApiUrl(),
  isDevelopment: import.meta.env.DEV || false,
  isProduction: import.meta.env.PROD || true,
  VITE_SUPABASE_CLIENT_INSTANCE_ID: 'abogadosecuador-production'
};

export default globalConfig;
