import React, { useState } from 'react';
import { ShoppingCartIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartWidget = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => setIsOpen(!isOpen);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="relative">
      {/* Botón del carrito */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.itemCount}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Carrito de Compras</h3>
              <button
                onClick={toggleCart}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ShoppingCartIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">${state.total}</span>
              </div>
              <Link
                to="/checkout"
                onClick={toggleCart}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                Proceder al Pago
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar el carrito */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleCart}
        />
      )}
    </div>
  );
};

export default CartWidget;
