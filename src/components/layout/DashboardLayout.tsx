import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAccount } from 'wagmi';
import { useRole } from '@/contexts/RoleContext';
import { RoleSelectionModal } from '@/components/modals/RoleSelectionModal';
import { ConnectWalletPrompt } from '@/components/ConnectWalletPrompt';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isConnected } = useAccount();
  const { role, showRoleModal } = useRole();

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  // Show role selection if connected but no role
  if (!role || showRoleModal) {
    return <RoleSelectionModal />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
