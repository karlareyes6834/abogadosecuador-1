import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TokenContextType {
    tokens: number;
    addTokens: (amount: number) => void;
    useToken: (amount: number) => boolean; // Returns true if successful
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default to 5
    const [tokens, setTokens] = useState(() => {
        const savedTokens = localStorage.getItem('game_tokens');
        return savedTokens !== null ? parseInt(savedTokens, 10) : 5;
    });

    const updateTokens = (newTokens: number) => {
        localStorage.setItem('game_tokens', newTokens.toString());
        setTokens(newTokens);
    };

    const addTokens = (amount: number) => {
        updateTokens(tokens + amount);
    };

    const useToken = (amount: number): boolean => {
        if (tokens >= amount) {
            updateTokens(tokens - amount);
            return true;
        }
        return false;
    };

    const value = { tokens, addTokens, useToken };

    return (
        <TokenContext.Provider value={value}>
            {children}
        </TokenContext.Provider>
    );
};

export const useTokens = (): TokenContextType => {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useTokens must be used within a TokenProvider');
    }
    return context;
};