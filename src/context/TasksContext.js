import React, { createContext, useContext, useState } from 'react';
import mockTasks from '../data/mockTasks';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  // Initialize tasks with the same logic used in pages
  const [tasks, setTasks] = useState(
    mockTasks.map((t) => ({ ...t, completed: t.progress === 100 || t.completed }))
  );

  const addTask = (newTaskFields) => {
    const newId = (tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0) + 1;
    const newTask = { id: newId, ...newTaskFields };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      clearCompleted,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
