'use client';

import { createContext, useState, useEffect, ReactNode } from "react";

type ProjectsBoardContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ProjectsBoardContext = createContext<ProjectsBoardContextType | undefined>(undefined);

export function ProjectsBoardProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (!mounted) return;
    
    console.log('Applying dark mode:', isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = () => {
    console.log('toggle dark mode', isDarkMode);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ProjectsBoardContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ProjectsBoardContext.Provider>
  );
}

export default ProjectsBoardContext;