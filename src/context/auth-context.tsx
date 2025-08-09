'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Task, TaskStatus, createTask, updateTask, fetchTasks, deleteTask, UpdateTaskRequest, TaskPriority, normalizeTaskPriority } from "@/lib/api/tasks";

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
  addTaskWithData: (column: TaskStatus, title: string, description: string, due_date?: string, priority?: TaskPriority) => Promise<void>;
  editTask: (taskId: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTaskById: (taskId: string) => Promise<void>;
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
          { id: "1", title: "Task 1", description: "Description for Task 1", status: "todo", due_date: new Date().toISOString().split('T')[0], priority: "Medium" },
          { id: "2", title: "Task 2", description: "Description for Task 2", status: "todo", due_date: new Date().toISOString().split('T')[0], priority: "High" },
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
    if (title && description && user && token) {
      try {
        setIsLoading(true);
        setError(null);
        
        const taskData = {
          title,
          description,
          status: column,
          due_date: new Date().toISOString().split('T')[0], // Default to today
          priority: 'Medium' as TaskPriority, // Default priority
        };

        const newTask = await createTask(taskData, token, user.email);
        const normalizedTask = normalizeTaskPriority(newTask);
        console.log("Task created:", normalizedTask);
        
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

  const addTaskWithData = async (column: TaskStatus, title: string, description: string, due_date?: string, priority?: TaskPriority) => {
    if (title && description) {
      try {
        setIsLoading(true);
        setError(null);
        
        const taskData = {
          title,
          description,
          status: column,
          due_date: due_date || new Date().toISOString().split('T')[0], // Default to today if not provided
          priority: priority || 'Medium' as TaskPriority, // Default priority if not provided
        };

        // If user is logged in, create task via API
        if (user && token) {
          const newTask = await createTask(taskData, token, user.email);

          const normalizedNewTask = normalizeTaskPriority(newTask);
        
          console.log("Task created via API:", normalizedNewTask);
          // Update local state only after successful API response
          setTasks((prev) => ({
            ...prev,
            [column]: [...prev[column], normalizedNewTask],
          }));
        } else {
          // If user is not logged in, create task locally
          const localTask: Task = {
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique local ID
            title,
            description,
            status: column,
            due_date: due_date || new Date().toISOString().split('T')[0],
            priority: priority || 'Medium' as TaskPriority,
          };
          console.log("Task created locally:", localTask);
          // Update local state immediately for non-logged-in users
          setTasks((prev) => ({
            ...prev,
            [column]: [...prev[column], localTask],
          }));
        }
      } catch (err) {
        console.error('Failed to create task:', err);
        setError('Failed to create task. Please try again.');
        throw err; // Re-throw so the component can handle it
      } finally {
        setIsLoading(false);
      }
    }
  };

  const editTask = async (taskId: string, updates: UpdateTaskRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      // If user is logged in and task is not a local task, update via API
      if (user && token && !String(taskId).startsWith('local-')) {
        const updatedTask = await updateTask(taskId, updates, token, user.email);
        console.log("Task updated via API:", updatedTask);

        // Update local state
        setTasks((prev) => {
          const newTasks = { ...prev };
          
          // Find the task in all columns and update it
          Object.keys(newTasks).forEach((column) => {
            const columnKey = column as keyof typeof newTasks;
            const taskIndex = newTasks[columnKey].findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              newTasks[columnKey][taskIndex] = updatedTask;
            }
          });

          return newTasks;
        });
      } else {
        // Handle local task update (for non-logged-in users or local tasks)
        console.log("Task updated locally:", taskId, updates);
        setTasks((prev) => {
          const newTasks = { ...prev };
          
          // Find the task in all columns and update it locally
          Object.keys(newTasks).forEach((column) => {
            const columnKey = column as keyof typeof newTasks;
            const taskIndex = newTasks[columnKey].findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              newTasks[columnKey][taskIndex] = {
                ...newTasks[columnKey][taskIndex],
                ...updates,
              };
            }
          });

          return newTasks;
        });
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaskById = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // If user is logged in and task is not a local task, delete via API
      if (user && token && !String(taskId).startsWith('local-')) {
        await deleteTask(taskId, token, user.email);
        console.log("Task deleted via API:", taskId);
      } else {
        // Handle local task deletion (for non-logged-in users or local tasks)
        console.log("Task deleted locally:", taskId);
      }

      // Update local state (same logic for both API and local tasks)
      setTasks((prev) => {
        const newTasks = { ...prev };
        
        // Find the task in all columns and remove it
        Object.keys(newTasks).forEach((column) => {
          const columnKey = column as keyof typeof newTasks;
          newTasks[columnKey] = newTasks[columnKey].filter(task => task.id !== taskId);
        });

        return newTasks;
      });
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    const sourceColumn = event.currentTarget.closest("[data-column]")?.getAttribute("data-column");
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

      const taskIdNumber = Number(taskId); 
      const task = tasks[sourceColumn as keyof typeof tasks].find((t) => 
        Number(t.id) === taskIdNumber || t.id === taskId
      );

      if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
      }

      // If user is logged in and task is not a local task, update via API
      if (user && token && !String(taskId).startsWith('local-')) {
        // Update task status via API
        await updateTask(
          taskId,
          {
            status: targetColumn as TaskStatus, // Pass the updated column status
          },
          token,
          user.email
        );
        console.log("Task moved via API:", { taskId, sourceColumn, targetColumn });
      } else {
        // Handle local task movement (for non-logged-in users or local tasks)
        console.log("Task moved locally:", { taskId, sourceColumn, targetColumn });
      }
            
      // Update local state (same logic for both API and local tasks)
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
      addTaskWithData, 
      editTask,
      deleteTaskById,
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