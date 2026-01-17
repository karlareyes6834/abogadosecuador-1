import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="glass-button relative p-2 w-14 h-14 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <FiSun 
          className={`absolute transition-all duration-500 ${
            isDark 
              ? 'opacity-0 rotate-180 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
          size={24}
          style={{ color: 'var(--accent-gold)' }}
        />
        
        {/* Moon Icon */}
        <FiMoon 
          className={`absolute transition-all duration-500 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-0'
          }`}
          size={24}
          style={{ color: 'var(--accent-gold)' }}
        />
      </div>

      {/* Tooltip */}
      <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                     bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none z-50">
        {isDark ? 'Modo Claro' : 'Modo Oscuro'}
      </span>
    </button>
  );
};

export default ThemeToggle;
