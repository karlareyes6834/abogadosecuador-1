import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { BookOpenIcon } from '../components/icons/InterfaceIcons';
import { CatalogItem } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const CATALOG_KEY = 'nexuspro_catalog';

const EbooksPage: React.FC = () => {
    const [ebooks, setEbooks] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const catalogString = localStorage.getItem(CATALOG_KEY);
        if (catalogString) {
            const allItems: CatalogItem[] = JSON.parse(catalogString);
            setEbooks(allItems.filter(item => item.type === 'ebook' && item.status === 'active'));
        }
    }, []);

    return (
        <div className="space-y-8 p-4 sm:p-8 max-w-5xl mx-auto">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center font-serif">
                    <BookOpenIcon className="h-10 w-10 mr-4 text-[var(--primary)]"/> eBooks y Guías Legales
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Recursos descargables para potenciar tu conocimiento.</p>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {ebooks.map(ebook => (
                     <Card key={ebook.id} className="flex flex-col group">
                        <img src={ebook.imageUrl} alt={ebook.name} className="w-full h-48 object-cover rounded-t-xl" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors">{ebook.name}</h3>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <span className="font-bold text-xl text-blue-600">${ebook.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => handleAddToCart(ebook)}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
             <Card>
                <div className="text-center py-8">
                     <h2 className="text-xl font-semibold">Explora Nuestra Colección Completa</h2>
                    <p className="text-gray-500 mt-2">Visita nuestro catálogo universal para ver todos los ebooks, cursos y servicios disponibles.</p>
                     <Link to="/catalog" className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors inline-block text-center">
                        Ir al Catálogo
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default EbooksPage;