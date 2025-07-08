'use client';

import React, { useState } from "react";
import { FilterBar } from "./filter-bar";

type Task = {
  id: string;
  title: string;
  description: string;
};

type ColumnProps = {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: string) => void;
  addTask: () => void;
};

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDragOver, onDrop, addTask}) => {
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
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>
  );
};

export default function ProjectsBoard() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "1", title: "Task 1", description: "Description for Task 1" },
      { id: "2", title: "Task 2", description: "Description for Task 2" },
    ],
    inProgress: [],
    done: [],
  });

  const addTask = (column: "todo" | "inProgress" | "done") => {
    const title = prompt("Enter task title:");
    const description = prompt("Enter task description:");
    if (title && description) {
      const newTask = { id: Date.now().toString(), title, description };
      setTasks((prev) => ({
        ...prev,
        [column]: [...prev[column], newTask],
      }));
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    const sourceColumn = event.currentTarget.closest("[data-column]")?.getAttribute("data-column");
    console.log("Dragging task:", { taskId, sourceColumn }); // Debugging
    event.dataTransfer.setData("taskId", taskId);
    event.dataTransfer.setData("sourceColumn", sourceColumn || "");
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Allow drop
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>, targetColumn: string) => {
    const taskId = event.dataTransfer.getData("taskId");
    const sourceColumn = event.dataTransfer.getData("sourceColumn");
    console.log('in onDrop', { taskId, sourceColumn, targetColumn });

    if (!taskId || !sourceColumn) return;

    // If the source and target columns are the same, do nothing
    if (sourceColumn === targetColumn) return;

    setTasks((prev) => {
      const sourceTasks = [...prev[sourceColumn as keyof typeof tasks]];
      const targetTasks = [...prev[targetColumn as keyof typeof tasks]];

      const taskIndex = sourceTasks.findIndex((task) => task.id === taskId);
      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      targetTasks.push(movedTask);

      const updatedTasks = {
        ...prev,
        [sourceColumn]: sourceTasks,
        [targetColumn]: targetTasks,
      };
    
      console.log("Updated tasks:", updatedTasks); // Debugging
      return updatedTasks;
    });
  };

  return (
    <>
      <FilterBar /><div className="grid grid-cols-3 gap-4"></div>
      <div className="grid grid-cols-3 gap-4">
        <Column
          title="todo"
          tasks={tasks.todo}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("todo")}
          data-column="todo"
        />
        <Column
          title="inProgress"
          tasks={tasks.inProgress}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("inProgress")}
          data-column="inProgress"
        />
        <Column
          title="done"
          tasks={tasks.done}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("done")}
          data-column="done"
        />
      </div>
    </>
  );
}