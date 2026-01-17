import React from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ showColorPicker = false }) => {
  const { theme, toggleTheme, changePrimaryColor, isDark, isLight } = useTheme();

  const colors = [
    { name: 'blue', hex: '#2563eb', label: 'Azul' },
    { name: 'green', hex: '#059669', label: 'Verde' },
    { name: 'purple', hex: '#7c3aed', label: 'Púrpura' },
    { name: 'red', hex: '#dc2626', label: 'Rojo' },
    { name: 'orange', hex: '#ea580c', label: 'Naranja' }
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Toggle de tema claro/oscuro */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
      </button>

      {/* Selector de colores */}
      {showColorPicker && (
        <div className="relative group">
          <button
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Cambiar color del tema"
          >
            <FaPalette className="w-4 h-4" />
          </button>
          
          {/* Dropdown de colores */}
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => changePrimaryColor(color.name)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
