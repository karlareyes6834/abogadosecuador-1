import React from 'react';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="w-64 mr-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categorías</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'Todas las categorías' : category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
