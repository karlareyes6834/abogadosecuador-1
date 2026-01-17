import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';

/**
 * Componente de imagen con fallback profesional
 * Si la imagen no carga, muestra un placeholder con icono y color
 */
const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackType = 'course', // 'course', 'ebook', 'product'
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Colores de fondo según tipo
  const fallbackColors = {
    course: 'bg-gradient-to-br from-blue-500 to-blue-700',
    ebook: 'bg-gradient-to-br from-purple-500 to-purple-700',
    product: 'bg-gradient-to-br from-green-500 to-green-700',
    service: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setLoading(false);
  };

  if (imageError || !src) {
    return (
      <div className={`${className} ${fallbackColors[fallbackType]} flex flex-col items-center justify-center text-white`}>
        <FaImage className="text-4xl mb-2 opacity-75" />
        <span className="text-xs opacity-75 text-center px-2">{alt}</span>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`${className} ${fallbackColors[fallbackType]} animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : 'block'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </>
  );
};

export default ImageWithFallback;
