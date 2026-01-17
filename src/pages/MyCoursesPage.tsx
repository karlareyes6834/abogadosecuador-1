import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute, CatalogItem } from '../types';
import { BookOpenIcon } from '../components/icons/InterfaceIcons';

const CATALOG_KEY = 'nexuspro_catalog';
const USER_PURCHASES_KEY = 'user_purchases';
const USER_PROGRESS_KEY = 'nexuspro_user_progress';

// Helper to calculate progress
const calculateProgress = (course, userProgress) => {
    if (!course.modules || course.modules.length === 0) return 0;
    const totalLessons = course.modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;

    const progressRecord = userProgress.find(p => p.courseId === course.id);
    const completedLessons = progressRecord ? progressRecord.completedLessons.length : 0;

    return Math.round((completedLessons / totalLessons) * 100);
};


const CourseProgressCard = ({ course, progress, onNavigate }) => (
    <Card className="flex flex-col group cursor-pointer" onClick={() => onNavigate(`course-detail/${course.id}`)}>
        <img src={course.imageUrl} alt={course.name} className="w-full h-40 object-cover rounded-t-xl" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold group-hover:text-[var(--accent-color)] transition-colors">{course.name}</h3>
            <div className="mt-4 flex-grow">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold text-[var(--muted-foreground)]">Progreso</span>
                    <span className="font-bold text-[var(--accent-color)]">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[var(--accent-color)] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90">
                Continuar
            </button>
        </div>
    </Card>
);

const MyCoursesPage: React.FC<{onNavigate: (page: Page | PublicRoute | string) => void}> = ({ onNavigate }) => {
    const [myCourses, setMyCourses] = useState<CatalogItem[]>([]);
    const [userProgress, setUserProgress] = useState([]);

    useEffect(() => {
        const catalogString = localStorage.getItem(CATALOG_KEY);
        const purchasesString = localStorage.getItem(USER_PURCHASES_KEY);
        const progressString = localStorage.getItem(USER_PROGRESS_KEY);

        if (catalogString && purchasesString) {
            const allItems: CatalogItem[] = JSON.parse(catalogString);
            const allPurchases = JSON.parse(purchasesString);
            const allProgress = progressString ? JSON.parse(progressString) : [];

            const purchasedCourseIds = new Set(
                allPurchases
                    .filter(p => p.itemType === 'course')
                    .map(p => p.itemId)
            );

            const userCourses = allItems.filter(item => (item.type === 'course' || item.type === 'masterclass') && purchasedCourseIds.has(item.id));
            
            setMyCourses(userCourses);
            setUserProgress(allProgress);
        }
    }, []);

    return (
        <div className="space-y-8">
            <header>
                 <h1 className="text-3xl font-bold flex items-center">
                    <BookOpenIcon className="h-8 w-8 mr-3 text-[var(--accent-color)]"/> Mis Cursos
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Continúa tu aprendizaje y sigue tu progreso.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map(course => (
                    <CourseProgressCard 
                        key={course.id} 
                        course={course}
                        progress={calculateProgress(course, userProgress)}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
             {myCourses.length === 0 && (
                <Card className="text-center py-12">
                    <p className="text-[var(--muted-foreground)]">No te has inscrito a ningún curso todavía.</p>
                    <button onClick={() => onNavigate('courses')} className="mt-4 px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90">
                        Explorar Cursos
                    </button>
                </Card>
            )}
        </div>
    );
};

export default MyCoursesPage;