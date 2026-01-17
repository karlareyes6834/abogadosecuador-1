import React from 'react';
import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

const HelmetProvider = ({ children }) => {
  return (
    <ReactHelmetProvider>
      {children}
    </ReactHelmetProvider>
  );
};

export default HelmetProvider;
