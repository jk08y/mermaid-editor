// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { ThemeType } from '../types';

export const useTheme = () => {
  // Check local storage or use system preference as default
  const getInitialTheme = (): ThemeType => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  // Apply theme to document and update local storage when theme changes
  useEffect(() => {
    // Update local storage
    localStorage.setItem('theme', theme);
    
    // Update document theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, setTheme, toggleTheme };
};