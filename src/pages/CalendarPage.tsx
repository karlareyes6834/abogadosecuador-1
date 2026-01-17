import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { CalendarIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, XIcon, CreditCardIcon, PayPalIcon, CheckCircleIcon } from '../components/icons/InterfaceIcons';
import { Service, Appointment, AppointmentStatus, UserRole, Page, PublicRoute, CatalogItem } from '../types';
import { format, endOfMonth, endOfWeek, eachDayOfInterval, isSameMonth, add } from 'date-fns';
import { es } from 'date-fns/locale/es';

const CATALOG_KEY = 'nexuspro_catalog';
const APPOINTMENTS_KEY = 'nexuspro_appointments';


const NewAppointmentModal = ({ day, services, onClose, onSave, navigationPayload, onLoginRedirect }) => {
    const isPrepaid = navigationPayload?.fromCheckout || false;
    const [step, setStep] = useState(1);
    const [contactName, setContactName] = useState('Cliente de Ejemplo');
    const [serviceId, setServiceId] = useState(navigationPayload?.preselectedService || services[0]?.id || '');
    const [time, setTime] = useState('10:00');
    const [modality, setModality] = useState<'presencial' | 'virtual'>('virtual');
    
    const selectedService = services.find(s => s.id === serviceId);

    const handleNext = (e) => {
        e.preventDefault();
        if (!contactName.trim() || !serviceId) return;

        if (isPrepaid) {
            handleConfirm();
        } else {
            setStep(2);
        }
    };

    const handleConfirm = () => {
        const [hours, minutes] = time.split(':').map(Number);
        const dateWithTime = new Date(day);
        dateWithTime.setHours(hours, minutes, 0, 0);
        const dateTime = dateWithTime.toISOString();
        
        onSave({
            contactName,
            serviceId,
            dateTime,
            modality,
        });

        setStep(3);
    };
    
    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <form onSubmit={handleNext} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Nombre del Contacto</label>
                            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Servicio</label>
                            <select value={serviceId} onChange={e => setServiceId(e.target.value)} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]">
                                {services.map(s => <option key={s.id} value={s.id}>{s.name} (${s.price})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Modalidad</label>
                            <div className="mt-1 flex gap-2">
                                <button type="button" onClick={() => setModality('virtual')} className={`px-4 py-2 text-sm rounded-md flex-1 ${modality === 'virtual' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--background)]'}`}>Virtual</button>
                                <button type="button" onClick={() => setModality('presencial')} className={`px-4 py-2 text-sm rounded-md flex-1 ${modality === 'presencial' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--background)]'}`}>Presencial</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Hora</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--background)] hover:opacity-80">Cancelar</button>
                            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                                {isPrepaid ? 'Confirmar Cita' : 'Continuar al Pago'}
                            </button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Resumen de la Cita</h3>
                        <div className="p-4 bg-[var(--background)] rounded-lg space-y-2 text-sm">
                            <p><strong>Servicio:</strong> {selectedService?.name}</p>
                            <p><strong>Fecha:</strong> {format(day, 'PPPP', { locale: es })} a las {time}</p>
                            <p><strong>Modalidad:</strong> <span className="capitalize">{modality}</span></p>
                            <p className="text-lg font-bold mt-2 pt-2 border-t border-[var(--border)]">Total: ${selectedService?.price.toFixed(2)}</p>
                        </div>
                        <h3 className="font-semibold">Simulación de Pago</h3>
                        <div className="flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 text-white"><CreditCardIcon className="h-5 w-5"/> Pagar con Tarjeta</button>
                            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-yellow-400 text-black"><PayPalIcon className="h-5 w-5"/> Pagar con PayPal</button>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--background)] hover:opacity-80">Atrás</button>
                            <button type="button" onClick={handleConfirm} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Confirmar Cita</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div className="text-center p-8">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold">¡Cita Agendada!</h2>
                        <p className="text-[var(--muted-foreground)] mt-2">Hemos agendado tu cita para <strong>{selectedService?.name}</strong> el <strong>{format(day, 'PPPP', { locale: es })} a las {time}</strong>. Recibirás una confirmación por correo electrónico.</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Finalizar</button>
                    </div>
                );
            default: return null;
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Agendar Cita</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--background)]"><XIcon className="h-5 w-5"/></button>
                </div>
                {renderStep()}
            </Card>
        </div>
    );
};

const AppointmentDetailModal = ({ appointment, service, onClose, onUpdateStatus, onDelete }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">{service?.name || 'Cita'}</h2>
                    <p className="text-[var(--muted-foreground)]">{appointment.contactName}</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">{format(new Date(appointment.dateTime), 'PPPPp', { locale: es })}</p>
                </div>
                <button onClick={onClose} className="p-2 -mt-2 -mr-2"><XIcon className="h-5 w-5"/></button>
            </div>
            <div className="mt-4">
                <label className="text-sm font-medium">Actualizar Estado</label>
                <div className="flex gap-2 mt-1">
                    {(['confirmed', 'completed', 'cancelled'] as AppointmentStatus[]).map(status => (
                        <button key={status} onClick={() => onUpdateStatus(appointment.id, status)} className={`px-3 py-1 text-sm rounded-md capitalize ${appointment.status === status ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--background)]'}`}>{status}</button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-[var(--border)]">
                <button onClick={() => onDelete(appointment.id)} className="px-4 py-2 rounded-md text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/50 dark:hover:bg-red-900 flex items-center">
                    <TrashIcon className="h-4 w-4 inline mr-2"/>Eliminar Cita
                </button>
                <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Cerrar</button>
            </div>
        </Card>
    </div>
);

interface CalendarPageProps {
  onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
  isLoggedIn: boolean;
  userRole: UserRole;
  navigationPayload?: any;
  clearNavigationPayload?: () => void;
}
const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate, isLoggedIn, userRole, navigationPayload, clearNavigationPayload }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [services, setServices] = useState<CatalogItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const loadData = () => {
        const catalogString = localStorage.getItem(CATALOG_KEY);
        if(catalogString) {
            const allItems: CatalogItem[] = JSON.parse(catalogString);
            const schedulableItems = allItems.filter(item => (item.type === 'service' || item.type === 'consulta') && item.status === 'active');
            setServices(schedulableItems);
        }
        
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
        let allAppointments = storedAppointments ? JSON.parse(storedAppointments).map(a => ({...a, dateTime: new Date(a.dateTime)})) : [];
        
        if (userRole === 'client') {
            // In a real app, this would filter by a logged-in user's ID.
            // We simulate this by filtering for a specific name.
            allAppointments = allAppointments.filter(a => a.contactName === 'Cliente de Ejemplo');
        }
        setAppointments(allAppointments);
    };

    useEffect(() => {
        loadData();
    }, [userRole]);
    
    useEffect(() => {
        if (navigationPayload?.fromCheckout) {
            setSelectedDay(new Date()); // Set a default day to open modal
            setIsNewModalOpen(true);
        }
    }, [navigationPayload]);

    const saveAppointments = (newAppointments: Appointment[]) => {
        // In a real app, we'd only save/update the appointments for the current user or all if admin.
        // For this localStorage simulation, we'll read all, modify, and write all back.
        const allStoredAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
        const updatedAppointments = allStoredAppointments.filter(a => !newAppointments.some(na => na.id === a.id));
        const finalAppointments = [...updatedAppointments, ...newAppointments];
        
        setAppointments(userRole === 'client' ? newAppointments : finalAppointments);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(finalAppointments));
        loadData(); // Re-load and re-filter
    };

    const handleOpenNewModal = (day: Date) => {
        if (!isLoggedIn) {
            alert("Por favor, inicie sesión para agendar una cita.");
            onNavigate('login');
            return;
        }
        setSelectedDay(day);
        setIsNewModalOpen(true);
    };

    const handleCloseNewModal = () => {
        setIsNewModalOpen(false);
        clearNavigationPayload?.();
    };

    const handleSaveAppointment = (newAppointmentData) => {
        const newAppointment: Appointment = {
            id: `appt_${Date.now()}`,
            status: 'confirmed',
            ...newAppointmentData
        };
        const allStoredAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
        saveAppointments([...allStoredAppointments, newAppointment]);
    };

    const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
        const allStoredAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
        const updated = allStoredAppointments.map(a => a.id === id ? { ...a, status } : a);
        saveAppointments(updated);
        setSelectedAppointment(null);
    };

    const handleDeleteAppointment = (id: string) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar esta cita permanentemente?')) {
            const allStoredAppointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
            const updated = allStoredAppointments.filter(a => a.id !== id);
            saveAppointments(updated);
            setSelectedAppointment(null);
        }
    };
    
    const startOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const start = add(startOfMonthDate, { days: -((startOfMonthDate.getDay() + 6) % 7) });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const getAppointmentsForDay = (day: Date) => {
        return appointments.filter(a => format(new Date(a.dateTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    };

    return (
        <div className="space-y-6 h-full flex flex-col p-4 sm:p-6 lg:p-8">
             {isNewModalOpen && selectedDay && <NewAppointmentModal day={selectedDay} services={services} onClose={handleCloseNewModal} onSave={handleSaveAppointment} navigationPayload={navigationPayload} onLoginRedirect={() => onNavigate('login')} />}
             {selectedAppointment && userRole === 'admin' && (
                <AppointmentDetailModal 
                    appointment={selectedAppointment}
                    service={services.find(s => s.id === selectedAppointment.serviceId)}
                    onClose={() => setSelectedAppointment(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteAppointment}
                />
             )}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center font-serif">
                        <CalendarIcon className="h-8 w-8 mr-3"/> Calendario y Citas
                    </h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Gestiona tus servicios y citas en un solo lugar.</p>
                </div>
                {isLoggedIn && (
                  <button onClick={() => handleOpenNewModal(new Date())} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90">
                      <PlusIcon className="h-5 w-5 mr-2"/>
                      Agendar Cita
                  </button>
                )}
            </div>

            <div className="flex-grow flex gap-6 overflow-hidden">
                <main className="w-full lg:w-3/4 flex-shrink flex flex-col">
                    <Card className="flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => setCurrentDate(d => add(d, { months: -1 }))} className="p-2 rounded-full hover:bg-[var(--background)]"><ChevronLeftIcon className="h-5 w-5"/></button>
                            <h2 className="text-xl font-bold capitalize font-serif">{format(currentDate, 'LLLL yyyy', { locale: es })}</h2>
                            <button onClick={() => setCurrentDate(d => add(d, { months: 1 }))} className="p-2 rounded-full hover:bg-[var(--background)]"><ChevronRightIcon className="h-5 w-5"/></button>
                        </div>
                        <div className="grid grid-cols-7 flex-grow">
                             {weekdays.map(day => <div key={day} className="text-center py-2 text-sm font-semibold border-b-2 border-[var(--border)]">{day}</div>)}
                             {days.map(day => {
                                const appointmentsForDay = getAppointmentsForDay(day);
                                return (
                                    <div 
                                        key={day.toString()} 
                                        className={`p-1 md:p-2 border-t border-r border-[var(--border)] flex flex-col ${isSameMonth(day, currentDate) ? '' : 'bg-[var(--background)] text-[var(--muted-foreground)]'} relative group hover:bg-[var(--card)] transition-colors`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs md:text-base font-semibold ${isToday(day) ? 'border-2 border-[var(--accent-color)] rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>{format(day, 'd')}</span>
                                            <button onClick={() => handleOpenNewModal(day)} className="p-1 rounded-full text-[var(--muted-foreground)] bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlusIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="flex-grow overflow-y-auto text-xs mt-1 space-y-1 pr-1">
                                            {appointmentsForDay.map(appt => {
                                                const service = services.find(s => s.id === appt.serviceId);
                                                return (
                                                    <div key={appt.id} onClick={() => userRole === 'admin' && setSelectedAppointment(appt)} title={`${format(new Date(appt.dateTime), 'HH:mm')} - ${appt.contactName} (${service?.name})`} className={`p-1 rounded flex items-center text-white ${userRole === 'admin' ? 'cursor-pointer' : ''} bg-[var(--calendar-available)]`}>
                                                        <span className="font-semibold mr-1">{format(new Date(appt.dateTime), 'HH:mm')}</span>
                                                        <span className="truncate">{appt.contactName}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                             })}
                        </div>
                    </Card>
                </main>
                <aside className="w-full lg:w-1/4 flex-shrink-0 hidden lg:block">
                     <Card>
                        <h2 className="text-xl font-bold mb-4 font-serif">Servicios</h2>
                        <div className="space-y-3">
                            {services.filter(s => s.status === 'active').map(service => (
                                <div key={service.id} className="p-3 bg-[var(--background)] rounded-lg border-l-4" style={{ borderColor: service.color || 'var(--accent-color)' }}>
                                    <p className="font-semibold">{service.name}</p>
                                    <p className="text-sm text-[var(--muted-foreground)]">{service.duration ? `${service.duration} min` : (service.durationText || '')} - ${service.price}</p>
                                </div>
                            ))}
                        </div>
                        {isLoggedIn && userRole === 'admin' && (
                          <button onClick={() => onNavigate('products')} className="w-full mt-4 text-sm py-2 bg-[var(--background)] rounded hover:opacity-80">
                              Gestionar Servicios
                          </button>
                        )}
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default CalendarPage;