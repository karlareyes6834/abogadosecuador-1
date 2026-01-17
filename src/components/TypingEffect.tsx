import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * COMPONENTE DE EFECTO DE ESCRITURA Y BORRADO
 * 
 * Escribe y borra texto de forma animada
 * 
 * Props:
 * - text: Texto a escribir
 * - speed: Velocidad de escritura (ms por carácter)
 * - delay: Retraso antes de empezar (ms)
 * - className: Clases CSS personalizadas
 * - onComplete: Callback cuando termina
 */
const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 100,
  delay = 500,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Esperar el delay inicial
    if (!isTyping && !isDeleting && displayedText === '') {
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timeout);
    }

    // Escribir
    if (isTyping && displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }

    // Cuando termina de escribir
    if (isTyping && displayedText.length === text.length) {
      setIsTyping(false);
      // Esperar 3 segundos antes de borrar
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    // Borrar
    if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, speed / 2);
      return () => clearTimeout(timeout);
    }

    // Cuando termina de borrar
    if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      // Volver a empezar
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, isDeleting, text, speed, delay]);

  return (
    <span className={className}>
      {displayedText}
      {(isTyping || isDeleting) && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default TypingEffect;
