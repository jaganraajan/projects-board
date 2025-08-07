'use client';

import { useAuth } from "@/context/auth-context";
import React, { useState } from "react";
import { FilterBar } from "./filter-bar";
import { Task } from "@/lib/api/tasks";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: string) => void;
  addTask: () => void;
  isLoading: boolean;
};

const getColumnDisplayName = (title: string) => {
  switch (title) {
    case 'todo': return 'To Do';
    case 'in_progress': return 'In Progress';
    case 'done': return 'Done';
    default: return title;
  }
};

const getColumnColor = (title: string) => {
  switch (title) {
    case 'todo': return 'border-l-blue-500';
    case 'in_progress': return 'border-l-yellow-500';
    case 'done': return 'border-l-green-500';
    default: return 'border-l-gray-500';
  }
};

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDragOver, onDrop, addTask, isLoading}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    onDragOver(event);
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    onDrop(event, title);
  };

  return (
    <div
      className={`
        flex flex-col h-fit min-h-[500px] w-80 flex-shrink-0
        bg-white dark:bg-gray-900 rounded-xl shadow-lg border-l-4 ${getColumnColor(title)}
        transition-all duration-200 ease-in-out
        ${isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 shadow-xl' : ''}
      `}
      data-column={title}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {getColumnDisplayName(title)}
          </h2>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="
              group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
              shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing
              hover:border-gray-300 dark:hover:border-gray-600
            "
            draggable
            onDragStart={(event) => onDragStart(event, task.id)}
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {task.description}
            </p>
            
            {/* Task footer with optional tags/avatars space */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex space-x-1">
                {/* Placeholder for future tags */}
              </div>
              <div className="flex items-center space-x-1">
                {/* Placeholder for future avatars */}
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={addTask}
          disabled={isLoading}
          className="
            w-full flex items-center justify-center px-4 py-2.5 
            text-sm font-medium text-gray-700 dark:text-gray-300
            bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
            border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500
            rounded-lg transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          "
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default function ProjectsBoard() {
  const { tasks, addTask, onDragStart, onDragOver, onDrop, isLoading, error } = useAuth();

  return (
    <div className="h-full">
      <FilterBar />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 min-h-[600px]">
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            title="todo"
            tasks={tasks.todo}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={() => addTask("todo")}
            isLoading={isLoading}
          />
          <Column
            title="in_progress"
            tasks={tasks.in_progress}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={() => addTask("in_progress")}
            isLoading={isLoading}
          />
          <Column
            title="done"
            tasks={tasks.done}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={() => addTask("done")}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}