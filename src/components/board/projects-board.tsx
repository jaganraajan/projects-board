'use client';

import { useAuth } from "@/context/auth-context";
import React from "react";
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

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDragOver, onDrop, addTask, isLoading}) => {
  return (
    <div
      className="p-4 border rounded bg-gray-200 dark:bg-gray-800"
      data-column={title}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, title)}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-700"
          draggable
          onDragStart={(event) => onDragStart(event, task.id)}
        >
          <h3 className="font-bold">{task.title}</h3>
          <p>{task.description}</p>
        </div>
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
  const { tasks, addTask, onDragStart, onDragOver, onDrop, isLoading, error } = useAuth();

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
    </>
  );
}