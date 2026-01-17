import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

// Create a unique context instance to prevent conflicts
const helmetContext = {};

export const HelmetWrapper = ({ children }) => {
  return (
    <HelmetProvider context={helmetContext}>
      {children}
    </HelmetProvider>
  );
};

export default HelmetWrapper;
