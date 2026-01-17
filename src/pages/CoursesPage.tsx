import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute, CatalogItem } from '../types';
import { BookOpenIcon } from '../components/icons/InterfaceIcons';

const CATALOG_KEY = 'nexuspro_catalog';

const CourseCard = ({ course, onNavigate }) => (
    <Card className="flex flex-col group cursor-pointer" onClick={() => onNavigate(`course-detail/${course.id}`)}>
        <img src={course.imageUrl} alt={course.name} className="w-full h-40 object-cover rounded-t-xl" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{course.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow line-clamp-3">{course.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="font-bold text-xl">${course.price.toFixed(2)}</span>
                <span className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md">
                    Ver Curso
                </span>
            </div>
        </div>
    </Card>
);

const CoursesPage: React.FC<{onNavigate: (page: Page | PublicRoute | string) => void}> = ({ onNavigate }) => {
    const [courses, setCourses] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const catalogString = localStorage.getItem(CATALOG_KEY);
        if (catalogString) {
            const allItems: CatalogItem[] = JSON.parse(catalogString);
            setCourses(allItems.filter(item => item.type === 'course' && item.status === 'active'));
        }
    }, []);

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <header className="text-center">
                 <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                    <BookOpenIcon className="h-10 w-10 mr-4 text-purple-500"/> Cursos Legales Interactivos
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Capacítate con nuestros cursos diseñados por expertos.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <CourseCard 
                        key={course.id} 
                        course={course}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
             {courses.length === 0 && (
                <Card className="text-center py-12">
                    <p className="text-gray-500">No hay cursos disponibles en este momento.</p>
                </Card>
            )}
        </div>
    );
};

export default CoursesPage;