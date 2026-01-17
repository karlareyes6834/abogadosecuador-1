

import React from 'react';

interface EditorLayoutProps {
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
};

export default EditorLayout;
