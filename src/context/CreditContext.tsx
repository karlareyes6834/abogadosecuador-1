import React, { createContext, useContext, useState, useEffect } from 'react';

interface CreditContextType {
  credits: number;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
  loading: boolean;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load credits from localStorage
    const savedCredits = localStorage.getItem('userCredits');
    if (savedCredits) {
      setCredits(parseInt(savedCredits, 10));
    } else {
      // Default credits for new users
      setCredits(1000);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save credits to localStorage whenever they change
    localStorage.setItem('userCredits', credits.toString());
  }, [credits]);

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  const deductCredits = (amount: number) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  return (
    <CreditContext.Provider value={{ credits, addCredits, deductCredits, loading }}>
      {children}
    </CreditContext.Provider>
  );
};
