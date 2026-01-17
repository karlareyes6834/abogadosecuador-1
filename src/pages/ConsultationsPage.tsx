import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { CalendarIcon, ChatbotIcon } from '../components/icons/InterfaceIcons';
import { CatalogItem } from '../types';
import { motion } from 'framer-motion';

const CATALOG_KEY = 'nexuspro_catalog';

const MotionDiv = motion.div as any;

const ConsultationCard = ({ service, onNavigate }) => {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full flex flex-col text-center items-center">
                <div className="p-4 bg-[var(--primary)]/10 rounded-full mb-4">
                    <ChatbotIcon className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="text-[var(--muted-foreground)] mt-2 flex-grow">{service.description}</p>
                 <div className="w-full mt-4 text-sm text-[var(--muted-foreground)]">
                    <div className="font-semibold">{service.durationText}</div>
                    <div className="capitalize">{(service.attention?.modalities || []).join(' / ')}</div>
                </div>
                <div className="mt-4 w-full">
                    <p className="text-2xl font-bold font-serif">${service.price.toFixed(2)}</p>
                    <button 
                        onClick={() => onNavigate('checkout', { item: service, itemType: 'consulta' })} 
                        className="mt-4 w-full px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-md hover:opacity-90 flex items-center justify-center"
                    >
                       <CalendarIcon className="h-4 w-4 mr-2"/> Agendar Consulta
                    </button>
                </div>
            </Card>
        </MotionDiv>
    );
};

const ConsultationsPage: React.FC<{onNavigate: (page: string, payload?: any) => void}> = ({onNavigate}) => {
    const [consultationServices, setConsultationServices] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const catalogData = localStorage.getItem(CATALOG_KEY);
        if (catalogData) {
            const allItems: CatalogItem[] = JSON.parse(catalogData);
            setConsultationServices(allItems.filter(item => item.type === 'consulta' && item.status === 'active'));
        }
    }, []);


    return (
        <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
            <header className="text-center">
                <h1 className="text-4xl font-bold font-serif flex items-center justify-center">
                    <CalendarIcon className="h-10 w-10 mr-4 text-[var(--primary)]"/> Consultas Legales
                </h1>
                <p className="mt-2 text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
                    Agende una consulta virtual o presencial con nuestros expertos legales. Seleccione un servicio para ver la disponibilidad en nuestro calendario.
                </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {consultationServices.map(service => (
                    <ConsultationCard key={service.id} service={service} onNavigate={onNavigate} />
                ))}
            </div>
        </div>
    );
};

export default ConsultationsPage;
