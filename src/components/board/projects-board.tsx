'use client';

import { useAuth } from "@/context/auth-context";
import React, { useState, useEffect } from "react";
import { FilterBar } from "./filter-bar";
import { Task, TaskStatus, createTask, updateTask, fetchTasks } from "@/lib/api/tasks";

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
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState({
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from API on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const allTasks = await fetchTasks(token || "", user?.email || "");
        
        // Group tasks by status
        const groupedTasks = {
          todo: allTasks.filter(task => task.status === 'todo'),
          inProgress: allTasks.filter(task => task.status === 'inProgress'),
          done: allTasks.filter(task => task.status === 'done'),
        };
        
        setTasks(groupedTasks);
        setError(null);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setError('Failed to load tasks. Please try again.');
        // Fall back to initial tasks for demo purposes
        setTasks({
          todo: [
            { id: "1", title: "Task 1", description: "Description for Task 1", status: "todo" },
            { id: "2", title: "Task 2", description: "Description for Task 2", status: "todo" },
          ],
          inProgress: [],
          done: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (column: TaskStatus) => {
    const title = prompt("Enter task title:");
    const description = prompt("Enter task description:");
    if (title && description) {
      try {
        setIsLoading(true);
        setError(null);
        
        const taskData = {
          title,
          description,
          status: column,
        };

        const newTask = await createTask(taskData, token || "", user?.email || "");
        console.log("Task created:", newTask);
        // Update local state only after successful API response
        setTasks((prev) => ({
          ...prev,
          [column]: [...prev[column], newTask],
        }));
      } catch (err) {
        console.error('Failed to create task:', err);
        setError('Failed to create task. Please try again.');
      } finally {
        setIsLoading(false);
      }
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

  const onDrop = async (event: React.DragEvent<HTMLDivElement>, targetColumn: string) => {
    const taskId = event.dataTransfer.getData("taskId");
    const sourceColumn = event.dataTransfer.getData("sourceColumn");
    console.log('in onDrop', { taskId, sourceColumn, targetColumn });

    if (!taskId || !sourceColumn) return;

    // If the source and target columns are the same, do nothing
    if (sourceColumn === targetColumn) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Update task status via API
      await updateTask(taskId, { status: targetColumn as TaskStatus }, token || '', user?.email || "");
      console.log("Task moved successfully:", { taskId, sourceColumn, targetColumn });
      
      // Update local state only after successful API response
      setTasks((prev) => {
        const sourceTasks = [...prev[sourceColumn as keyof typeof tasks]];
        const targetTasks = [...prev[targetColumn as keyof typeof tasks]];

        const taskIndex = sourceTasks.findIndex((task) => task.id === taskId);
        const [movedTask] = sourceTasks.splice(taskIndex, 1);
        
        // Update the task's status
        movedTask.status = targetColumn as TaskStatus;
        targetTasks.push(movedTask);

        const updatedTasks = {
          ...prev,
          [sourceColumn]: sourceTasks,
          [targetColumn]: targetTasks,
        };
      
        console.log("Updated tasks:", updatedTasks); // Debugging
        return updatedTasks;
      });
    } catch (err) {
      console.error('Failed to move task:', err);
      setError('Failed to move task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          title="inProgress"
          tasks={tasks.inProgress}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          addTask={() => addTask("inProgress")}
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