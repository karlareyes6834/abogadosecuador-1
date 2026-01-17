import React from 'react';
import Card from './Card';
import { LightbulbIcon, RefreshIcon } from './icons/InterfaceIcons';

interface SalesTipCardProps {
    tip: string;
    isLoading: boolean;
    onRefresh: () => void;
}

const SalesTipCard: React.FC<SalesTipCardProps> = ({ tip, isLoading, onRefresh }) => {
    
    const SkeletonLoader = () => (
      <div className="animate-pulse flex flex-col space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
    
    return (
        <Card>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <LightbulbIcon className="h-6 w-6 text-yellow-300 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tip de Ventas IA</h2>
                </div>
                 <button 
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Refrescar tip"
                >
                    <RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
                {isLoading ? <SkeletonLoader/> : tip}
            </p>
        </Card>
    );
};

export default SalesTipCard;