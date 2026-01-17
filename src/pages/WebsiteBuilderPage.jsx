import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  EyeIcon,
  CodeBracketIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const WebsiteBuilderPage = () => {
  const [sites, setSites] = useState([]);
  const [currentSite, setCurrentSite] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showCode, setShowCode] = useState(false);

  // Componentes disponibles
  const components = [
    { id: 'header', name: 'Encabezado', icon: DocumentTextIcon, category: 'layout' },
    { id: 'hero', name: 'Hero Section', icon: PhotoIcon, category: 'layout' },
    { id: 'navbar', name: 'Barra de navegación', icon: GlobeAltIcon, category: 'navigation' },
    { id: 'footer', name: 'Pie de página', icon: DocumentTextIcon, category: 'layout' },
    { id: 'gallery', name: 'Galería', icon: PhotoIcon, category: 'media' },
    { id: 'video', name: 'Video', icon: VideoCameraIcon, category: 'media' },
    { id: 'form', name: 'Formulario', icon: DocumentTextIcon, category: 'forms' },
    { id: 'pricing', name: 'Tabla de precios', icon: ChartBarIcon, category: 'commerce' },
    { id: 'products', name: 'Productos', icon: ShoppingBagIcon, category: 'commerce' },
    { id: 'testimonials', name: 'Testimonios', icon: ChatBubbleLeftRightIcon, category: 'content' },
    { id: 'blog', name: 'Blog', icon: DocumentTextIcon, category: 'content' },
    { id: 'contact', name: 'Contacto', icon: ChatBubbleLeftRightIcon, category: 'forms' }
  ];

  // Templates predefinidos
  const templates = [
    {
      id: 'legal',
      name: 'Sitio Legal',
      description: 'Perfecto para abogados y firmas legales',
      components: ['header', 'hero', 'navbar', 'pricing', 'contact', 'footer'],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'ecommerce',
      name: 'Tienda Online',
      description: 'Para vender productos y servicios',
      components: ['header', 'navbar', 'products', 'pricing', 'footer'],
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'portfolio',
      name: 'Portafolio',
      description: 'Muestra tu trabajo profesional',
      components: ['header', 'hero', 'gallery', 'testimonials', 'contact', 'footer'],
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'blog',
      name: 'Blog Personal',
      description: 'Comparte tus ideas y conocimientos',
      components: ['header', 'navbar', 'blog', 'footer'],
      color: 'from-orange-600 to-red-600'
    }
  ];

  // Estado del sitio actual
  const [siteData, setSiteData] = useState({
    name: '',
    domain: '',
    template: null,
    components: [],
    customCSS: '',
    customJS: '',
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    analytics: '',
    published: false
  });

  // Cargar sitios guardados
  useEffect(() => {
    const savedSites = localStorage.getItem('websites');
    if (savedSites) {
      setSites(JSON.parse(savedSites));
    }
  }, []);

  // Guardar sitios
  const saveSites = (newSites) => {
    localStorage.setItem('websites', JSON.stringify(newSites));
    setSites(newSites);
  };

  // Crear nuevo sitio
  const createNewSite = () => {
    const newSite = {
      id: Date.now(),
      ...siteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSites = [...sites, newSite];
    saveSites(updatedSites);
    setCurrentSite(newSite);
    toast.success('Sitio web creado exitosamente');
  };

  // Generar con IA
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Por favor describe qué tipo de sitio necesitas');
      return;
    }

    setIsGenerating(true);
    
    // Simulación de generación con IA
    setTimeout(() => {
      const generatedComponents = ['header', 'hero', 'navbar'];
      
      if (aiPrompt.toLowerCase().includes('tienda') || aiPrompt.toLowerCase().includes('vender')) {
        generatedComponents.push('products', 'pricing');
      }
      if (aiPrompt.toLowerCase().includes('blog')) {
        generatedComponents.push('blog');
      }
      if (aiPrompt.toLowerCase().includes('contacto')) {
        generatedComponents.push('contact', 'form');
      }
      
      generatedComponents.push('footer');
      
      setSiteData({
        ...siteData,
        components: generatedComponents,
        name: `Sitio generado con IA - ${new Date().toLocaleDateString()}`,
        seo: {
          title: 'Mi nuevo sitio web',
          description: aiPrompt,
          keywords: aiPrompt.split(' ').slice(0, 5).join(', ')
        }
      });
      
      setIsGenerating(false);
      toast.success('¡Sitio generado con IA exitosamente!');
    }, 3000);
  };

  // Agregar componente
  const addComponent = (componentId) => {
    if (!siteData.components.includes(componentId)) {
      setSiteData({
        ...siteData,
        components: [...siteData.components, componentId]
      });
      toast.success('Componente agregado');
    }
  };

  // Eliminar componente
  const removeComponent = (componentId) => {
    setSiteData({
      ...siteData,
      components: siteData.components.filter(c => c !== componentId)
    });
    toast.success('Componente eliminado');
  };

  // Publicar sitio
  const publishSite = () => {
    if (!siteData.name) {
      toast.error('Por favor ingresa un nombre para el sitio');
      return;
    }

    const updatedSite = {
      ...currentSite,
      ...siteData,
      published: true,
      publishedAt: new Date().toISOString()
    };

    const updatedSites = sites.map(s => 
      s.id === currentSite.id ? updatedSite : s
    );
    
    saveSites(updatedSites);
    setCurrentSite(updatedSite);
    toast.success('¡Sitio publicado exitosamente!');
  };

  // Eliminar sitio
  const deleteSite = (siteId) => {
    if (window.confirm('¿Estás seguro de eliminar este sitio?')) {
      const updatedSites = sites.filter(s => s.id !== siteId);
      saveSites(updatedSites);
      toast.success('Sitio eliminado');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <CodeBracketIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Constructor de Sitios Web</h1>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setUseAI(!useAI)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    useAI 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <SparklesIcon className="h-5 w-5 inline mr-2" />
                  {useAI ? 'Con IA' : 'Sin IA'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentSite && (
                <>
                  <div className="flex items-center gap-2 border-r pr-4">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                    >
                      <ComputerDesktopIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                    >
                      <DeviceTabletIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <CodeBracketIcon className="h-5 w-5 inline mr-2" />
                    Ver Código
                  </button>
                  
                  <button
                    onClick={publishSite}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg"
                  >
                    <RocketLaunchIcon className="h-5 w-5 inline mr-2" />
                    Publicar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {!showBuilder ? (
        // Lista de sitios
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Opciones de creación */}
          <div className="mb-8">
            {useAI ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white"
              >
                <h2 className="text-2xl font-bold mb-4">
                  <SparklesIcon className="h-8 w-8 inline mr-2" />
                  Crear con Inteligencia Artificial
                </h2>
                <p className="mb-6 text-purple-100">
                  Describe el sitio web que necesitas y nuestra IA lo creará por ti
                </p>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ej: Necesito un sitio web para mi bufete de abogados con servicios, blog y formulario de contacto"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={generateWithAI}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⚡</span>
                        Generando...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 inline mr-2" />
                        Generar Sitio
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Crear Nuevo Sitio</h2>
                
                {/* Templates */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Elige una plantilla</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSiteData({
                            ...siteData,
                            template: template.id,
                            components: template.components
                          });
                          setShowBuilder(true);
                        }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${template.color} text-white text-left`}
                      >
                        <h4 className="font-bold mb-1">{template.name}</h4>
                        <p className="text-sm opacity-90">{template.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => setShowBuilder(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-5 w-5 inline mr-2" />
                    Crear desde cero
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lista de sitios existentes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Mis Sitios Web</h2>
            
            {sites.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <GlobeAltIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No tienes sitios web creados aún</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <motion.div
                    key={site.id}
                    whileHover={{ y: -2 }}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{site.name}</h3>
                        <p className="text-sm text-gray-500">{site.domain || 'Sin dominio'}</p>
                      </div>
                      {site.published && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Publicado
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <ClockIcon className="h-4 w-4" />
                      {new Date(site.updatedAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentSite(site);
                          setSiteData(site);
                          setShowBuilder(true);
                        }}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        <PencilIcon className="h-4 w-4 inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setCurrentSite(site);
                          // Abrir preview
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSite(site.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Constructor de sitios
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Panel lateral */}
          <div className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4">
              {/* Información del sitio */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Información del Sitio</h3>
                <input
                  type="text"
                  placeholder="Nombre del sitio"
                  value={siteData.name}
                  onChange={(e) => setSiteData({...siteData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Dominio (opcional)"
                  value={siteData.domain}
                  onChange={(e) => setSiteData({...siteData, domain: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Componentes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Componentes</h3>
                <div className="space-y-2">
                  {components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => addComponent(component.id)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <component.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm">{component.name}</span>
                      </div>
                      <PlusIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">SEO</h3>
                <input
                  type="text"
                  placeholder="Título SEO"
                  value={siteData.seo.title}
                  onChange={(e) => setSiteData({
                    ...siteData,
                    seo: {...siteData.seo, title: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <textarea
                  placeholder="Descripción SEO"
                  value={siteData.seo.description}
                  onChange={(e) => setSiteData({
                    ...siteData,
                    seo: {...siteData.seo, description: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Palabras clave (separadas por comas)"
                  value={siteData.seo.keywords}
                  onChange={(e) => setSiteData({
                    ...siteData,
                    seo: {...siteData.seo, keywords: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Acciones */}
              <div className="space-y-2">
                <button
                  onClick={createNewSite}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                  Guardar Sitio
                </button>
                <button
                  onClick={() => setShowBuilder(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <XMarkIcon className="h-5 w-5 inline mr-2" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-gray-100 overflow-auto p-8">
            <div className={`mx-auto bg-white rounded-lg shadow-xl ${
              previewMode === 'mobile' ? 'max-w-sm' :
              previewMode === 'tablet' ? 'max-w-2xl' :
              'max-w-full'
            }`}>
              {showCode ? (
                <div className="p-6">
                  <h3 className="font-bold mb-4">Código HTML/CSS/JS</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <code>{`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${siteData.seo.title || 'Mi Sitio Web'}</title>
  <meta name="description" content="${siteData.seo.description}">
  <meta name="keywords" content="${siteData.seo.keywords}">
  <style>
    /* CSS personalizado */
    ${siteData.customCSS}
  </style>
</head>
<body>
  ${siteData.components.map(c => `
  <!-- Componente: ${c} -->
  <section id="${c}">
    <!-- Contenido del componente -->
  </section>
  `).join('')}
  
  <script>
    /* JavaScript personalizado */
    ${siteData.customJS}
  </script>
</body>
</html>
                    `}</code>
                  </pre>
                </div>
              ) : (
                <div className="min-h-[600px]">
                  {siteData.components.length === 0 ? (
                    <div className="flex items-center justify-center h-96 text-gray-400">
                      <div className="text-center">
                        <CodeBracketIcon className="h-16 w-16 mx-auto mb-4" />
                        <p>Agrega componentes para ver la vista previa</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {siteData.components.map((componentId) => {
                        const component = components.find(c => c.id === componentId);
                        return (
                          <div
                            key={componentId}
                            className="relative group border-b hover:bg-gray-50"
                          >
                            <div className="p-8">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                  <component.icon className="h-5 w-5" />
                                  {component?.name}
                                </h3>
                                <button
                                  onClick={() => removeComponent(componentId)}
                                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                              
                              {/* Contenido simulado del componente */}
                              <div className="bg-gray-100 rounded-lg p-4 min-h-[100px] flex items-center justify-center text-gray-500">
                                Contenido de {component?.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteBuilderPage;
