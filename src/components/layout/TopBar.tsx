import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRole } from '@/contexts/RoleContext';
import { shortenAddress, generatePatientId } from '@/lib/web3/config';
import { User, Stethoscope, Wallet, Settings, LogOut, Bell, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopBar() {
  const { address, isConnected } = useAccount();
  const { role, setShowRoleModal, clearRole } = useRole();

  return (
    <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Logo on mobile, breadcrumb on desktop */}
        <div className="flex items-center gap-4 pl-12 lg:pl-0">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <Hexagon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">+</span>
              </div>
            </motion.div>
          </Link>

          {isConnected && role && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-4"
            >
              {/* Patient ID Badge */}
              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Patient ID</p>
                <p className="text-sm font-mono font-medium text-primary">
                  {address ? generatePatientId(address) : '---'}
                </p>
              </div>

              {/* Network Status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-xs text-muted-foreground">Base Mainnet</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          {isConnected && role && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-2.5 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </motion.button>
          )}

          {/* Role Badge */}
          {isConnected && role && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowRoleModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all group"
            >
              <div className={`p-1 rounded ${role === 'patient' ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                {role === 'patient' ? (
                  <User className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Stethoscope className="w-3.5 h-3.5 text-secondary" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground capitalize">{role}</span>
            </motion.button>
          )}

          {/* Wallet Connect Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={openConnectModal}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                        >
                          <Wallet className="w-4 h-4" />
                          <span className="hidden sm:inline">Connect</span>
                        </motion.button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-all animate-pulse"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        {/* Chain Selector */}
                        <button
                          onClick={openChainModal}
                          className="hidden md:flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-5 h-5"
                            />
                          )}
                        </button>

                        {/* Account Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center ring-2 ring-primary/20">
                                <span className="text-xs font-bold text-primary-foreground">
                                  {account.displayName?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="hidden sm:block text-left">
                                <p className="text-xs text-muted-foreground">Connected</p>
                                <p className="text-sm font-mono font-medium group-hover:text-primary transition-colors">
                                  {shortenAddress(account.address)}
                                </p>
                              </div>
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                            <div className="px-3 py-2">
                              <p className="text-xs text-muted-foreground">Wallet Address</p>
                              <p className="text-sm font-mono text-foreground">{shortenAddress(account.address, 6)}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowRoleModal(true)} className="cursor-pointer">
                              <User className="w-4 h-4 mr-2" />
                              Switch Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                clearRole();
                                openAccountModal();
                              }}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
