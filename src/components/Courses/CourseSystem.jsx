import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCheck, FaLock, FaClock, FaUser, FaStar, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseService';

const CourseSystem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, items } = useCart();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({});
  const [userProgress, setUserProgress] = useState({});
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cursos desde Supabase
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          modules:course_modules(
            *,
            lessons:course_lessons(*)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar datos de Supabase al formato esperado
      const transformedCourses = data.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor_name || 'Dr. Wilson Ipiales',
        description: course.description || course.short_description,
        duration: `${Math.ceil(course.duration / 60)} semanas`,
        totalLessons: course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0,
        price: course.price,
        rating: course.rating || 4.5,
        students: course.enrollment_count || 0,
        image: course.thumbnail || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        category: course.category,
        level: course.level || 'Intermedio',
        lessons: course.modules?.flatMap(mod => 
          mod.lessons?.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: `${lesson.duration || 15}:00`,
            videoUrl: lesson.video_url || 'https://example.com/video.mp4',
            description: lesson.description,
            completed: false
          })) || []
        ) || []
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      toast.error('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares
  const VideoPlayer = ({ lesson }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleTimeUpdate = (e) => {
      setCurrentTime(e.target.currentTime);
      // Actualizar progreso
      const progressPercent = (e.target.currentTime / e.target.duration) * 100;
      updateLessonProgress(lesson.id, progressPercent);
    };

    const handleLoadedMetadata = (e) => {
      setDuration(e.target.duration);
    };

    const togglePlay = () => {
      const video = document.getElementById('course-video');
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
      const video = document.getElementById('course-video');
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
      const newVolume = e.target.value;
      setVolume(newVolume);
      const video = document.getElementById('course-video');
      video.volume = newVolume;
    };

    const handleSeek = (e) => {
      const video = document.getElementById('course-video');
      const seekTime = (e.target.value / 100) * duration;
      video.currentTime = seekTime;
      setCurrentTime(seekTime);
    };

    const toggleFullscreen = () => {
      const video = document.getElementById('course-video');
      if (!isFullscreen) {
        video.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    };

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative">
          <video
            id="course-video"
            className="w-full h-64 md:h-96"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              markLessonAsCompleted(lesson.id);
            }}
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            Su navegador no soporta el elemento de video.
          </video>

          {/* Controles de video */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300"
              >
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const updateLessonProgress = (lessonId, progress) => {
    setUserProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }));
  };

  const markLessonAsCompleted = async (lessonId) => {
    try {
      setUserProgress(prev => ({
        ...prev,
        [lessonId]: 100
      }));
      
      // In a real application, we would save the progress to the backend
      // await dataService.update('user_progress', { lesson_id: lessonId, completed: true });
      
      toast.success('¡Lección completada!');
    } catch (error) {
      console.error('Error al marcar la lección como completada:', error);
      toast.error('Error al guardar el progreso');
    }
  };

  const getCourseProgress = (course) => {
    if (!course.lessons) return 0;
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(lesson => 
      userProgress[lesson.id] === 100
    ).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const handleAddToCart = (course) => {
    const cartItem = {
      id: course.id,
      name: course.title,
      price: course.price,
      category: 'Curso',
      imageUrl: course.image,
      quantity: 1,
      type: 'course',
      instructor: course.instructor,
      duration: course.duration
    };
    
    addToCart(cartItem);
    toast.success(`${course.title} agregado al carrito`);
  };

  const isCourseInCart = (courseId) => {
    return items.some(item => item.id === courseId && item.type === 'course');
  };

  const isCourseOwned = (courseId) => {
    return purchasedCourses.includes(courseId);
  };

  const CourseCard = ({ course }) => {
    const progress = getCourseProgress(course);
    const isOwned = isCourseOwned(course.id);
    const inCart = isCourseInCart(course.id);
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/images/courses/default.jpg';
            }}
          />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            ${course.price}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">{course.category}</span>
            <span className="text-sm text-gray-500">{course.level}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FaClock className="mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <FaUser className="mr-1" />
              {course.totalLessons} lecciones
            </div>
            <div className="flex items-center">
              <FaStar className="mr-1 text-yellow-400" />
              {course.rating}
            </div>
          </div>

          {progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {isOwned ? (
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaPlay className="text-sm" />
                {progress > 0 ? 'Continuar' : 'Empezar Curso'}
              </button>
            ) : inCart ? (
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-sm" />
                Ir al Carrito
              </button>
            ) : (
              <button
                onClick={() => handleAddToCart(course)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-sm" />
                Comprar ${course.price}
              </button>
            )}
            <button 
              onClick={() => setSelectedCourse(course)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CoursePlayer = ({ course }) => {
    const [activeTab, setActiveTab] = useState('video');
    
    // Validar que el curso y sus lecciones existan
    if (!course || !course.lessons || course.lessons.length === 0) {
      return (
        <div className="max-w-6xl mx-auto p-8 text-center">
          <p className="text-gray-600 mb-4">Este curso aún no tiene contenido disponible.</p>
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver a los cursos
          </button>
        </div>
      );
    }
    
    const currentLessonData = course.lessons[currentLesson] || course.lessons[0];

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Volver a los cursos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reproductor de video */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{currentLessonData.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Lección {currentLesson + 1} de {course.lessons.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentLessonData.duration}
                  </span>
                </div>
              </div>

              <VideoPlayer lesson={currentLessonData} />

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-2">Descripción</h3>
                <p className="text-gray-600">{currentLessonData.description}</p>
              </div>
            </div>
          </div>

          {/* Lista de lecciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Lecciones del Curso</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLesson
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {userProgress[lesson.id] === 100 ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaPlay className="text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      {userProgress[lesson.id] === 100 && (
                        <span className="text-green-500 text-sm">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedCourse) {
    return <CoursePlayer course={selectedCourse} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cursos de Derecho</h1>
        <p className="text-xl text-gray-600">
          Aprenda derecho de la mano de expertos profesionales
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSystem;
