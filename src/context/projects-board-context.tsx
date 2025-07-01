'use client';

import { createContext, useState, useEffect, ReactNode } from "react";

type ProjectsBoardContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ProjectsBoardContext = createContext<ProjectsBoardContextType | undefined>(undefined);

export function ProjectsBoardProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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