'use client';

import { useAuth } from "@/context/auth-context";
import React from "react";
import { FilterBar } from "./filter-bar";
import { Task } from "@/lib/api/tasks";

type TaskCardProps = {
  task: Task;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, editTask, deleteTask }) => {
  const handleEdit = () => {
    const title = prompt("Enter task title:", task.title);
    if (title === null) return; // User cancelled
    
    const description = prompt("Enter task description:", task.description);
    if (description === null) return; // User cancelled
    
    const tagsInput = prompt("Enter tags (comma-separated):", task.tags?.join(', ') || '');
    if (tagsInput === null) return; // User cancelled
    
    const dueDateInput = prompt("Enter due date (YYYY-MM-DD):", task.due_date || '');
    if (dueDateInput === null) return; // User cancelled
    
    const updates: Partial<Task> = {
      title: title || task.title,
      description: description || task.description,
      tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      due_date: dueDateInput && dueDateInput.match(/^\d{4}-\d{2}-\d{2}$/) ? dueDateInput : undefined,
    };
    
    editTask(task.id, updates);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className="p-3 border rounded mb-2 bg-gray-100 dark:bg-gray-700 relative"
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
    >
      <div className="mb-2">
        <h3 className="font-bold text-sm">{task.title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300">{task.description}</p>
      </div>
      
      <div className="flex justify-between items-end">
        {/* Tags (bottom left) */}
        <div className="flex flex-wrap gap-1">
          {task.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Due date (bottom right) */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {task.due_date && formatDate(task.due_date)}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={handleEdit}
          className="w-6 h-6 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded flex items-center justify-center"
          title="Edit task"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="w-6 h-6 text-xs bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

type ColumnProps = {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: string) => void;
  addTask: () => void;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  isLoading: boolean;
};

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDragOver, onDrop, addTask, editTask, deleteTask, isLoading}) => {
  return (
    <div
      className="p-4 border rounded bg-gray-200 dark:bg-gray-800"
      data-column={title}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, title)}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDragStart={onDragStart}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      ))}
      <button
        onClick={addTask}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
};

export default function ProjectsBoard() {
  const { tasks, addTask, editTask, deleteTask, onDragStart, onDragOver, onDrop, isLoading, error } = useAuth();

  return (
    <>
      <FilterBar />
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <Column
          title="todo"
          tasks={tasks.todo}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("todo")}
          editTask={editTask}
          deleteTask={deleteTask}
          isLoading={isLoading}
        />
        <Column
          title="in_progress"
          tasks={tasks.in_progress}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("in_progress")}
          editTask={editTask}
          deleteTask={deleteTask}
          isLoading={isLoading}
        />
        <Column
          title="done"
          tasks={tasks.done}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("done")}
          editTask={editTask}
          deleteTask={deleteTask}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}