import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaVideo, FaBook } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    category: 'derecho',
    level: 'beginner',
    duration: '',
    thumbnail: '',
    preview_video: '',
    instructor_name: '',
    status: 'active',
    featured: false
  });

  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    order_index: 1
  });

  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration: '',
    order_index: 1,
    type: 'video',
    is_preview: false
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const result = await adminService.courses.getAll();
    if (result.success) {
      setCourses(result.data);
    } else {
      toast.error('Error al cargar cursos');
    }
    setLoading(false);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration) || 0
    };

    let result;
    if (editingCourse) {
      result = await adminService.courses.update(editingCourse.id, courseData);
      if (result.success) {
        toast.success('Curso actualizado correctamente');
      }
    } else {
      result = await adminService.courses.create(courseData);
      if (result.success) {
        toast.success('Curso creado correctamente');
      }
    }

    if (result.success) {
      loadCourses();
      resetForm();
    } else {
      toast.error(result.error || 'Error al guardar curso');
    }
  };

  const handleSubmitModule = async (e) => {
    e.preventDefault();
    
    const result = await adminService.courses.addModule(selectedCourse.id, moduleData);
    if (result.success) {
      toast.success('Módulo agregado correctamente');
      loadCourses();
      setShowModuleForm(false);
      setModuleData({ title: '', description: '', order_index: 1 });
    } else {
      toast.error('Error al agregar módulo');
    }
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    
    const result = await adminService.courses.addLesson(
      selectedModule.id,
      selectedCourse.id,
      {
        ...lessonData,
        duration: parseInt(lessonData.duration) || 0
      }
    );
    
    if (result.success) {
      toast.success('Lección agregada correctamente');
      loadCourses();
      setShowLessonForm(false);
      setLessonData({
        title: '',
        description: '',
        content: '',
        video_url: '',
        duration: '',
        order_index: 1,
        type: 'video',
        is_preview: false
      });
    } else {
      toast.error('Error al agregar lección');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      short_description: course.short_description || '',
      price: course.price,
      category: course.category || 'derecho',
      level: course.level || 'beginner',
      duration: course.duration || '',
      thumbnail: course.thumbnail || '',
      preview_video: course.preview_video || '',
      instructor_name: course.instructor_name || '',
      status: course.status || 'active',
      featured: course.featured || false
    });
    setShowForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este curso? Se eliminarán todos sus módulos y lecciones.')) return;
    
    const result = await adminService.courses.delete(id);
    if (result.success) {
      toast.success('Curso eliminado');
      loadCourses();
    } else {
      toast.error('Error al eliminar curso');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      price: '',
      category: 'derecho',
      level: 'beginner',
      duration: '',
      thumbnail: '',
      preview_video: '',
      instructor_name: '',
      status: 'active',
      featured: false
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const viewCourseDetails = (course) => {
    setSelectedCourse(course);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? 'Cancelar' : 'Nuevo Curso'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
          </h3>
          <form onSubmit={handleSubmitCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Completa</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Miniatura</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Video Preview</label>
                <input
                  type="text"
                  value={formData.preview_video}
                  onChange={(e) => setFormData({...formData, preview_video: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  value={formData.instructor_name}
                  onChange={(e) => setFormData({...formData, instructor_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Curso Destacado
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FaSave /> Guardar
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.short_description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-blue-600">${course.price}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <p>Nivel: {course.level}</p>
                <p>Inscritos: {course.enrollment_count || 0}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => viewCourseDetails(course)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  <FaBook className="inline mr-1" /> Ver Contenido
                </button>
                <button
                  onClick={() => handleEditCourse(course)}
                  className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles del curso */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowModuleForm(true);
                    setModuleData({ ...moduleData, order_index: (selectedCourse.modules?.length || 0) + 1 });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <FaPlus className="inline mr-2" /> Agregar Módulo
                </button>
              </div>

              {/* Formulario de módulo */}
              {showModuleForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-3">Nuevo Módulo</h4>
                  <form onSubmit={handleSubmitModule} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Título del módulo"
                      required
                      value={moduleData.title}
                      onChange={(e) => setModuleData({...moduleData, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <textarea
                      placeholder="Descripción"
                      value={moduleData.description}
                      onChange={(e) => setModuleData({...moduleData, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModuleForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de módulos */}
              <div className="space-y-4">
                {selectedCourse.modules?.map((module, idx) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Módulo {idx + 1}: {module.title}</h4>
                      <button
                        onClick={() => {
                          setSelectedModule(module);
                          setShowLessonForm(true);
                          setLessonData({ ...lessonData, order_index: (module.lessons?.length || 0) + 1 });
                        }}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        <FaPlus className="inline mr-1" /> Agregar Lección
                      </button>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    )}

                    {/* Formulario de lección */}
                    {showLessonForm && selectedModule?.id === module.id && (
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <h5 className="font-semibold mb-2 text-sm">Nueva Lección</h5>
                        <form onSubmit={handleSubmitLesson} className="space-y-2">
                          <input
                            type="text"
                            placeholder="Título de la lección"
                            required
                            value={lessonData.title}
                            onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="URL del video"
                            value={lessonData.video_url}
                            onChange={(e) => setLessonData({...lessonData, video_url: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLessonForm(false)}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Lista de lecciones */}
                    {module.lessons && module.lessons.length > 0 && (
                      <ul className="space-y-1 ml-4">
                        {module.lessons.map((lesson, lidx) => (
                          <li key={lesson.id} className="text-sm flex items-center gap-2">
                            <FaVideo className="text-blue-600" />
                            <span>Lección {lidx + 1}: {lesson.title}</span>
                            {lesson.duration && <span className="text-gray-500">({lesson.duration} min)</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
