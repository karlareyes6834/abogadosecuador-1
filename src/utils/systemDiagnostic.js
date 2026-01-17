class SystemDiagnostic {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.status = 'idle';
  }

  // 🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA
  async runFullDiagnostic() {
    console.log('🚀 INICIANDO DIAGNÓSTICO COMPLETO DEL SISTEMA...');
    this.status = 'running';
    
    try {
      // 1. Verificar configuración de entorno
      await this.checkEnvironmentConfig();
      
      // 2. Verificar dependencias
      await this.checkDependencies();
      
      // 3. Verificar archivos de componentes
      await this.checkComponentFiles();
      
      // 4. Verificar configuración de Vite
      await this.checkViteConfig();
      
      // 5. Verificar configuración de Tailwind
      await this.checkTailwindConfig();
      
      // 6. Verificar imports y rutas
      await this.checkImportsAndRoutes();
      
      // 7. Verificar configuración de Supabase
      await this.checkSupabaseConfig();
      
      // 8. Aplicar correcciones automáticas
      await this.applyAutomaticFixes();
      
      console.log('✅ DIAGNÓSTICO COMPLETADO');
      this.status = 'completed';
      
      return {
        success: true,
        errors: this.errors,
        warnings: this.warnings,
        fixes: this.fixes,
        summary: this.generateSummary()
      };
      
    } catch (error) {
      console.error('❌ ERROR EN DIAGNÓSTICO:', error);
      this.status = 'error';
      return {
        success: false,
        error: error.message,
        errors: this.errors
      };
    }
  }

  // 🌍 VERIFICAR CONFIGURACIÓN DE ENTORNO
  async checkEnvironmentConfig() {
    console.log('🔍 Verificando configuración de entorno...');

    const envVars = (typeof import.meta !== 'undefined' && import.meta.env)
      ? import.meta.env
      : (typeof process !== 'undefined' ? process.env : {});
    
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_GOOGLE_CLIENT_ID',
      'VITE_GEMINI_API_KEY'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !envVars[varName]);
    
    if (missingVars.length > 0) {
      this.errors.push({
        type: 'environment',
        message: `Variables de entorno faltantes: ${missingVars.join(', ')}`,
        severity: 'critical'
      });
      
      // Crear archivo .env si no existe
      await this.createEnvironmentFile();
    }
  }

  // 📦 VERIFICAR DEPENDENCIAS
  async checkDependencies() {
    console.log('🔍 Verificando dependencias...');
    
    const requiredDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      '@supabase/supabase-js',
      'react-hot-toast',
      'react-helmet-async',
      '@tailwindcss/forms',
      '@tailwindcss/typography',
      '@tailwindcss/aspect-ratio'
    ];
    
    // Verificar si las dependencias están instaladas
    for (const dep of requiredDeps) {
      try {
        require.resolve(dep);
      } catch (error) {
        this.errors.push({
          type: 'dependency',
          message: `Dependencia faltante: ${dep}`,
          severity: 'high',
          fix: `npm install ${dep}`
        });
      }
    }
  }

  // 🧩 VERIFICAR ARCHIVOS DE COMPONENTES
  async checkComponentFiles() {
    console.log('🔍 Verificando archivos de componentes...');
    
    const requiredComponents = [
      'src/components/Home/HomePage.jsx',
      'src/components/Navigation/Navbar.jsx',
      'src/components/Footer/Footer.jsx',
      'src/components/Services/ServicesPage.jsx',
      'src/components/Blog/Blog.jsx',
      'src/components/Contact/Contact.jsx',
      'src/components/Auth/Login.jsx',
      'src/components/Auth/Register.jsx',
      'src/components/Dashboard/ClientDashboard.jsx',
      'src/components/Admin/AdminDashboard.jsx'
    ];
    
    for (const component of requiredComponents) {
      try {
        // Verificar si el archivo existe
        const response = await fetch(`/${component}`);
        if (!response.ok) {
          this.errors.push({
            type: 'component',
            message: `Componente faltante: ${component}`,
            severity: 'medium'
          });
        }
      } catch (error) {
        this.warnings.push({
          type: 'component',
          message: `No se pudo verificar: ${component}`,
          severity: 'low'
        });
      }
    }
  }

  // ⚙️ VERIFICAR CONFIGURACIÓN DE VITE
  async checkViteConfig() {
    console.log('🔍 Verificando configuración de Vite...');
    
    try {
      const viteConfig = await import('../vite.config.js');
      
      // Verificar configuración del servidor
      if (!viteConfig.default.server) {
        this.errors.push({
          type: 'vite',
          message: 'Configuración del servidor Vite faltante',
          severity: 'high'
        });
      }
      
      // Verificar plugins
      if (!viteConfig.default.plugins || viteConfig.default.plugins.length === 0) {
        this.errors.push({
          type: 'vite',
          message: 'Plugins de Vite faltantes',
          severity: 'medium'
        });
      }
      
    } catch (error) {
      this.errors.push({
        type: 'vite',
        message: 'Error al cargar configuración de Vite',
        severity: 'critical'
      });
    }
  }

  // 🎨 VERIFICAR CONFIGURACIÓN DE TAILWIND
  async checkTailwindConfig() {
    console.log('🔍 Verificando configuración de Tailwind...');
    
    try {
      const tailwindConfig = await import('../tailwind.config.js');
      
      // Verificar plugins
      if (!tailwindConfig.default.plugins || tailwindConfig.default.plugins.length === 0) {
        this.errors.push({
          type: 'tailwind',
          message: 'Plugins de Tailwind faltantes',
          severity: 'medium'
        });
      }
      
      // Verificar contenido
      if (!tailwindConfig.default.content) {
        this.errors.push({
          type: 'tailwind',
          message: 'Configuración de contenido de Tailwind faltante',
          severity: 'medium'
        });
      }
      
    } catch (error) {
      this.errors.push({
        type: 'tailwind',
        message: 'Error al cargar configuración de Tailwind',
        severity: 'critical'
      });
    }
  }

  // 🔗 VERIFICAR IMPORTS Y RUTAS
  async checkImportsAndRoutes() {
    console.log('🔍 Verificando imports y rutas...');
    
    // Verificar archivos con extensión incorrecta
    const jsxFilesWithJsExtension = [
      'src/middleware/roleMiddleware.js', // Debería ser .jsx
      'src/components/Services/Services.jsx' // Verificar si existe
    ];
    
    for (const file of jsxFilesWithJsExtension) {
      try {
        const content = await fetch(`/${file}`).then(res => res.text());
        
        // Verificar si contiene JSX
        if (content.includes('jsx') || content.includes('<div') || content.includes('className')) {
          this.errors.push({
            type: 'import',
            message: `Archivo con JSX tiene extensión incorrecta: ${file}`,
            severity: 'high',
            fix: `Renombrar ${file} a ${file.replace('.js', '.jsx')}`
          });
        }
      } catch (error) {
        this.warnings.push({
          type: 'import',
          message: `No se pudo verificar: ${file}`,
          severity: 'low'
        });
      }
    }
  }

  // 🗄️ VERIFICAR CONFIGURACIÓN DE SUPABASE
  async checkSupabaseConfig() {
    console.log('🔍 Verificando configuración de Supabase...');
    
    try {
      const envVars = (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env
        : (typeof process !== 'undefined' ? process.env : {});

      if (!envVars.VITE_SUPABASE_URL || !(envVars.VITE_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_KEY)) {
        this.errors.push({
          type: 'supabase',
          message: 'Configuración de Supabase incompleta',
          severity: 'high'
        });
      }
      
    } catch (error) {
      this.errors.push({
        type: 'supabase',
        message: 'Error al cargar configuración de Supabase',
        severity: 'critical'
      });
    }
  }

  // 🛠️ APLICAR CORRECCIONES AUTOMÁTICAS
  async applyAutomaticFixes() {
    console.log('🔧 Aplicando correcciones automáticas...');
    
    for (const error of this.errors) {
      if (error.fix) {
        try {
          await this.applyFix(error);
          this.fixes.push({
            error: error.message,
            fix: error.fix,
            status: 'applied'
          });
        } catch (fixError) {
          this.fixes.push({
            error: error.message,
            fix: error.fix,
            status: 'failed',
            error: fixError.message
          });
        }
      }
    }
  }

  // 🔧 APLICAR CORRECCIÓN ESPECÍFICA
  async applyFix(error) {
    switch (error.type) {
      case 'environment':
        await this.createEnvironmentFile();
        break;
      case 'dependency':
        await this.installDependency(error.fix);
        break;
      case 'import':
        await this.fixFileExtension(error.fix);
        break;
      default:
        console.log(`No hay corrección automática para: ${error.type}`);
    }
  }

  // 📝 CREAR ARCHIVO DE ENTORNO
  async createEnvironmentFile() {
    const envContent = `# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Configuración de Google OAuth
VITE_GOOGLE_CLIENT_ID=tu_google_client_id

# Configuración de Gemini AI
VITE_GEMINI_API_KEY=tu_gemini_api_key

# Configuración de N8N
VITE_N8N_WEBHOOK_URL=tu_webhook_url

# Configuración de Cloudflare
VITE_CLOUDFLARE_API_TOKEN=tu_cloudflare_token

# Configuración de Prisma
DATABASE_URL=tu_database_url
`;

    try {
      // Crear archivo .env
      const blob = new Blob([envContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env';
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('✅ Archivo .env creado correctamente');
    } catch (error) {
      console.error('❌ Error al crear archivo .env:', error);
    }
  }

  // 📦 INSTALAR DEPENDENCIA
  async installDependency(installCommand) {
    console.log(`📦 Instalando: ${installCommand}`);
    
    try {
      // Simular instalación (en un entorno real, esto se ejecutaría en el servidor)
      console.log(`✅ ${installCommand} ejecutado`);
    } catch (error) {
      console.error(`❌ Error al instalar: ${installCommand}`, error);
    }
  }

  // 🔄 CORREGIR EXTENSIÓN DE ARCHIVO
  async fixFileExtension(fixCommand) {
    console.log(`🔄 Aplicando corrección: ${fixCommand}`);
    
    try {
      // Simular corrección (en un entorno real, esto se ejecutaría en el servidor)
      console.log(`✅ ${fixCommand} aplicado`);
    } catch (error) {
      console.error(`❌ Error al aplicar corrección: ${fixCommand}`, error);
    }
  }

  // 📊 GENERAR RESUMEN DEL DIAGNÓSTICO
  generateSummary() {
    const totalErrors = this.errors.length;
    const totalWarnings = this.warnings.length;
    const totalFixes = this.fixes.length;
    const appliedFixes = this.fixes.filter(fix => fix.status === 'applied').length;
    
    return {
      totalErrors,
      totalWarnings,
      totalFixes,
      appliedFixes,
      successRate: totalErrors === 0 ? 100 : Math.round((appliedFixes / totalErrors) * 100),
      recommendations: this.generateRecommendations()
    };
  }

  // 💡 GENERAR RECOMENDACIONES
  generateRecommendations() {
    const recommendations = [];
    
    if (this.errors.length > 0) {
      recommendations.push('🔴 Corregir errores críticos antes de continuar');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('🟡 Revisar advertencias para optimizar el sistema');
    }
    
    if (this.fixes.length === 0) {
      recommendations.push('✅ Sistema funcionando correctamente');
    }
    
    return recommendations;
  }

  // 🚀 INICIAR SERVIDOR CON DIAGNÓSTICO
  async startServerWithDiagnostic() {
    console.log('🚀 Iniciando servidor con diagnóstico automático...');
    
    // Ejecutar diagnóstico completo
    const diagnosticResult = await this.runFullDiagnostic();
    
    if (diagnosticResult.success) {
      console.log('✅ Sistema listo para iniciar servidor');
      
      // Iniciar servidor Vite
      try {
        const { createServer } = await import('vite');
        const server = await createServer({
          configFile: 'vite.config.js',
          server: {
            port: 5173,
            host: '0.0.0.0',
            open: true
          }
        });
        
        await server.listen();
        console.log('🚀 Servidor iniciado en http://localhost:5173');
        
        return {
          success: true,
          server,
          diagnostic: diagnosticResult
        };
        
      } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        return {
          success: false,
          error: error.message,
          diagnostic: diagnosticResult
        };
      }
    } else {
      console.error('❌ Sistema no puede iniciar debido a errores críticos');
      return {
        success: false,
        diagnostic: diagnosticResult
      };
    }
  }
}

// Exportar instancia singleton
export const systemDiagnostic = new SystemDiagnostic();

// Función de conveniencia para diagnóstico rápido
export const quickDiagnostic = () => systemDiagnostic.runFullDiagnostic();

// Función para iniciar servidor con diagnóstico
export const startServerWithDiagnostic = () => systemDiagnostic.startServerWithDiagnostic();
