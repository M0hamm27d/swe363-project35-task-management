import React, { createContext, useContext, useState } from 'react';
import mockTasks from '../data/mockTasks';
import { extractTags } from '../utils/taskHelpers';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  // Initialize tasks with the same logic used in pages
  const [tasks, setTasks] = useState(
    mockTasks.map((t) => ({ ...t, completed: t.progress === 100 || t.completed }))
  );

  const [tags, setTags] = useState(() => {
    const seen = new Set();
    const result = [];
    tasks.forEach(t => {
      if (t.tag) {
        const key = `${t.tag.name}-${t.workspaceId || 'personal'}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ ...t.tag, workspaceId: t.workspaceId || 'personal' });
        }
      }
    });
    return result;
  });

  const addTag = (tag, workspaceId) => {
    setTags((prev) => {
      if (prev.some((t) => t.name.toLowerCase() === tag.name.toLowerCase() && t.workspaceId === workspaceId)) return prev;
      return [...prev, { ...tag, workspaceId }];
    });
  };

  const editTag = (oldName, updatedTag, workspaceId) => {
    // 1. Update the tags list
    setTags((prev) =>
      prev.map((t) => (t.name === oldName && t.workspaceId === workspaceId ? { ...updatedTag, workspaceId } : t))
    );
    // 2. Update all tasks using this tag in this workspace
    setTasks((prev) =>
      prev.map((t) =>
        (t.tag?.name === oldName && t.workspaceId === workspaceId) ? { ...t, tag: updatedTag } : t
      )
    );
  };

  const deleteTag = (tagName, workspaceId) => {
    // 1. Remove from tags list
    setTags((prev) => prev.filter((t) => !(t.name === tagName && t.workspaceId === workspaceId)));
    // 2. Clear from all tasks using this tag in this workspace
    setTasks((prev) =>
      prev.map((t) =>
        (t.tag?.name === tagName && t.workspaceId === workspaceId) ? { ...t, tag: null } : t
      )
    );
  };

  const addTask = (newTaskFields) => {
    const newId = (tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0) + 1;
    const newTask = { 
      id: newId, 
      isVisible: true,
      workspaceId: null, // default
      ...newTaskFields 
    };
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
      tags,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      clearCompleted,
      addTag,
      editTag,
      deleteTag,
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
