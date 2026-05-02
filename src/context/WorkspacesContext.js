import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from './UserContext';

const WorkspacesContext = createContext(null);

export function WorkspacesProvider({ children }) {
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState([]);
  const [invites, setInvites] = useState([]);

  // Fetch real workspaces and invites when user logs in
  useEffect(() => {
    if (user) {
      fetchWorkspaces();
      fetchInvites();
    } else {
      setWorkspaces([]);
      setInvites([]);
    }
  }, [user]);

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get('/workspaces');
      
      // Map backend _id to frontend id, and colorCode to color
      const formatted = response.data.map(ws => ({
        ...ws,
        id: ws._id,
        color: ws.colorCode 
      }));
      setWorkspaces(formatted);
    } catch (error) {
      console.error('Failed to fetch workspaces', error);
    }
  };

  const fetchInvites = async () => {
    try {
      const response = await api.get('/invites');
      const formatted = response.data.map(inv => ({
        id: inv._id,
        name: inv.workspaceId?.name || 'Unknown Workspace',
        color: inv.workspaceId?.colorCode || '#1e4db7',
        leader: `${inv.senderId?.firstName} ${inv.senderId?.lastName}`,
        memberCount: inv.memberCount || 1
      }));
      setInvites(formatted);
    } catch (error) {
      console.error('Failed to fetch invites', error);
    }
  };

  const addWorkspace = async (wsFields) => {
    // 1. Optimistic Update
    const tempId = Date.now().toString();
    const tempWs = {
      ...wsFields,
      id: tempId,
      color: wsFields.color || '#1e4db7',
      members: [`${user.firstName} ${user.lastName}`],
      role: 'leader',
      leader: user.firstName
    };
    
    setWorkspaces(prev => [...prev, tempWs]);

    try {
      const payload = {
        name: wsFields.name,
        description: wsFields.description,
        color: wsFields.color || '#1e4db7'
      };
      
      const response = await api.post('/workspaces', payload);
      
      const newWs = {
        ...response.data,
        id: response.data._id,
        color: response.data.colorCode,
        members: [`${user.firstName} ${user.lastName}`],
        memberDetails: [{ id: user.id || user._id, name: `${user.firstName} ${user.lastName}` }],
        role: 'leader',
        leader: user.firstName
      };
      
      // Replace fake ID with real ID
      setWorkspaces(prev => prev.map(ws => ws.id === tempId ? newWs : ws));
      return newWs;
    } catch (error) {
      console.error('Failed to create workspace', error);
      setWorkspaces(prev => prev.filter(ws => ws.id !== tempId));
      alert(`Error creating workspace: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  const leaveWorkspace = async (id) => {
    try {
      // Optimistic update
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      await api.delete(`/workspaces/${id}/leave`);
    } catch (error) {
      console.error('Failed to leave workspace', error);
      fetchWorkspaces(); // Revert on failure
    }
  };

  const disbandWorkspace = async (id) => {
    try {
      // Optimistic update
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      await api.delete(`/workspaces/${id}`);
    } catch (error) {
      console.error('Failed to disband workspace', error);
      fetchWorkspaces(); // Revert on failure
    }
  };

  const removeMember = async (workspaceId, memberId) => {
    try {
      setWorkspaces(prev => prev.map(ws => {
        if (ws.id === workspaceId && ws.memberDetails) {
          const updatedDetails = ws.memberDetails.filter(m => m.id !== memberId);
          const updatedMembers = updatedDetails.map(m => m.name);
          return { ...ws, memberDetails: updatedDetails, members: updatedMembers };
        }
        return ws;
      }));
      await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    } catch (error) {
      console.error('Failed to remove member', error);
      fetchWorkspaces();
    }
  };

  const sendInvite = async (workspaceId, userEmail) => {
    try {
      await api.post('/invites', { workspaceId, userEmail });
      return { success: true };
    } catch (error) {
      console.error('Failed to send invite', error);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  const respondToInvite = async (inviteId, status) => {
    try {
      // Optimistic remove
      setInvites(prev => prev.filter(inv => inv.id !== inviteId));
      await api.put(`/invites/${inviteId}`, { status });
      if (status === 'accepted') {
        fetchWorkspaces(); // Refresh to show the new workspace
      }
    } catch (error) {
      console.error(`Failed to ${status} invite`, error);
      fetchInvites(); // Revert
    }
  };

  return (
    <WorkspacesContext.Provider value={{ 
      workspaces, 
      setWorkspaces, 
      fetchWorkspaces, 
      addWorkspace, 
      leaveWorkspace, 
      disbandWorkspace,
      removeMember,
      invites,
      fetchInvites,
      sendInvite,
      respondToInvite
    }}>
      {children}
    </WorkspacesContext.Provider>
  );
}

export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider');
  }
  return context;
}
