'use client';

import { useContext } from "react";
import ProjectsBoardContext from "@/context/projects-board-context";

export function FilterBar() {
  const context = useContext(ProjectsBoardContext);

  if (!context) {
    throw new Error("FilterBar must be used within a ProjectsBoardContextProvider");
  }

  const { isDarkMode, toggleDarkMode } = context;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
      <span className="text-lg font-bold">Filter Bar</span>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? (
          <span role="img" aria-label="Sun Icon">
            ☀️
          </span>
        ) : (
          <span role="img" aria-label="Moon Icon">
            🌙
          </span>
        )}
      </button>
    </div>
  );
}