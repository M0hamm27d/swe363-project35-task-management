import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from './UserContext';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);

  // Fetch real tasks automatically whenever a user logs in!
  useEffect(() => {
    if (user) {
      fetchPersonalTasks();
    } else {
      // Clear tasks if user logs out
      setTasks([]);
      setTags([]);
    }
  }, [user]);



  const fetchPersonalTasks = async () => {
    try {
      const tagsRes = await api.get('/tags/workspace/null');
      const formattedTags = tagsRes.data.personalTags.map(t => ({
        ...t, id: t._id, color: t.colorCode, workspaceId: 'personal'
      }));
      setTags(prev => [...prev.filter(t => t.workspaceId !== 'personal'), ...formattedTags]);

      const response = await api.get('/tasks/personal');
      
      // MongoDB uses '_id', but your React app was built using 'id'. 
      // We map it here so we don't have to change 100 React components!
      const formattedTasks = response.data.map(t => ({
        ...t,
        id: t._id,
        workspaceId: 'personal', // Frontend expects 'personal' instead of null
        tag: t.tag ? { ...t.tag, id: t.tag._id, color: t.tag.colorCode } : null
      }));
      
      setTasks(prev => {
        const workspaceTasks = prev.filter(t => t.workspaceId !== 'personal');
        return [...workspaceTasks, ...formattedTasks];
      });
    } catch (error) {
      console.error('Failed to fetch personal tasks', error);
    }
  };

  const fetchWorkspaceTasks = async (workspaceId) => {
    try {
      const tagsRes = await api.get(`/tags/workspace/${workspaceId}`);
      const formattedTags = tagsRes.data.workspaceTags.map(t => ({
        ...t, id: t._id, color: t.colorCode, workspaceId
      }));
      setTags(prev => [...prev.filter(t => t.workspaceId !== workspaceId), ...formattedTags]);

      const response = await api.get(`/tasks/workspace/${workspaceId}`);
      
      const formattedTasks = response.data.map(t => ({
        ...t,
        id: t._id,
        tag: t.tag ? { ...t.tag, id: t.tag._id, color: t.tag.colorCode } : null
      }));
      
      setTasks(prev => {
        const otherTasks = prev.filter(t => t.workspaceId !== workspaceId);
        return [...otherTasks, ...formattedTasks];
      });
    } catch (error) {
      console.error('Failed to fetch workspace tasks', error);
    }
  };

  const addTask = async (newTaskFields) => {
    // 1. Optimistic Update: Show immediately on UI
    const tempId = Date.now().toString(); // fake ID until server responds
    const tempTask = {
      ...newTaskFields,
      id: tempId,
      completed: false,
      progress: 0,
      workspaceId: newTaskFields.workspaceId
    };
    
    setTasks((prev) => [tempTask, ...prev]);

    try {
      // Frontend sends 'personal', Backend expects null for personal tasks
      const payload = {
        ...newTaskFields,
        workspaceId: newTaskFields.workspaceId === 'personal' ? null : newTaskFields.workspaceId
      };
      
      const response = await api.post('/tasks', payload);
      
      const newTask = { 
        ...response.data, 
        id: response.data._id, 
        workspaceId: newTaskFields.workspaceId,
        tag: newTaskFields.tag || null // keep the frontend tag object because backend returns an ID
      };
      
      // Replace the fake temp task with the real task from the database
      setTasks((prev) => prev.map(t => t.id === tempId ? newTask : t));
      return newTask;
    } catch (error) {
      console.error('Failed to create task', error.response?.data || error);
      // Remove the fake task because the server rejected it
      setTasks((prev) => prev.filter(t => t.id !== tempId));
      alert(`Error saving task: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      // 1. Optimistic Update (Update UI instantly)
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
      );
      
      // 2. Send to backend
      await api.put(`/tasks/${id}`, updatedFields);
    } catch (error) {
      console.error('Failed to update task', error);
      fetchPersonalTasks(); // Revert UI if server fails
    }
  };

  const deleteTask = async (id) => {
    try {
      // 1. Optimistic Update
      setTasks((prev) => prev.filter((t) => t.id !== id));
      
      // 2. Send to backend
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Failed to delete task', error);
      fetchPersonalTasks(); // Revert UI if server fails
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const newStatus = !task.completed;
      
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: newStatus } : t))
      );
      
      await api.put(`/tasks/${id}`, { completed: newStatus });
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedTasks = tasks.filter(t => t.completed && t.workspaceId === 'personal');
      
      // Optimistic update
      setTasks((prev) => prev.filter((t) => !t.completed));
      
      // Delete from backend sequentially
      for (const t of completedTasks) {
        await api.delete(`/tasks/${t.id}`);
      }
    } catch (error) {
      console.error('Failed to clear tasks', error);
    }
  };

  // Tag Management — integrated with backend API
  const addTag = async (tag, workspaceId) => {
    // Guard against missing tag or name
    if (!tag || !tag.name) {
      console.warn('Attempted to add a tag without a name');
      return;
    }
    // Optimistic update
    const tempTag = { ...tag, workspaceId, id: Date.now().toString() };
    setTags((prev) => {
      // Prevent duplicate tag names (case‑insensitive) within the same workspace
      const duplicate = prev.some((t) => t.name && t.name.toLowerCase() === tag.name.toLowerCase() && t.workspaceId === workspaceId);
      if (duplicate) {
        console.warn('Duplicate tag name');
        return prev;
      }
      return [...prev, tempTag];
    });

    try {
      const payload = { name: tag.name, color: tag.color || '#e74c3c', workspaceId: workspaceId === 'personal' ? null : workspaceId, userId: null };
      const response = await api.post('/tags', payload);
      const newTag = { ...response.data, id: response.data._id, color: response.data.colorCode, workspaceId };
      setTags((prev) => prev.map(t => t.id === tempTag.id ? newTag : t));
    } catch (error) {
      console.error('Failed to create tag', error);
      setTags((prev) => prev.filter(t => t.id !== tempTag.id));
      alert(`Error creating tag: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  const editTag = async (oldName, updatedTag, workspaceId) => {
    // Find the tag to get its database ID
    const existingTag = tags.find(t => t.name === oldName && t.workspaceId === workspaceId);

    // Optimistic update
    setTags((prev) =>
      prev.map((t) => (t.name === oldName && t.workspaceId === workspaceId ? { ...updatedTag, workspaceId, id: t.id } : t))
    );
    setTasks((prev) =>
      prev.map((t) =>
        (t.tag?.name === oldName && t.workspaceId === workspaceId) ? { ...t, tag: updatedTag } : t
      )
    );

    try {
      if (existingTag && (existingTag._id || existingTag.id)) {
        await api.put(`/tags/${existingTag._id || existingTag.id}`, {
          name: updatedTag.name,
          color: updatedTag.color
        });
      }
    } catch (error) {
      console.error('Failed to update tag', error);
    }
  };

  const deleteTag = async (tagName, workspaceId) => {
    const existingTag = tags.find(t => t.name === tagName && t.workspaceId === workspaceId);

    // Optimistic update
    setTags((prev) => prev.filter((t) => !(t.name === tagName && t.workspaceId === workspaceId)));
    setTasks((prev) =>
      prev.map((t) =>
        (t.tag?.name === tagName && t.workspaceId === workspaceId) ? { ...t, tag: null } : t
      )
    );

    try {
      if (existingTag && (existingTag._id || existingTag.id)) {
        await api.delete(`/tags/${existingTag._id || existingTag.id}`);
      }
    } catch (error) {
      console.error('Failed to delete tag', error);
    }
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
      fetchPersonalTasks,
      fetchWorkspaceTasks
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
