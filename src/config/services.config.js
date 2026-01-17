/**
 * Configuración de todos los servicios externos - PRODUCCIÓN
 * Este archivo centraliza todas las credenciales y configuraciones de APIs
 */

// =======================================
// PAYPAL - SISTEMA DE PAGOS
// =======================================
export const paypalConfig = {
  clientId: 'AWxKgr5n7ex5Lc3fDBOooaVHLgcAB-KCrYXgCmit9DpNXFIuBa6bUypYFjr-hAqARlILGxk_rRTsBZeS',
  clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
  mode: import.meta.env.VITE_PAYPAL_MODE || 'live', // 'sandbox' o 'live'
  currency: 'USD',
  paypalMe: 'https://paypal.me/asumerced',
  // Credenciales Sandbox para testing
  sandbox: {
    email: 'sb-efolr38427740@business.example.com',
    password: import.meta.env.VITE_PAYPAL_SANDBOX_PASSWORD || '',
    clientId: 'ARZdFZthRzwMXmYc9wtf0Zs4GVMHMbwVGE54_tzngzBT3OWjk4QT89XBVpcvZ57nYmNAZIJf1S4xgr7w',
    clientSecret: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_SECRET || ''
  }
};

// =======================================
// CLOUDINARY - GESTIÓN DE IMÁGENES
// =======================================
export const cloudinaryConfig = {
  cloudName: 'dg3s7tqoj',
  apiKey: '673776954212897',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  // Upload preset para imágenes
  uploadPresets: {
    products: 'products_preset',
    avatars: 'avatars_preset',
    documents: 'documents_preset'
  },
  // URLs
  baseUrl: 'https://api.cloudinary.com/v1_1/dg3s7tqoj',
  cdnUrl: `https://res.cloudinary.com/dg3s7tqoj`,
  // Configuración adicional
  untitledId: '471365939631829',
  untitledSecret: import.meta.env.VITE_CLOUDINARY_UNTITLED_SECRET || ''
};

// =======================================
// GOOGLE APIS - GEMINI Y SERVICIOS
// =======================================
export const googleConfig = {
  // Google Maps y servicios generales
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  projectName: 'abgapi',
  projectId: 'projects/885423115993',
  projectNumber: '885423115993',
  // Gemini AI
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta'
  }
};

// =======================================
// GITHUB - INTEGRACIÓN Y DEPLOY
// =======================================
export const githubConfig = {
  // Tokens de acceso
  tokens: {
    main: import.meta.env.VITE_GITHUB_TOKEN || '',
    windsurf: import.meta.env.VITE_GITHUB_WINDSURF_TOKEN || '',
    api: import.meta.env.VITE_GITHUB_API_TOKEN || ''
  },
  account: 'ecuadorabogado1@gmail.com'
};

// =======================================
// CLOUDFLARE WORKERS & DATABASES
// =======================================
export const cloudflareServices = {
  // Account Info
  accountId: '70661c46051942965565a5c976219dde',
  
  // Workers AI
  workersAI: {
    apiToken: import.meta.env.VITE_CLOUDFLARE_API_TOKEN || '',
    verifyUrl: 'https://api.cloudflare.com/client/v4/accounts/70661c46051942965565a5c976219dde/tokens/verify'
  },
  
  // KV Database
  kv: {
    namespaceId: '9585583f15824e6891e9660bd6f85d7d',
    binding: 'KV',
    databaseId: '0757f29fc8264ce985de8d780283d86e'
  },
  
  // D1 Database
  d1: {
    databaseId: '029949b9-4266-4060-8bcd-71525b26600c',
    databaseName: 'abogadosecuador',
    binding: 'DB',
    backupId: '0757f29fc8264ce985de8d780283d86e'
  },
  
  // API Tokens
  tokens: {
    global: import.meta.env.VITE_CLOUDFLARE_GLOBAL_API_KEY || '',
    originCA: import.meta.env.VITE_CLOUDFLARE_ORIGIN_CA || '',
    create: import.meta.env.VITE_CLOUDFLARE_CREATE_TOKEN || '',
    workersEdit: import.meta.env.VITE_CLOUDFLARE_WORKERS_EDIT_TOKEN || '',
    dns: import.meta.env.VITE_CLOUDFLARE_DNS_TOKEN || ''
  },
  
  // Worker deployment
  worker: {
    subdomain: 'ecuador.workers.dev',
    url: 'https://abogados.ecuador.workers.dev',
    name: 'abogados'
  }
};

// =======================================
// SUPABASE - BASE DE DATOS PRINCIPAL
// =======================================
export const supabaseFullConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || '',
  databasePassword: '',
  organization: 'abogadosecuador\'s Org',
  project: 'abogadosecuador\'s Project',
  // Configuración de conexión
  config: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
};

// =======================================
// N8N - AUTOMATIZACIÓN Y WEBHOOKS
// =======================================
export const n8nConfig = {
  serviceId: 'srv-d31573gdl3ps73e2rdn0',
  baseUrl: 'https://n8n-latest-hurl.onrender.com',
  deployHook: import.meta.env.VITE_RENDER_DEPLOY_HOOK || '',
  webhooks: {
    main: 'https://n8n-latest-hurl.onrender.com'
  }
};

// =======================================
// CONTACTO Y COMUNICACIÓN
// =======================================
export const communicationConfig = {
  email: 'ecuadorabogado1@gmail.com',
  whatsapp: {
    number: '+593988835269',
    api: '593988835269',
    link: 'https://wa.me/593988835269'
  }
};

// =======================================
// EXPORTAR TODA LA CONFIGURACIÓN
// =======================================
export default {
  paypal: paypalConfig,
  cloudinary: cloudinaryConfig,
  google: googleConfig,
  github: githubConfig,
  cloudflare: cloudflareServices,
  supabase: supabaseFullConfig,
  n8n: n8nConfig,
  communication: communicationConfig
};
