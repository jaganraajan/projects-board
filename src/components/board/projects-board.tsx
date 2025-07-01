'use client';

import React, { useState } from "react";
import { FilterBar } from "./filter-bar";

type Task = {
  title: string;
  description: string;
};

export default function ProjectsBoard() {
  const [tasks, setTasks] = useState({
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[],
  });

  const addTask = (column: "todo" | "inProgress" | "done") => {
    const title = prompt("Enter task title:");
    const description = prompt("Enter task description:");
    if (title && description) {
      setTasks((prev) => ({
        ...prev,
        [column]: [...prev[column], { title, description }],
      }));
    }
  };

  const renderTasks = (tasks: Task[]) =>
    tasks.map((task, index) => (
      <div key={index} className="p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-700">
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
      </div>
    ));

  return (
    <>
        <FilterBar /><div className="grid grid-cols-3 gap-4">
          {/* To Do Column */}
          <div className="p-4 border rounded bg-gray-200 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4">To Do</h2>
              {renderTasks(tasks.todo)}
              <button
                  onClick={() => addTask("todo")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                  Add Task
              </button>
          </div>

          {/* In Progress Column */}
          <div className="p-4 border rounded bg-gray-200 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4">In Progress</h2>
              {renderTasks(tasks.inProgress)}
              <button
                  onClick={() => addTask("inProgress")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                  Add Task
              </button>
          </div>

          {/* Done Column */}
          <div className="p-4 border rounded bg-gray-200 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4">Done</h2>
              {renderTasks(tasks.done)}
              <button
                  onClick={() => addTask("done")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                  Add Task
              </button>
          </div>
      </div>
    </>
  );
}