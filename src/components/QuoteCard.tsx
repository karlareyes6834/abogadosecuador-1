import React from 'react';
import Card from './Card';
import { QuoteIcon, RefreshIcon } from './icons/InterfaceIcons';

interface QuoteCardProps {
    quote: string;
    isLoading: boolean;
    onRefresh: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading, onRefresh }) => {
    
    const SkeletonLoader = () => (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );

    return (
        <Card className="relative">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <QuoteIcon className="h-8 w-8 text-[var(--accent-color)]" />
                </div>
                <div className="flex-grow pr-10">
                    <blockquote className="text-lg italic text-[var(--foreground)]">
                        {isLoading ? <SkeletonLoader/> : `“${quote}”`}
                    </blockquote>
                    <p className="text-sm text-[var(--muted-foreground)] mt-2 block">Frase del día</p>
                </div>
            </div>
            <button 
                onClick={onRefresh}
                disabled={isLoading}
                className="absolute top-4 right-4 p-2 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Refrescar frase"
            >
                <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </Card>
    );
};

export default QuoteCard;