import React, { useState, useEffect, useCallback } from 'react';
import { Page, PublicRoute, Course, Module, Lesson } from '../types';
import { BookOpenIcon, SaveIcon, ChevronLeftIcon, PlusIcon, EditIcon, TrashIcon } from '../components/icons/InterfaceIcons';
import Card from '../components/Card';

interface CourseEditorProps {
    courseId: string;
    onNavigate: (page: Page | PublicRoute | string) => void;
}

const CourseEditorPage: React.FC<CourseEditorProps> = ({ courseId, onNavigate }) => {
    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        const allCourses: Course[] = JSON.parse(localStorage.getItem('nexuspro_courses') || '[]');
        const currentCourse = allCourses.find(c => c.id === courseId);
        if (currentCourse) {
            setCourse(currentCourse);
        }
    }, [courseId]);

    const handleSaveCourse = () => {
        if (!course) return;
        const allCourses: Course[] = JSON.parse(localStorage.getItem('nexuspro_courses') || '[]');
        const newCourses = allCourses.map(c => c.id === courseId ? course : c);
        localStorage.setItem('nexuspro_courses', JSON.stringify(newCourses));
        alert('Curso guardado!');
    };

    const handleUpdateField = (field: keyof Course, value: any) => {
        if (course) {
            setCourse({ ...course, [field]: value });
        }
    };
    
    const handleAddModule = () => {
        if (!course) return;
        const newModule: Module = {
            id: `mod_${Date.now()}`,
            title: 'Nuevo Módulo',
            lessons: []
        };
        setCourse({ ...course, modules: [...course.modules, newModule] });
    };

    const handleUpdateModuleTitle = (moduleId: string, newTitle: string) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m)
        });
    }

    const handleAddLesson = (moduleId: string) => {
        if (!course) return;
        const newLesson: Lesson = {
            id: `les_${Date.now()}`,
            title: 'Nueva Lección',
            type: 'text',
            content: ''
        };
        setCourse({
            ...course,
            modules: course.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
        });
    };

    if (!course) return <div>Cargando curso...</div>;

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                 <button onClick={() => onNavigate('courses')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Cursos
                 </button>
                <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5" />
                    <h1 className="text-lg font-bold">{course.title}</h1>
                </div>
                <button onClick={handleSaveCourse} className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                    <SaveIcon className="h-5 w-5 mr-2"/> Guardar Curso
                </button>
            </header>
            <div className="flex-grow flex overflow-hidden">
                <aside className="w-1/3 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Estructura del Curso</h2>
                    <div className="space-y-4">
                        {course.modules.map(module => (
                            <div key={module.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <input 
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                                    className="font-semibold w-full bg-transparent focus:outline-none focus:bg-white dark:focus:bg-gray-700 rounded p-1"
                                />
                                <ul className="mt-2 space-y-1 pl-4">
                                    {module.lessons.map(lesson => (
                                        <li key={lesson.id} className="text-sm text-gray-600 dark:text-gray-400">{lesson.title}</li>
                                    ))}
                                </ul>
                                <button onClick={() => handleAddLesson(module.id)} className="text-xs text-purple-500 mt-2">+ Añadir lección</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddModule} className="w-full mt-4 text-sm py-2 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        + Añadir Módulo
                    </button>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Detalles del Curso</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Título del Curso</label>
                                <input type="text" value={course.title} onChange={e => handleUpdateField('title', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <textarea value={course.description} onChange={e => handleUpdateField('description', e.target.value)} rows={3} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium">URL de la Imagen</label>
                                <input type="text" value={course.imageUrl} onChange={e => handleUpdateField('imageUrl', e.target.value)} className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                                {course.imageUrl && <img src={course.imageUrl} className="mt-2 w-48 h-auto rounded-md" />}
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default CourseEditorPage;