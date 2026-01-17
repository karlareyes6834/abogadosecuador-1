import React from 'react';
import { FaTools } from 'react-icons/fa';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-gray-50">
      <FaTools className="text-6xl text-gray-400 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        {title || 'Página en Construcción'}
      </h1>
      <p className="text-lg text-gray-600 max-w-md">
        Estamos trabajando para que esta sección esté disponible lo antes posible. ¡Vuelve pronto!
      </p>
    </div>
  );
};

export default PlaceholderPage;