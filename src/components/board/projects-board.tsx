'use client';

import { useAuth } from "@/context/auth-context";
import React, { useState } from "react";
import { FilterBar } from "./filter-bar";
import { Task, UpdateTaskRequest } from "@/lib/api/tasks";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: string) => void;
  addTask: (title: string, description: string, due_date?: string) => Promise<void>;
  editTask: (taskId: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
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

const Column: React.FC<ColumnProps> = ({ title, tasks, onDragStart, onDragOver, onDrop, addTask, editTask, deleteTask, isLoading}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', due_date: new Date().toISOString().split('T')[0] });

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

  const handleAddTask = () => {
    setShowForm(true);
  };

  const handleSaveTask = async () => {
    if (formData.title.trim() && formData.description.trim()) {
      try {
        await addTask(formData.title.trim(), formData.description.trim(), formData.due_date);
        setFormData({ title: '', description: '', due_date: new Date().toISOString().split('T')[0] });
        setShowForm(false);
      } catch (error) {
        // Error handling is managed by the parent component
        console.error('Failed to save task:', error);
      }
    }
  };

  const handleCancelTask = () => {
    setFormData({ title: '', description: '', due_date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleFormChange = (field: 'title' | 'description' | 'due_date', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

type TaskCardProps = {
  task: Task;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  editTask: (taskId: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  isLoading: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, editTask, deleteTask, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    due_date: task.due_date || new Date().toISOString().split('T')[0]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await editTask(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description,
      due_date: task.due_date || new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isEditing) {
    return (
      <div className="
        p-4 bg-gray-600 rounded-lg border border-gray-500
        shadow-sm space-y-3
      ">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
          className="
            w-full px-3 py-2 text-sm font-medium
            bg-gray-700 
            border border-gray-500
            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-100
          "
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="
            w-full px-3 py-2 text-sm resize-none
            bg-gray-700 
            border border-gray-500
            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-100
          "
        />
        <input
          type="date"
          value={editData.due_date}
          onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
          className="
            w-full px-3 py-2 text-sm
            bg-gray-700 
            border border-gray-500
            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-100
          "
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSaveEdit}
            disabled={!editData.title.trim() || !editData.description.trim() || isLoading}
            className="
              flex-1 px-3 py-2 text-sm font-medium
              bg-blue-600 hover:bg-blue-700 text-white
              border border-transparent
              rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            "
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="
              flex-1 px-3 py-2 text-sm font-medium
              text-gray-200
              bg-gray-600 hover:bg-gray-500
              border border-gray-500
              rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
            "
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        group p-4 bg-gray-600 rounded-lg border border-gray-500
        shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing
        hover:border-gray-400
      "
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-100 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="
              p-1.5 text-gray-400 hover:text-blue-400
              hover:bg-blue-900 rounded transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="
              p-1.5 text-gray-400 hover:text-red-400
              hover:bg-red-900 rounded transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-300 line-clamp-3 mb-3">
        {task.description}
      </p>
      
      {/* Task footer with due date */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {/* Placeholder for future tags */}
        </div>
        <div className="flex items-center space-x-2">
          {task.due_date && (
            <span className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

return (
    <div
      className={`
        flex flex-col h-fit min-h-[500px] w-80 flex-shrink-0
        bg-gray-700 rounded-xl shadow-lg border-l-4 ${getColumnColor(title)}
        transition-all duration-200 ease-in-out border border-gray-600
        ${isDragOver ? 'bg-blue-900 shadow-xl' : ''}
      `}
      data-column={title}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100">
            {getColumnDisplayName(title)}
          </h2>
          <span className="bg-gray-600 text-gray-200 text-sm px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            editTask={editTask}
            deleteTask={deleteTask}
            isLoading={isLoading}
          />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
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
      <div className="p-4 border-t border-gray-600">
        {!showForm && (
          <button
            onClick={handleAddTask}
            disabled={isLoading}
            className="
              w-full flex items-center justify-center px-4 py-2.5 
              text-sm font-medium text-gray-200
              bg-gray-600 hover:bg-gray-500
              border border-gray-500 hover:border-gray-400
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
        )}

        {/* Inline Form */}
        {showForm && (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Task title..."
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="
                  w-full px-3 py-2 text-sm
                  bg-gray-600 
                  border border-gray-500
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-100
                  placeholder-gray-400
                "
                autoFocus
              />
            </div>
            <div>
              <textarea
                placeholder="Task description..."
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                className="
                  w-full px-3 py-2 text-sm resize-none
                  bg-gray-600 
                  border border-gray-500
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-100
                  placeholder-gray-400
                "
              />
            </div>
            <div>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleFormChange('due_date', e.target.value)}
                className="
                  w-full px-3 py-2 text-sm
                  bg-gray-600 
                  border border-gray-500
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-100
                "
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveTask}
                disabled={!formData.title.trim() || !formData.description.trim() || isLoading}
                className="
                  flex-1 px-3 py-2 text-sm font-medium
                  bg-blue-600 hover:bg-blue-700 text-white
                  border border-transparent
                  rounded-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                "
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelTask}
                disabled={isLoading}
                className="
                  flex-1 px-3 py-2 text-sm font-medium
                  text-gray-200
                  bg-gray-600 hover:bg-gray-500
                  border border-gray-500
                  rounded-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
                "
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProjectsBoard() {
  const { tasks, addTaskWithData, editTask, deleteTaskById, onDragStart, onDragOver, onDrop, isLoading, error } = useAuth();

  return (
    <div className="h-full">
      <FilterBar />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[600px] border border-gray-700">
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            title="todo"
            tasks={tasks.todo}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={(title, description, due_date) => addTaskWithData("todo", title, description, due_date)}
            editTask={editTask}
            deleteTask={deleteTaskById}
            isLoading={isLoading}
          />
          <Column
            title="in_progress"
            tasks={tasks.in_progress}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={(title, description, due_date) => addTaskWithData("in_progress", title, description, due_date)}
            editTask={editTask}
            deleteTask={deleteTaskById}
            isLoading={isLoading}
          />
          <Column
            title="done"
            tasks={tasks.done}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            addTask={(title, description, due_date) => addTaskWithData("done", title, description, due_date)}
            editTask={editTask}
            deleteTask={deleteTaskById}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}