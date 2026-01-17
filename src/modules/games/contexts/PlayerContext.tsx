import React, { createContext, useContext, useState, useCallback } from 'react';

export interface PlayerProfile {
  tokens: number;
  xp: number;
  level: number;
  geometryBestScore: number;
  justiceBestScore: number;
  spaceBestScore: number;
  puzzleBestScore: number;
  ownedCosmetics: string[];
  activeCosmetic: string;
  completedMissions: string[];
  badges: string[];
  totalGamesPlayed: number;
  totalTokensEarned: number;
}

interface PlayerContextType {
  profile: PlayerProfile;
  addTokens: (amount: number) => void;
  addXP: (amount: number) => void;
  updateGeometryScore: (score: number) => void;
  updateJusticeScore: (score: number) => void;
  updateSpaceScore: (score: number) => void;
  updatePuzzleScore: (score: number) => void;
  purchaseCosmetic: (cosmeticId: string, cost: number) => boolean;
  setActiveCosmetic: (cosmeticId: string) => void;
  completeMission: (missionId: string) => void;
  addBadge: (badgeId: string) => void;
  incrementGamesPlayed: () => void;
  resetProfile: () => void;
}

const defaultProfile: PlayerProfile = {
  tokens: 100,
  xp: 0,
  level: 1,
  geometryBestScore: 0,
  justiceBestScore: 0,
  spaceBestScore: 0,
  puzzleBestScore: 0,
  ownedCosmetics: ['default'],
  activeCosmetic: 'default',
  completedMissions: [],
  badges: [],
  totalGamesPlayed: 0,
  totalTokensEarned: 0,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile);

  const addTokens = useCallback((amount: number) => {
    setProfile((p) => ({ ...p, tokens: Math.max(0, p.tokens + amount) }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setProfile((p) => {
      const newXP = p.xp + amount;
      const xpPerLevel = 500;
      const newLevel = Math.floor(newXP / xpPerLevel) + 1;
      return { ...p, xp: newXP, level: newLevel };
    });
  }, []);

  const updateGeometryScore = useCallback((score: number) => {
    setProfile((p) => ({
      ...p,
      geometryBestScore: Math.max(p.geometryBestScore, score),
    }));
  }, []);

  const updateJusticeScore = useCallback((score: number) => {
    setProfile((p) => ({
      ...p,
      justiceBestScore: Math.max(p.justiceBestScore, score),
    }));
  }, []);

  const updateSpaceScore = useCallback((score: number) => {
    setProfile((p) => ({
      ...p,
      spaceBestScore: Math.max(p.spaceBestScore, score),
    }));
  }, []);

  const updatePuzzleScore = useCallback((score: number) => {
    setProfile((p) => ({
      ...p,
      puzzleBestScore: Math.max(p.puzzleBestScore, score),
    }));
  }, []);

  const purchaseCosmetic = useCallback((cosmeticId: string, cost: number): boolean => {
    setProfile((p) => {
      if (p.tokens >= cost && !p.ownedCosmetics.includes(cosmeticId)) {
        return {
          ...p,
          tokens: p.tokens - cost,
          ownedCosmetics: [...p.ownedCosmetics, cosmeticId],
        };
      }
      return p;
    });
    return profile.tokens >= cost && !profile.ownedCosmetics.includes(cosmeticId);
  }, [profile.tokens, profile.ownedCosmetics]);

  const setActiveCosmetic = useCallback((cosmeticId: string) => {
    setProfile((p) => ({
      ...p,
      activeCosmetic: p.ownedCosmetics.includes(cosmeticId) ? cosmeticId : p.activeCosmetic,
    }));
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setProfile((p) => {
      if (!p.completedMissions.includes(missionId)) {
        return {
          ...p,
          completedMissions: [...p.completedMissions, missionId],
        };
      }
      return p;
    });
  }, []);

  const addBadge = useCallback((badgeId: string) => {
    setProfile((p) => {
      if (!p.badges.includes(badgeId)) {
        return { ...p, badges: [...p.badges, badgeId] };
      }
      return p;
    });
  }, []);

  const incrementGamesPlayed = useCallback(() => {
    setProfile((p) => ({
      ...p,
      totalGamesPlayed: p.totalGamesPlayed + 1,
    }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        profile,
        addTokens,
        addXP,
        updateGeometryScore,
        updateJusticeScore,
        updateSpaceScore,
        updatePuzzleScore,
        purchaseCosmetic,
        setActiveCosmetic,
        completeMission,
        addBadge,
        incrementGamesPlayed,
        resetProfile,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
