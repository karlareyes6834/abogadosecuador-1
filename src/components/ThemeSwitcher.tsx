import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center rounded-lg p-2.5 transition-all duration-300"
      style={{
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'dark' ? 'cambiar a tema claro' : 'cambiar a tema oscuro'}
      title={theme === 'dark' ? 'cambiar a tema claro' : 'cambiar a tema oscuro'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 1 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher;