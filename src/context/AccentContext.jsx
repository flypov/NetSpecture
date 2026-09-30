import React, { createContext, useContext, useState, useEffect } from 'react';

export const ACCENT_THEMES = [
  {
    id: 'cyan',
    name: 'Neon Cyan',
    hex: '#00f0ff',
    rgb: '0, 240, 255',
    glow: 'rgba(0, 240, 255, 0.4)',
    border: 'rgba(0, 240, 255, 0.3)'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    hex: '#10b981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.4)',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'purple',
    name: 'Deep Violet',
    hex: '#a855f7',
    rgb: '168, 85, 247',
    glow: 'rgba(168, 85, 247, 0.4)',
    border: 'rgba(168, 85, 247, 0.3)'
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'rgba(245, 158, 11, 0.3)'
  },
  {
    id: 'white',
    name: 'Pure White',
    hex: '#ffffff',
    rgb: '255, 255, 255',
    glow: 'rgba(255, 255, 255, 0.35)',
    border: 'rgba(255, 255, 255, 0.3)'
  },
  {
    id: 'crimson',
    name: 'Electric Crimson',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.4)',
    border: 'rgba(244, 63, 94, 0.3)'
  }
];

const AccentContext = createContext({
  currentTheme: ACCENT_THEMES[0],
  setAccentTheme: () => {}
});

export const AccentProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    try {
      return localStorage.getItem('netspecture_accent_theme') || 'cyan';
    } catch {
      return 'cyan';
    }
  });

  const currentTheme = ACCENT_THEMES.find((t) => t.id === themeId) || ACCENT_THEMES[0];

  useEffect(() => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--accent-color', currentTheme.hex);
      root.style.setProperty('--accent-rgb', currentTheme.rgb);
      root.style.setProperty('--accent-glow', currentTheme.glow);
      root.style.setProperty('--accent-border', currentTheme.border);
      localStorage.setItem('netspecture_accent_theme', currentTheme.id);
    } catch {}
  }, [currentTheme]);

  const setAccentTheme = (id) => {
    setThemeId(id);
  };

  return (
    <AccentContext.Provider value={{ currentTheme, setAccentTheme, themes: ACCENT_THEMES }}>
      {children}
    </AccentContext.Provider>
  );
};

export const useAccent = () => useContext(AccentContext);
