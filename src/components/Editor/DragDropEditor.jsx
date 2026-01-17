import React, { useState, useRef, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaTrash, FaEdit, FaCopy, FaEye, FaSave, FaUndo, FaRedo,
  FaHeading, FaParagraph, FaImage, FaVideo, FaCode, FaTable,
  FaList, FaQuoteLeft, FaColumns, FaSquare, FaLink, FaFont,
  FaPalette, FaMagic, FaLayerGroup, FaCog, FaDesktop, FaMobileAlt,
  FaTabletAlt, FaGripVertical, FaClone, FaLock, FaUnlock, FaEyeSlash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Componente Sortable para elementos arrastrables
const SortableItem = ({ id, children, onDelete, onEdit, onDuplicate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...attributes} {...listeners} className="cursor-move p-2 bg-gray-100 rounded">
          <FaGripVertical className="text-gray-500" />
        </div>
      </div>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
        <button
          onClick={() => onEdit(id)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => onDuplicate(id)}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaCopy size={14} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTrash size={14} />
        </button>
      </div>
      {children}
    </div>
  );
};

// Componentes de contenido
const ContentComponents = {
  heading: ({ content, style }) => (
    <h2 className={`text-3xl font-bold mb-4 ${style?.className || ''}`} style={style}>
      {content.text || 'Título'}
    </h2>
  ),
  paragraph: ({ content, style }) => (
    <p className={`mb-4 ${style?.className || ''}`} style={style}>
      {content.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
    </p>
  ),
  image: ({ content, style }) => (
    <div className={`mb-4 ${style?.className || ''}`} style={style}>
      <img 
        src={content.src || 'https://via.placeholder.com/600x400'} 
        alt={content.alt || 'Imagen'}
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>
  ),
  video: ({ content, style }) => (
    <div className={`mb-4 aspect-video ${style?.className || ''}`} style={style}>
      <iframe
        src={content.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
        className="w-full h-full rounded-lg shadow-md"
        allowFullScreen
      />
    </div>
  ),
  button: ({ content, style }) => (
    <button 
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4 ${style?.className || ''}`}
      style={style}
    >
      {content.text || 'Botón'}
    </button>
  ),
  columns: ({ content, style }) => (
    <div className={`grid grid-cols-2 gap-4 mb-4 ${style?.className || ''}`} style={style}>
      <div className="p-4 bg-gray-50 rounded">
        {content.col1 || 'Columna 1'}
      </div>
      <div className="p-4 bg-gray-50 rounded">
        {content.col2 || 'Columna 2'}
      </div>
    </div>
  ),
  list: ({ content, style }) => (
    <ul className={`list-disc list-inside mb-4 ${style?.className || ''}`} style={style}>
      {(content.items || ['Item 1', 'Item 2', 'Item 3']).map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  ),
  quote: ({ content, style }) => (
    <blockquote className={`border-l-4 border-blue-500 pl-4 py-2 mb-4 italic ${style?.className || ''}`} style={style}>
      {content.text || 'Cita importante'}
      {content.author && <footer className="text-sm mt-2">— {content.author}</footer>}
    </blockquote>
  ),
  code: ({ content, style }) => (
    <pre className={`bg-gray-900 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto ${style?.className || ''}`} style={style}>
      <code>{content.code || '// Tu código aquí'}</code>
    </pre>
  ),
  divider: ({ style }) => (
    <hr className={`my-6 border-gray-300 ${style?.className || ''}`} style={style} />
  ),
  spacer: ({ content, style }) => (
    <div style={{ height: content.height || '50px', ...style }} />
  ),
  card: ({ content, style }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 mb-4 ${style?.className || ''}`} style={style}>
      <h3 className="text-xl font-bold mb-2">{content.title || 'Título de la tarjeta'}</h3>
      <p>{content.description || 'Descripción de la tarjeta'}</p>
      {content.buttonText && (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {content.buttonText}
        </button>
      )}
    </div>
  ),
  form: ({ content, style }) => (
    <form className={`bg-gray-50 p-6 rounded-lg mb-4 ${style?.className || ''}`} style={style}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nombre</label>
        <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Tu nombre" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="tu@email.com" />
      </div>
      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Enviar
      </button>
    </form>
  ),
};

const DragDropEditor = ({ initialContent = [], onSave }) => {
  const [elements, setElements] = useState(initialContent);
  const [selectedElement, setSelectedElement] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [history, setHistory] = useState([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Plantillas predefinidas
  const templates = [
    {
      id: 'landing',
      name: 'Landing Page',
      elements: [
        { id: '1', type: 'heading', content: { text: 'Bienvenido a Nuestro Sitio' } },
        { id: '2', type: 'paragraph', content: { text: 'Descripción principal del servicio' } },
        { id: '3', type: 'image', content: {} },
        { id: '4', type: 'columns', content: {} },
        { id: '5', type: 'button', content: { text: 'Comenzar Ahora' } }
      ]
    },
    {
      id: 'blog',
      name: 'Artículo de Blog',
      elements: [
        { id: '1', type: 'heading', content: { text: 'Título del Artículo' } },
        { id: '2', type: 'paragraph', content: {} },
        { id: '3', type: 'image', content: {} },
        { id: '4', type: 'quote', content: {} },
        { id: '5', type: 'paragraph', content: {} }
      ]
    },
    {
      id: 'contact',
      name: 'Página de Contacto',
      elements: [
        { id: '1', type: 'heading', content: { text: 'Contáctanos' } },
        { id: '2', type: 'paragraph', content: { text: 'Estamos aquí para ayudarte' } },
        { id: '3', type: 'form', content: {} },
        { id: '4', type: 'card', content: { title: 'Información de Contacto' } }
      ]
    }
  ];

  // Componentes disponibles para agregar
  const availableComponents = [
    { type: 'heading', icon: FaHeading, label: 'Título' },
    { type: 'paragraph', icon: FaParagraph, label: 'Párrafo' },
    { type: 'image', icon: FaImage, label: 'Imagen' },
    { type: 'video', icon: FaVideo, label: 'Video' },
    { type: 'button', icon: FaSquare, label: 'Botón' },
    { type: 'columns', icon: FaColumns, label: 'Columnas' },
    { type: 'list', icon: FaList, label: 'Lista' },
    { type: 'quote', icon: FaQuoteLeft, label: 'Cita' },
    { type: 'code', icon: FaCode, label: 'Código' },
    { type: 'card', icon: FaLayerGroup, label: 'Tarjeta' },
    { type: 'form', icon: FaEdit, label: 'Formulario' },
    { type: 'divider', icon: FaMagic, label: 'Divisor' },
    { type: 'spacer', icon: FaSquare, label: 'Espacio' }
  ];

  // Guardar en historial
  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Deshacer
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  // Rehacer
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  // Manejar drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);
      const newElements = arrayMove(elements, oldIndex, newIndex);
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  // Agregar nuevo elemento
  const addElement = (type) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      content: {},
      style: {}
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    toast.success(`${type} agregado`);
  };

  // Eliminar elemento
  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    saveToHistory(newElements);
    toast.success('Elemento eliminado');
  };

  // Duplicar elemento
  const duplicateElement = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`
      };
      const index = elements.findIndex(el => el.id === id);
      const newElements = [
        ...elements.slice(0, index + 1),
        newElement,
        ...elements.slice(index + 1)
      ];
      setElements(newElements);
      saveToHistory(newElements);
      toast.success('Elemento duplicado');
    }
  };

  // Editar elemento
  const editElement = (id) => {
    const element = elements.find(el => el.id === id);
    setSelectedElement(element);
    setEditModalOpen(true);
  };

  // Guardar cambios de edición
  const saveElementChanges = (updatedElement) => {
    const newElements = elements.map(el =>
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    setEditModalOpen(false);
    setSelectedElement(null);
    toast.success('Cambios guardados');
  };

  // Cargar plantilla
  const loadTemplate = (template) => {
    setElements(template.elements);
    saveToHistory(template.elements);
    setSelectedTemplate(template.id);
    toast.success(`Plantilla "${template.name}" cargada`);
  };

  // Guardar página
  const savePage = () => {
    if (onSave) {
      onSave(elements);
    }
    toast.success('Página guardada exitosamente');
  };

  // Modal de edición
  const EditModal = () => {
    if (!selectedElement) return null;

    const [editedContent, setEditedContent] = useState(selectedElement.content);
    const [editedStyle, setEditedStyle] = useState(selectedElement.style || {});

    return (
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Editar {selectedElement.type}
              </h3>

              {/* Campos de edición según el tipo */}
              {selectedElement.type === 'heading' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Texto</label>
                  <input
                    type="text"
                    value={editedContent.text || ''}
                    onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              {selectedElement.type === 'paragraph' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Texto</label>
                  <textarea
                    value={editedContent.text || ''}
                    onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                  />
                </div>
              )}

              {selectedElement.type === 'image' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">URL de la imagen</label>
                    <input
                      type="text"
                      value={editedContent.src || ''}
                      onChange={(e) => setEditedContent({ ...editedContent, src: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Texto alternativo</label>
                    <input
                      type="text"
                      value={editedContent.alt || ''}
                      onChange={(e) => setEditedContent({ ...editedContent, alt: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {selectedElement.type === 'button' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Texto del botón</label>
                  <input
                    type="text"
                    value={editedContent.text || ''}
                    onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              {/* Estilos */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Clases CSS personalizadas</label>
                <input
                  type="text"
                  value={editedStyle.className || ''}
                  onChange={(e) => setEditedStyle({ ...editedStyle, className: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="text-center text-blue-600"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Margen (px)</label>
                <input
                  type="text"
                  value={editedStyle.margin || ''}
                  onChange={(e) => setEditedStyle({ ...editedStyle, margin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="10px 20px"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Padding (px)</label>
                <input
                  type="text"
                  value={editedStyle.padding || ''}
                  onChange={(e) => setEditedStyle({ ...editedStyle, padding: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="10px 20px"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => saveElementChanges({
                    ...selectedElement,
                    content: editedContent,
                    style: editedStyle
                  })}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Obtener clase de viewport
  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar izquierdo - Componentes */}
      <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Componentes</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableComponents.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => addElement(type)}
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg flex flex-col items-center gap-1 transition-colors"
            >
              <Icon className="text-xl text-gray-600" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        <h3 className="text-lg font-bold mt-6 mb-4">Plantillas</h3>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template)}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                selectedTemplate === template.id
                  ? 'bg-blue-100 border-blue-500 border'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Área principal de edición */}
      <div className="flex-1 flex flex-col">
        {/* Barra de herramientas superior */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <FaUndo />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <FaRedo />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <button
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded ${viewport === 'desktop' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <FaDesktop />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded ${viewport === 'tablet' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <FaTabletAlt />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded ${viewport === 'mobile' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <FaMobileAlt />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded ${showGrid ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <FaMagic />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              {previewMode ? <FaEdit /> : <FaEye />}
              {previewMode ? 'Editar' : 'Vista previa'}
            </button>
            <button
              onClick={savePage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave />
              Guardar
            </button>
          </div>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-auto p-8">
          <div 
            className={`${getViewportClass()} bg-white rounded-lg shadow-lg min-h-full p-8 ${
              showGrid ? 'bg-grid-pattern' : ''
            }`}
          >
            {previewMode ? (
              // Modo vista previa
              <div>
                {elements.map((element) => {
                  const Component = ContentComponents[element.type];
                  return Component ? (
                    <div key={element.id}>
                      <Component content={element.content} style={element.style} />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              // Modo edición
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={elements.map(el => el.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {elements.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <FaLayerGroup className="text-6xl mx-auto mb-4" />
                      <p className="text-xl">Arrastra componentes aquí para comenzar</p>
                    </div>
                  ) : (
                    elements.map((element) => {
                      const Component = ContentComponents[element.type];
                      return (
                        <SortableItem
                          key={element.id}
                          id={element.id}
                          onDelete={deleteElement}
                          onEdit={editElement}
                          onDuplicate={duplicateElement}
                        >
                          <div className="border-2 border-transparent hover:border-blue-300 rounded-lg p-2 transition-colors">
                            {Component ? (
                              <Component content={element.content} style={element.style} />
                            ) : (
                              <div className="p-4 bg-red-50 text-red-600 rounded">
                                Componente desconocido: {element.type}
                              </div>
                            )}
                          </div>
                        </SortableItem>
                      );
                    })
                  )}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditModal />

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default DragDropEditor;
