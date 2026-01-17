import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Page, PublicRoute, CatalogItem } from '../types';
import { CheckIcon, CalendarIcon } from '../components/icons/InterfaceIcons';

const CATALOG_KEY = 'nexuspro_catalog';

interface ServiceDetailPageProps {
    slug: string;
    onNavigate: (page: Page | PublicRoute | string, payload?: any) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
    const [service, setService] = useState<CatalogItem | null>(null);

    useEffect(() => {
        const catalogData = localStorage.getItem(CATALOG_KEY);
        if (catalogData) {
            const allItems: CatalogItem[] = JSON.parse(catalogData);
            const currentService = allItems.find(item => item.slug === slug && item.type === 'service');
            setService(currentService || null);
        }
    }, [slug]);

    if (!service) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Servicio no encontrado</h1>
                <p className="text-[var(--muted-foreground)] mt-2">El servicio que buscas no existe o ha sido movido.</p>
                <button onClick={() => onNavigate('services')} className="mt-6 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">
                    Volver a Servicios
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
             <header className="py-8 border-b-2 border-[var(--border)] mb-8">
                <p className="text-[var(--accent-color)] font-semibold">{service.category}</p>
                <h1 className="text-4xl lg:text-5xl font-bold font-serif mt-2">{service.name}</h1>
                <p className="text-[var(--muted-foreground)] mt-4 text-lg max-w-3xl">{service.shortDescription}</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="lg:col-span-2 prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: service.longDescription || '' }} />
                </main>
                <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Puntos Clave</h3>
                            <ul className="space-y-3">
                                {service.keyPoints && service.keyPoints.map((point, index) => (
                                     <li key={index} className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-3 mt-1" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                 <p className="text-lg font-semibold text-center">{service.priceInfo}</p>
                                 <button 
                                    onClick={() => onNavigate('checkout', { item: service, itemType: 'service' })}
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg shadow-lg transition-transform hover:scale-105"
                                >
                                    <CalendarIcon className="h-5 w-5" />
                                    Contratar / Agendar Consulta
                                </button>
                            </div>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ServiceDetailPage;