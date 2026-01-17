import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { Page, PublicRoute, Appointment, Activity, Purchase, CatalogItem } from '../types';
import { FileTextIcon, CalendarIcon, BookOpenIcon, KanbanIcon, CreditsIcon, CheckCircleIcon, ShoppingCartIcon, DownloadIcon, PuzzleIcon } from '../components/icons/InterfaceIcons';
import { useCredits } from '../context/CreditContext';
import { format, isFuture } from 'date-fns';
import { es } from 'date-fns/locale/es';

const APPOINTMENTS_KEY = 'nexuspro_appointments';
const USER_PURCHASES_KEY = 'user_purchases';
const CATALOG_KEY = 'nexuspro_catalog';
const USER_PROGRESS_KEY = 'nexuspro_user_progress';


const mockActivities: Activity[] = [
    { id: 1, type: 'document', description: 'Análisis de "Contrato de Arrendamiento" completado.', timestamp: new Date().toISOString(), icon: CheckCircleIcon },
    { id: 2, type: 'case_update', description: 'Nuevo documento añadido a "Caso de Divorcio".', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), icon: KanbanIcon },
    { id: 3, type: 'course', description: 'Inscrito en el curso "Introducción al Derecho Penal".', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), icon: BookOpenIcon },
    { id: 4, type: 'appointment', description: 'Cita "Consulta Civil" confirmada.', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), icon: CalendarIcon },
];

// Helper to calculate progress
const calculateProgress = (course, userProgress) => {
    if (!course.modules || course.modules.length === 0) return 0;
    const totalLessons = course.modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;

    const progressRecord = userProgress.find(p => p.courseId === course.id);
    const completedLessons = progressRecord ? progressRecord.completedLessons.length : 0;
    
    return Math.round((completedLessons / totalLessons) * 100);
};


type AppointmentWithDate = Omit<Appointment, 'dateTime'> & { dateTime: Date };

const DashboardPage: React.FC<{ onNavigate: (page: Page | PublicRoute | string) => void }> = ({ onNavigate }) => {
    const { credits } = useCredits();
    const [nextAppointment, setNextAppointment] = useState<AppointmentWithDate | null>(null);
    const [courses, setCourses] = useState<any[]>([]); // Will hold course and progress
    const [digitalProducts, setDigitalProducts] = useState<Purchase[]>([]);


    useEffect(() => {
        // Load Appointments
        const storedAppointments: Appointment[] = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
        const upcoming: AppointmentWithDate[] = storedAppointments
            .map(a => ({ ...a, dateTime: new Date(a.dateTime) }))
            .filter(a => isFuture(a.dateTime))
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
        if (upcoming.length > 0) setNextAppointment(upcoming[0]);

        // Load Purchases
        const storedPurchases: Purchase[] = JSON.parse(localStorage.getItem(USER_PURCHASES_KEY) || '[]');
        
        // Load Digital Products for download section
        setDigitalProducts(storedPurchases.filter(p => p.itemType === 'ebook' || p.itemType === 'masterclass'));


        // Load all available courses from catalog
        const allItems: CatalogItem[] = JSON.parse(localStorage.getItem(CATALOG_KEY) || '[]');
        
        // Load user progress
        const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]');
        
        // Filter purchased courses and calculate progress
        const purchasedCourseIds = new Set(storedPurchases.filter(p => p.itemType === 'course').map(p => p.itemId));
        const userCoursesWithProgress = allItems
            .filter(c => c.type === 'course' && purchasedCourseIds.has(c.id))
            .map(course => ({
                ...course,
                progress: calculateProgress(course, allProgress)
            }));
        setCourses(userCoursesWithProgress);

    }, []);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold font-serif">Bienvenido a su Portal Legal 👋</h2>
                    <p className="text-[var(--muted-foreground)] mt-1">Aquí tiene un resumen de su actividad y accesos directos.</p>
                </div>
                <button onClick={() => onNavigate('services')} className="px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-sm transition-transform hover:scale-105">
                    Agendar Nueva Consulta
                </button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            icon={<CreditsIcon />}
                            title="Saldo de Créditos"
                            value={credits.toLocaleString()}
                            actionText="Gestionar Créditos"
                            onActionClick={() => onNavigate('credits')}
                            colorClass="text-[var(--accent-color)]"
                        />
                        <StatCard
                            icon={<CalendarIcon />}
                            title="Próxima Cita"
                            value={nextAppointment ? format(new Date(nextAppointment.dateTime), "HH:mm") : "Ninguna"}
                            details={
                                nextAppointment ? (
                                    <div className="text-[var(--muted-foreground)]">
                                        <p>{nextAppointment.contactName}</p>
                                        <p>{format(new Date(nextAppointment.dateTime), "eeee, d 'de' LLLL", { locale: es })}</p>
                                    </div>
                                ) : null
                            }
                            actionText={nextAppointment ? "Ver Calendario" : "Agendar una"}
                            onActionClick={() => onNavigate('calendar')}
                            colorClass="text-blue-400"
                        />
                    </div>
                     <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center"><BookOpenIcon className="h-5 w-5 mr-2 text-[var(--accent-color)]"/> Mis Cursos</h3>
                        <div className="space-y-3">
                            {courses.length > 0 ? courses.map(course => (
                                <div key={course.id} className="p-3 bg-[var(--background)] rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <img src={course.imageUrl} alt={course.name} className="h-12 w-20 object-cover rounded"/>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{course.name}</p>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                                <div className="bg-[var(--accent-color)] h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => onNavigate(`course-detail/${course.id}`)} className="text-sm font-semibold text-[var(--accent-color)] hover:underline ml-4 flex-shrink-0">Continuar &rarr;</button>
                                </div>
                            )) : <p className="text-[var(--muted-foreground)]">Aún no has comprado ningún curso.</p>}
                        </div>
                    </Card>
                     <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center"><DownloadIcon className="h-5 w-5 mr-2 text-green-400"/> Mis Descargas</h3>
                        <div className="space-y-2">
                            {digitalProducts.length > 0 ? digitalProducts.map(p => (
                                <div key={p.id} className="text-sm flex justify-between items-center p-2 bg-[var(--background)] rounded-md">
                                    <span className="truncate pr-2">{p.itemName}</span>
                                    <button onClick={() => alert(`Simulando descarga de ${p.itemName}...`)} className="font-semibold text-[var(--accent-color)] text-xs hover:underline">Descargar</button>
                                </div>
                            )) : <p className="text-sm text-[var(--muted-foreground)]">No tienes productos digitales comprados.</p>}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <Card className="flex flex-col h-full">
                        <h3 className="font-bold text-lg mb-4">Actividad Reciente</h3>
                        <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                            {mockActivities.map(activity => (
                                <div key={activity.id} className="flex items-start">
                                    <div className="mr-3 mt-1 flex-shrink-0"><activity.icon className="h-5 w-5 text-gray-400"/></div>
                                    <div>
                                        <p className="text-sm">{activity.description}</p>
                                        <p className="text-xs text-[var(--muted-foreground)]">{format(new Date(activity.timestamp), "h:mm a", { locale: es })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
