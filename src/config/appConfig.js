/**
 * Configuración global de la aplicación
 * 
 * Este archivo centraliza todas las configuraciones, API keys, enlaces sociales
 * y demás información importante para la aplicación.
 */

// Entorno de la aplicación
export const isProduction = typeof process !== 'undefined' ? process.env?.PROD : 
                           (typeof window !== 'undefined' ? window.__ENV__?.PROD : false);
export const isDevelopment = !isProduction;

// URLs base - siempre usar el origen actual en producción
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback para SSR o contextos sin window
  return 'https://abogados.ecuador.workers.dev';
};

// Información de contacto
export const contactInfo = {
  // Correos electrónicos
  emails: {
    primary: "ecuadorabogado1@gmail.com",
    secondary: "alexip2@hotmail.com"
  },
  
  // Teléfonos
  phones: {
    primary: "+593988835269",
    whatsappApi: "593988835269" // Sin el + para la API de WhatsApp
  },
  
  // Dirección
  address: "Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador",
  
  // Horario
  businessHours: "Lunes a Viernes: 8:00 - 18:00"
};

// Redes sociales
export const socialMedia = {
  // Facebook
  facebook: {
    pagina: "https://www.facebook.com/share/1AF7jU97kh/",
    groups: {
      derechoEcuador: "https://www.facebook.com/groups/1409181976927303/?ref=share&mibextid=NSMWBT",
      abogadosEcuador: "https://www.facebook.com/groups/1046470634036664/?ref=share&mibextid=NSMWBT"
    }
  },
  
  // Twitter/X
  twitter: {
    profile: "https://x.com/Wilsonelm?t=e_4JumFg2kRM5Baa_pP2JA&s=09",
    username: "@wilsonelm"
  },
  
  // WhatsApp
  whatsapp: {
    comunidad: "https://chat.whatsapp.com/IcEzDg0dFay5xmzV8NeQpA",
    grupo: "https://chat.whatsapp.com/JI57y20YAsXAzvxpegahUd",
    api: `https://wa.me/593988835269`
  }
};

// Servicios externos y APIs
export const externalServices = {
  // n8n
  n8n: {
    baseUrl: "https://n8n-latest-hurl.onrender.com",
    webhooks: {
      production: "https://n8n-latest-hurl.onrender.com"
    },
    deployHook: import.meta.env.VITE_RENDER_DEPLOY_HOOK || ""
  },
  
  // OpenRouter para IA
  openRouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || ""
  },
  
  // Turso Database
  turso: {
    databaseUrl: "libsql://abogadowilson-abogadowilson.turso.io",
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || ""
  },
  
  // Prisma
  prisma: {
    databaseUrl: import.meta.env.VITE_PRISMA_DATABASE_URL || "",
    apiKey: import.meta.env.VITE_PRISMA_API_KEY || ""
  }
};

// Configuración de Cloudflare
export const cloudflareConfig = {
  accountId: "70661c46051942965565a5c976219dde",
  apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "",
  kvNamespaceId: "9585583f15824e6891e9660bd6f85d7d",
  d1DatabaseId: "029949b9-4266-4060-8bcd-71525b26600c",
  workersAI: import.meta.env.VITE_CLOUDFLARE_WORKERS_AI_TOKEN || "",
  globalApiKey: import.meta.env.VITE_CLOUDFLARE_GLOBAL_API_KEY || "",
  originCA: import.meta.env.VITE_CLOUDFLARE_ORIGIN_CA || "",
  createToken: import.meta.env.VITE_CLOUDFLARE_CREATE_TOKEN || "",
  workersEdit: import.meta.env.VITE_CLOUDFLARE_WORKERS_EDIT_TOKEN || "",
  dnsToken: import.meta.env.VITE_CLOUDFLARE_DNS_TOKEN || "",
  subdomain: "ecuador.workers.dev",
  workerUrl: "https://abogados.ecuador.workers.dev",
  // URL alternativa del worker
  workerUrlAlt: "https://abogado-wilson.anipets12.workers.dev"
};

// Configuración de Supabase - PRODUCCIÓN
export const supabaseConfig = {
  url: typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : 
      (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_URL : 
      ''),
  key: typeof process !== 'undefined' ? (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_KEY) : 
      (typeof window !== 'undefined' ? (window.__ENV__?.VITE_SUPABASE_ANON_KEY || window.__ENV__?.VITE_SUPABASE_KEY) : 
      ''),
  databasePassword: typeof process !== 'undefined' ? process.env?.SUPABASE_DB_PASSWORD : (import.meta.env.VITE_SUPABASE_DB_PASSWORD || ''),
  orgName: 'abogadosecuador\'s Org',
  projectName: 'abogadosecuador\'s Project',
  headers: {
    'X-Client-Info': 'abogadosecuador-production'
  }
};

// Configuración de correo electrónico
export const emailConfig = {
  serviceId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_SERVICE_ID : 
            (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_SERVICE_ID : 'default_service'),
  templateId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_TEMPLATE_ID : 
             (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_TEMPLATE_ID : 'default_template'),
  userId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_USER_ID : 
         (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_USER_ID : 'default_user')
};

// Configuración de reCAPTCHA
export const recaptchaConfig = {
  siteKey: typeof process !== 'undefined' ? process.env?.VITE_RECAPTCHA_SITE_KEY : 
          (typeof window !== 'undefined' ? window.__ENV__?.VITE_RECAPTCHA_SITE_KEY : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'), // Clave de prueba
};

// Configuración de Turnstile
export const turnstileConfig = {
  siteKey: typeof process !== 'undefined' ? process.env?.VITE_TURNSTILE_SITE_KEY : 
          (typeof window !== 'undefined' ? window.__ENV__?.VITE_TURNSTILE_SITE_KEY : '0x4AAAAAAABY3h5dF4SWQyP'),
};

// URLs del API
export const apiUrls = {
  base: typeof process !== 'undefined' ? process.env?.VITE_API_URL : 
       (typeof window !== 'undefined' ? window.__ENV__?.VITE_API_URL : '/api'),
  blog: '/api/blog',
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  courses: '/api/courses',
  ebooks: '/api/ebooks',
  consultation: '/api/consultation',
  checkout: '/api/checkout',
};

// Configuración JWT
export const jwtConfig = {
  secret: typeof process !== 'undefined' ? (process.env.JWT_SECRET || '') : (import.meta.env.VITE_JWT_SECRET || ''),
  expiresIn: "7d" // 7 días
};

// Exportar configuración completa
export default {
  isProduction,
  isDevelopment,
  getBaseUrl,
  contactInfo,
  socialMedia,
  externalServices,
  cloudflareConfig,
  supabaseConfig,
  emailConfig,
  recaptchaConfig,
  turnstileConfig,
  apiUrls,
  jwtConfig
};
