import React, { useState, useEffect, useMemo } from 'react';
import { CatalogItem } from '../types';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import { SearchIcon } from '../components/icons/InterfaceIcons';
import { Page, PublicRoute } from '../types';

const CATALOG_KEY = 'nexuspro_catalog';

interface CatalogPageProps {
  onNavigate: (page: Page | PublicRoute | string) => void;
  navigationPayload?: any;
  clearNavigationPayload?: () => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate, navigationPayload, clearNavigationPayload }) => {
    const [allItems, setAllItems] = useState<CatalogItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const catalogString = localStorage.getItem(CATALOG_KEY);
        if (catalogString) {
            setAllItems(JSON.parse(catalogString));
        }

        if (navigationPayload?.searchTerm) {
            setSearchTerm(navigationPayload.searchTerm);
            clearNavigationPayload?.();
        }
    }, [navigationPayload, clearNavigationPayload]);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(allItems.map(item => item.category));
        return ['all', ...Array.from(uniqueCategories)];
    }, [allItems]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch && item.status === 'active';
        });
    }, [allItems, activeCategory, searchTerm]);

    return (
        <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif tracking-tight sm:text-5xl">Catálogo Universal</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    Explora todos nuestros productos, servicios y cursos en un solo lugar.
                </p>
            </header>

            <div className="flex">
                <FilterBar
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
                <main className="flex-grow pl-6">
                    <div className="mb-6">
                         <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar productos, servicios o cursos..."
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <ProductCard
                                    key={`${item.type}-${item.id}`}
                                    item={item}
                                    type={item.type}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
                            <p className="text-gray-500 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CatalogPage;