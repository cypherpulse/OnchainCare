import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'patient' | 'doctor' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
  showRoleModal: boolean;
  setShowRoleModal: (show: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    setShowRoleModal(false);
  }, []);

  const clearRole = useCallback(() => {
    setRoleState(null);
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole, showRoleModal, setShowRoleModal }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
