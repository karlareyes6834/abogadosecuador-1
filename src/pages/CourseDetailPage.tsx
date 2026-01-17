import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute, CatalogItem, Resource } from '../types';
import { BookOpenIcon, CheckIcon, DownloadIcon } from '../components/icons/InterfaceIcons';

const CATALOG_KEY = 'nexuspro_catalog';
const USER_PROGRESS_KEY = 'nexuspro_user_progress';
const USER_PURCHASES_KEY = 'user_purchases';

interface CourseDetailPageProps {
    slug: string; // slug is now the item ID
    onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
    isLoggedIn: boolean;
    learningMode?: boolean;
}

const ResourceLink = ({ resource }: { resource: Resource }) => (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:underline">
        <DownloadIcon className="h-3 w-3" />
        {resource.name}
    </a>
);

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ slug, onNavigate, isLoggedIn, learningMode = false }) => {
    const [course, setCourse] = useState<CatalogItem | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    const handleContinueCourse = () => {
        if (!course?.modules) return;

        // Find the first uncompleted lesson
        for (const module of course.modules) {
            if (module.lessons) {
                for (const lesson of module.lessons) {
                    if (!completedLessons.includes(lesson.id)) {
                        const lessonElement = document.getElementById(`lesson-item-${lesson.id}`);
                        if (lessonElement) {
                            lessonElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            return;
                        }
                    }
                }
            }
        }
        
        // If all are complete, scroll to the top of the lesson list as a fallback
        const temarioElement = document.getElementById('temario-curso');
        if (temarioElement) {
            temarioElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const catalog: CatalogItem[] = JSON.parse(localStorage.getItem(CATALOG_KEY) || '[]');
        const currentCourse = catalog.find(c => c.id === slug && (c.type === 'course' || c.type === 'masterclass'));
        setCourse(currentCourse || null);

        if (currentCourse && isLoggedIn) {
            const allPurchases = JSON.parse(localStorage.getItem(USER_PURCHASES_KEY) || '[]');
            const hasPurchased = allPurchases.some(p => p.itemId === currentCourse.id);
            setIsPurchased(hasPurchased);

           if (hasPurchased) {
               const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]');
               const courseProgress = allProgress.find(p => p.courseId === currentCourse.id);
               if (courseProgress) {
                   setCompletedLessons(courseProgress.completedLessons);
               }
           }
        } else {
            setIsPurchased(false);
            setCompletedLessons([]);
        }

    }, [slug, isLoggedIn]);

    useEffect(() => {
        // Only auto-scroll when in learning mode for a purchased course
        if (learningMode && course && isPurchased) {
            // A small delay ensures the DOM is fully rendered before trying to scroll
            const timer = setTimeout(() => {
                handleContinueCourse();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [learningMode, course, isPurchased]); // removed completedLessons from dependency array to prevent re-scrolling on check

    const totalLessons = course?.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    const handleToggleLesson = (lessonId: string) => {
       if (!isPurchased || !learningMode) return;
       const newCompletedLessons = completedLessons.includes(lessonId)
           ? completedLessons.filter(id => id !== lessonId)
           : [...completedLessons, lessonId];

       setCompletedLessons(newCompletedLessons);

       const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]');
       const otherProgress = allProgress.filter(p => p.courseId !== course?.id);
       const updatedProgress = {
           userId: 'client', // Assuming a default client user
           courseId: course?.id,
           completedLessons: newCompletedLessons
       };

       localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify([...otherProgress, updatedProgress]));
   };

    if (isLoggedIn && isPurchased && !learningMode) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 py-20">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <Card>
                        <BookOpenIcon className="h-12 w-12 mx-auto text-[var(--accent-color)]"/>
                        <h1 className="text-2xl font-bold mt-4">Ya tienes acceso a este curso.</h1>
                        <p className="mt-2 text-[var(--muted-foreground)]">Para continuar con tu aprendizaje, por favor dirígete a tu portal de cliente.</p>
                        <button
                            onClick={() => onNavigate('my-courses')}
                            className={`w-full mt-6 px-6 py-3 text-lg font-semibold text-[var(--primary-foreground)] rounded-lg shadow-lg transition-transform hover:scale-105 bg-[var(--primary)] hover:opacity-90`}
                        >
                            Ir a Mis Cursos
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Curso no encontrado</h1>
                <p className="text-gray-500 mt-2">El curso que buscas no existe o ha sido movido.</p>
                <button onClick={() => onNavigate('courses')} className="mt-6 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">
                    Volver a Cursos
                </button>
            </div>
        );
    }
    
    const primaryBgClass = "bg-[var(--primary)]";
    const primaryHoverBgClass = "hover:opacity-90";

    const isComplete = progress >= 100;

    // Determine if the view should be interactive. Only interactive if it's learning mode AND purchased.
    const isInteractiveView = learningMode && isPurchased;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2">
                        <header className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 font-serif">{course.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">{course.description}</p>
                        </header>
                         {isInteractiveView && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold">Tu Progreso</h3>
                                    <span className="font-bold text-[var(--primary)]">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-[var(--primary)] h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                                </div>
                            </div>
                        )}
                        <Card>
                             <h2 id="temario-curso" className="text-2xl font-bold mb-4">Temario del Curso</h2>
                             <div className="space-y-4">
                                {course.modules && course.modules.map(module => (
                                    <div key={module.id}>
                                        <h3 className="font-semibold text-lg">{module.title}</h3>
                                        <ul className="mt-2 space-y-3 pl-4">
                                            {module.lessons.map(lesson => (
                                                <li key={lesson.id} id={`lesson-item-${lesson.id}`} className="flex items-start">
                                                    {isInteractiveView ? (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                id={`lesson-${lesson.id}`}
                                                                checked={completedLessons.includes(lesson.id)}
                                                                onChange={() => handleToggleLesson(lesson.id)}
                                                                className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary mr-3 mt-0.5 flex-shrink-0"
                                                                style={{ accentColor: 'var(--accent-color)' }}
                                                            />
                                                            <label htmlFor={`lesson-${lesson.id}`} className="cursor-pointer">
                                                                <span className={`${completedLessons.includes(lesson.id) ? 'line-through text-[var(--muted-foreground)]' : ''}`}>{lesson.title}</span>
                                                                {(lesson.resources && lesson.resources.length > 0) && (
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                                        {lesson.resources.map((res, i) => <ResourceLink key={i} resource={res} />)}
                                                                    </div>
                                                                )}
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-5 w-5 flex-shrink-0 mr-3 mt-0.5 flex items-center justify-start">
                                                                <BookOpenIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <span>{lesson.title}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {(!course.modules || course.modules.length === 0) && <p className="text-gray-500">El temario de este curso se publicará pronto.</p>}
                             </div>
                        </Card>
                    </main>
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card>
                                <img src={course.imageUrl} alt={course.name} className="w-full h-48 object-cover rounded-xl shadow-lg mb-4" />
                                <div className="text-center">
                                    {!isInteractiveView ? (
                                        <>
                                            <p className="text-4xl font-bold">${course.price.toFixed(2)}</p>
                                            <button 
                                                onClick={() => onNavigate('checkout', { item: course, itemType: 'course' })}
                                                className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-primary-foreground rounded-lg shadow-lg transition-transform hover:scale-105 ${primaryBgClass} ${primaryHoverBgClass}`}
                                            >
                                                <BookOpenIcon className="h-5 w-5" />
                                                Comprar Curso
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {isComplete ? (
                                                <button 
                                                    onClick={() => alert('Simulando descarga de certificado...')}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-primary-foreground rounded-lg shadow-lg transition-transform hover:scale-105 bg-green-600 hover:bg-green-700`}
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                    Descargar Certificado
                                                </button>
                                            ) : (
                                                 <button 
                                                    onClick={handleContinueCourse}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-primary-foreground rounded-lg shadow-lg transition-transform hover:scale-105 ${primaryBgClass} ${primaryHoverBgClass}`}
                                                >
                                                    <BookOpenIcon className="h-5 w-5" />
                                                    Continuar Curso
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;