import { ReactNode } from 'react';

export interface UserSession {
  name: string;
  email?: string; // Optional as requested
  avatar?: string;
}

export type AppId = 'explorer' | 'browser' | 'legal-web' | 'settings' | 'calendar' | 'calculator' | 'games';

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: ReactNode;
  component: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  glassIntensity: number;
}