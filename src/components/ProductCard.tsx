import React from 'react';
import { CatalogItem } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  item: CatalogItem;
  type: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, type }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} agregado al carrito`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-green-100 text-green-800';
      case 'ebook': return 'bg-orange-100 text-orange-800';
      case 'consulta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          {item.category && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.category}
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${item.price.toFixed(2)}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Agregar
          </button>
        </div>
        
        {item.duration && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Duración: {item.duration}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
