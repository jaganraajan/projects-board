export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  status: TaskStatus;
};

export type UpdateTaskRequest = {
  status: TaskStatus;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_SERVER_API_URL || 'http://localhost:3001';

/**
 * Create a new task via API
 */
export async function createTask(taskData: CreateTaskRequest, token: string, email: string): Promise<Task> {
  if (!API_BASE_URL) {
    throw new Error('API URL not configured');
  }
  
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the JWT token
      'X-User-Email': email, // Include the user's email
    },
    body: JSON.stringify({
      task: taskData
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a task's status via API
 */
export async function updateTask(taskId: string, updates: { title: string; description: string; status: TaskStatus }, token: string, email: string): Promise<Task> {
  if (!API_BASE_URL) {
    throw new Error('API URL not configured');
  }
  

  console.log("Updates object:", updates);
  console.log("token:", token);
  
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the JWT token
      'X-User-Email': email, // Include the user's email
    },
    body: JSON.stringify({
      task: updates
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all tasks for the current user
 */
export async function fetchTasks(token: string, email: string): Promise<Task[]> {
  if (!API_BASE_URL) {
    throw new Error('API URL not configured');
  }
  
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the JWT token
      'X-User-Email': email, // Include the user's email
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
  }

  return response.json();
}