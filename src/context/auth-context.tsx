'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Task, TaskStatus, createTask, updateTask, fetchTasks, deleteTask } from "@/lib/api/tasks";

type AuthContextType = {
  user: { email: string; company_name: string } | null;
  token: string | null;
  tasks: {
    todo: Task[];
    in_progress: Task[];
    done: Task[];
  };
  setTasks: React.Dispatch<React.SetStateAction<{
    todo: Task[];
    in_progress: Task[];
    done: Task[];
  }>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, company_name: string) => Promise<boolean>;
  addTask: (column: TaskStatus) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, targetColumn: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState({
    todo: [] as Task[],
    in_progress: [] as Task[],
    done: [] as Task[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from API when user and token are available
  const loadTasks = async (userToken: string, userEmail: string) => {
    try {
      setIsLoading(true);
      const allTasks = await fetchTasks(userToken, userEmail);
      
      // Group tasks by status
      const groupedTasks = {
        todo: allTasks.filter(task => task.status === 'todo'),
        in_progress: allTasks.filter(task => task.status === 'in_progress'),
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
          { 
            id: "1", 
            title: "Task 1", 
            description: "Description for Task 1", 
            status: "todo",
            tags: ["urgent", "frontend"],
            due_date: "2024-01-15"
          },
          { 
            id: "2", 
            title: "Task 2", 
            description: "Description for Task 2", 
            status: "todo",
            tags: ["backend"],
            due_date: "2024-01-20"
          },
        ],
        in_progress: [],
        done: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
        console.log("Token found in localStorage:", storedToken);
      setToken(storedToken);

      // Fetch user details using the token
      const fetchUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            const userData = { email: data.email, company_name: data.company_name };
            setUser(userData);
            // Load tasks after setting user
            await loadTasks(storedToken, data.email);
          } else {
            console.error("Failed to fetch user details:", res.statusText);
            logout(); // Clear token if fetching user fails
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          logout(); // Clear token if an error occurs
        }
      };

      fetchUser();
    } else {
      // No token found, load demo tasks for testing
      console.log("No token found, loading demo tasks");
      setTasks({
        todo: [
          { 
            id: "1", 
            title: "Design new homepage", 
            description: "Create a modern and responsive homepage design with hero section and navigation", 
            status: "todo",
            tags: ["urgent", "design", "frontend"],
            due_date: "2024-01-15"
          },
          { 
            id: "2", 
            title: "API Integration", 
            description: "Integrate with the new backend API endpoints", 
            status: "todo",
            tags: ["backend", "api"],
            due_date: "2024-01-20"
          },
        ],
        in_progress: [
          { 
            id: "3", 
            title: "User Authentication", 
            description: "Implement user login and registration", 
            status: "in_progress",
            tags: ["security", "backend"],
            due_date: "2024-01-18"
          },
        ],
        done: [
          { 
            id: "4", 
            title: "Project Setup", 
            description: "Set up the initial project structure", 
            status: "done",
            tags: ["setup"],
            due_date: "2024-01-10"
          },
        ],
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = { email: data.email, company_name: data.company_name };
        setUser(userData);
        localStorage.setItem('token', data.token); // Store token for persistence
        setToken(data.token); // Save the JWT token
        // Load tasks after successful login
        await loadTasks(data.token, data.email);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (email: string, password: string, company_name: string) => {
    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: {
              email,
              password,
              company_name,
            },
          }),
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null); // Clear the token on logout
    localStorage.removeItem("token"); // Remove token from localStorage
    setTasks({
      todo: [],
      in_progress: [],
      done: [],
    }); // Clear tasks on logout
    setError(null);
  };

  const addTask = async (column: TaskStatus) => {
    const title = prompt("Enter task title:");
    const description = prompt("Enter task description:");
    const tagsInput = prompt("Enter tags (comma-separated, optional):");
    const dueDateInput = prompt("Enter due date (YYYY-MM-DD, optional):");
    
    if (title && description && user && token) {
      try {
        setIsLoading(true);
        setError(null);
        
        const taskData = {
          title,
          description,
          status: column,
          tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
          due_date: dueDateInput && dueDateInput.match(/^\d{4}-\d{2}-\d{2}$/) ? dueDateInput : undefined,
        };

        const newTask = await createTask(taskData, token, user.email);
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

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user || !token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedTask = await updateTask(taskId, updates, token, user.email);
      console.log("Task updated:", updatedTask);
      
      // Update local state
      setTasks((prev) => {
        const newTasks = { ...prev };
        
        // Find the task in all columns and update it
        Object.keys(newTasks).forEach((column) => {
          const columnKey = column as keyof typeof newTasks;
          const taskIndex = newTasks[columnKey].findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            newTasks[columnKey][taskIndex] = updatedTask;
          }
        });
        
        return newTasks;
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaskHandler = async (taskId: string) => {
    if (!user || !token) return;
    
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteTask(taskId, token, user.email);
      console.log("Task deleted:", taskId);
      
      // Update local state
      setTasks((prev) => {
        const newTasks = { ...prev };
        
        // Remove the task from all columns
        Object.keys(newTasks).forEach((column) => {
          const columnKey = column as keyof typeof newTasks;
          newTasks[columnKey] = newTasks[columnKey].filter((task) => task.id !== taskId);
        });
        
        return newTasks;
      });
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
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

    if (!taskId || !sourceColumn || !user || !token) return;

    // If the source and target columns are the same, do nothing
    if (sourceColumn === targetColumn) return;

    try {
      setIsLoading(true);
      setError(null);

      const taskIdNumber = Number(taskId); 
      const task = tasks[sourceColumn as keyof typeof tasks].find((t) => Number(t.id) === taskIdNumber);

      if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
      }
      // Update task status via API
      await updateTask(
        taskId,
        {
          status: targetColumn as TaskStatus, // Only update the status for drag and drop
        },
        token,
        user.email
      );
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
    <AuthContext.Provider value={{ 
      user, 
      token, 
      tasks, 
      setTasks, 
      login, 
      logout, 
      register, 
      addTask, 
      editTask,
      deleteTask: deleteTaskHandler,
      onDragStart, 
      onDragOver, 
      onDrop, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}