import { createContext, useContext, useState } from 'react';
import { mockWorkspaces } from '../data/mockTasks';

const WorkspacesContext = createContext(null);

export function WorkspacesProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);

  function addWorkspace(ws) {
    setWorkspaces((prev) => [...prev, ws]);
  }

  return (
    <WorkspacesContext.Provider value={{ workspaces, setWorkspaces, addWorkspace }}>
      {children}
    </WorkspacesContext.Provider>
  );
}

export function useWorkspaces() {
  return useContext(WorkspacesContext);
}
