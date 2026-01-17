import React, { useState } from 'react';
import { FaMagic, FaRobot, FaPlus, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const AIContentGenerator = () => {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Derecho Penal');
  const [bulkCount, setBulkCount] = useState(5);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);

  // Simulador de generación con IA (puedes integrar OpenAI, Anthropic, etc.)
  const generateContentWithAI = async (topicPrompt, categoryPrompt) => {
    // Aquí integrarías una API de IA real (OpenAI, Claude, etc.)
    // Por ahora, generamos contenido de ejemplo estructurado
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de API

    const templates = {
      'Derecho Penal': {
        keywords: ['delito', 'condena', 'defensa', 'proceso penal', 'derechos'],
        structure: ['Introducción', 'Marco Legal', 'Jurisprudencia', 'Consecuencias', 'Conclusión']
      },
      'Derecho Civil': {
        keywords: ['contrato', 'obligaciones', 'responsabilidad', 'patrimonio', 'derechos'],
        structure: ['Introducción', 'Normativa', 'Casos Prácticos', 'Recomendaciones', 'Conclusión']
      },
      'Derecho Laboral': {
        keywords: ['trabajador', 'empleador', 'contrato', 'indemnización', 'despido'],
        structure: ['Introducción', 'Legislación', 'Derechos y Obligaciones', 'Procedimientos', 'Conclusión']
      }
    };

    const template = templates[categoryPrompt] || templates['Derecho Penal'];
    
    const title = `${topicPrompt} - Guía Completa en ${categoryPrompt}`;
    const excerpt = `Análisis detallado sobre ${topicPrompt.toLowerCase()} en el contexto del ${categoryPrompt.toLowerCase()}. Conoce tus derechos y las implicaciones legales.`;
    
    let content = `# ${title}\n\n`;
    
    template.structure.forEach((section, idx) => {
      content += `## ${idx + 1}. ${section}\n\n`;
      content += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. En este apartado analizamos ${section.toLowerCase()} relacionado con ${topicPrompt.toLowerCase()}.\n\n`;
      content += `Es importante destacar que ${template.keywords[idx % template.keywords.length]} juega un papel fundamental en este contexto.\n\n`;
      content += `### Puntos Clave:\n`;
      content += `- Aspecto legal relevante sobre ${topicPrompt}\n`;
      content += `- Consideraciones prácticas para ${categoryPrompt}\n`;
      content += `- Recomendaciones de expertos en la materia\n\n`;
    });

    content += `## Conclusión\n\n`;
    content += `En resumen, ${topicPrompt} en el ámbito del ${categoryPrompt} requiere atención especializada. `;
    content += `Consulta con un profesional para casos específicos.\n\n`;
    content += `**¿Necesitas asesoría? Contacta con nuestros expertos.**`;

    return {
      title,
      content,
      excerpt,
      category: categoryPrompt,
      tags: [topicPrompt, categoryPrompt, ...template.keywords.slice(0, 3)],
      author_name: 'Dr. Wilson Ipiales',
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800`,
      status: 'draft'
    };
  };

  const handleSingleGeneration = async () => {
    if (!topic.trim()) {
      toast.error('Por favor ingresa un tema');
      return;
    }

    setGenerating(true);
    try {
      const content = await generateContentWithAI(topic, category);
      setGeneratedContent(content);
      toast.success('Contenido generado exitosamente');
    } catch (error) {
      toast.error('Error al generar contenido');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGeneration = async () => {
    if (!topic.trim()) {
      toast.error('Por favor ingresa temas separados por comas');
      return;
    }

    const topics = topic.split(',').map(t => t.trim()).filter(t => t);
    const count = Math.min(topics.length > 0 ? topics.length : bulkCount, 10);
    
    setGenerating(true);
    setBulkResults([]);
    
    try {
      const generatedTopics = topics.length > 0 
        ? topics 
        : Array.from({ length: count }, (_, i) => `Tema Legal ${i + 1} sobre ${category}`);

      for (const topicItem of generatedTopics) {
        const content = await generateContentWithAI(topicItem, category);
        
        // Guardar automáticamente
        const result = await adminService.blog.create(content);
        
        setBulkResults(prev => [...prev, {
          topic: topicItem,
          success: result.success,
          id: result.data?.id
        }]);
      }

      toast.success(`${generatedTopics.length} entradas generadas y guardadas`);
    } catch (error) {
      toast.error('Error en generación masiva');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedContent) return;

    const result = await adminService.blog.create(generatedContent);
    if (result.success) {
      toast.success('Entrada guardada en el blog');
      setGeneratedContent(null);
      setTopic('');
    } else {
      toast.error('Error al guardar entrada');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Generador de Contenido con IA</h2>
        <div className="flex items-center gap-2 text-purple-600">
          <FaRobot className="text-2xl" />
          <span className="font-semibold">Powered by AI</span>
        </div>
      </div>

      {/* Selector de modo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Modo de Generación
        </label>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-3 px-4 rounded-lg transition ${
              mode === 'single'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaMagic className="inline mr-2" />
            Generación Individual
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`flex-1 py-3 px-4 rounded-lg transition ${
              mode === 'bulk'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaPlus className="inline mr-2" />
            Generación Masiva (10 máximo)
          </button>
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="Derecho Penal">Derecho Penal</option>
            <option value="Derecho Civil">Derecho Civil</option>
            <option value="Derecho Comercial">Derecho Comercial</option>
            <option value="Derecho Laboral">Derecho Laboral</option>
            <option value="Derecho de Familia">Derecho de Familia</option>
            <option value="Noticias">Noticias</option>
            <option value="Consejos">Consejos Legales</option>
          </select>
        </div>

        {/* Input de tema */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'single' ? 'Tema del Artículo' : 'Temas (separados por comas)'}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              mode === 'single'
                ? 'Ej: Derecho a la defensa en procesos penales'
                : 'Ej: Divorcios en Ecuador, Pensiones alimenticias, Custodia de menores'
            }
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Contador para modo masivo */}
        {mode === 'bulk' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad de Artículos (si no ingresas temas específicos)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={bulkCount}
              onChange={(e) => setBulkCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Botón generar */}
        <button
          onClick={mode === 'single' ? handleSingleGeneration : handleBulkGeneration}
          disabled={generating || !topic.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {generating ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Generando con IA...
            </>
          ) : (
            <>
              <FaMagic className="mr-2" />
              Generar Contenido
            </>
          )}
        </button>
      </div>

      {/* Contenido generado (modo individual) */}
      {mode === 'single' && generatedContent && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Contenido Generado</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={generatedContent.title}
                onChange={(e) => setGeneratedContent({...generatedContent, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extracto</label>
              <textarea
                value={generatedContent.excerpt}
                onChange={(e) => setGeneratedContent({...generatedContent, excerpt: e.target.value})}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                value={generatedContent.content}
                onChange={(e) => setGeneratedContent({...generatedContent, content: e.target.value})}
                rows="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {generatedContent.tags.map((tag, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveGenerated}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Guardar en Blog
            </button>
            <button
              onClick={() => setGeneratedContent(null)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Resultados masivos */}
      {mode === 'bulk' && bulkResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Resultados de Generación Masiva</h3>
          <div className="space-y-2">
            {bulkResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.topic}
                </span>
                <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✓ Guardado' : '✗ Error'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info sobre IA */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
          <FaRobot className="mr-2" />
          Acerca de la Generación con IA
        </h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Los artículos se generan automáticamente basados en el tema proporcionado</li>
          <li>• El contenido incluye estructura profesional y SEO optimizado</li>
          <li>• Puedes editar el contenido antes de guardarlo</li>
          <li>• El modo masivo permite generar hasta 10 artículos de una vez</li>
          <li>• Todos los artículos se guardan como borrador para revisión</li>
        </ul>
      </div>
    </div>
  );
};

export default AIContentGenerator;
