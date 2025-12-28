import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
// Minor update: Added comment for clarity
import {
  LayoutDashboard,
  FileText,
  Shield,
  CreditCard,
  Users,
  Activity,
  Receipt,
  Menu,
  X,
  Hexagon,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const patientNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/records', label: 'My Records', icon: FileText },
  { path: '/consent', label: 'Consent & Access', icon: Shield },
  { path: '/billing', label: 'Billing', icon: CreditCard },
];

const doctorNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/access-logs', label: 'Access Logs', icon: Activity },
  { path: '/billing-manage', label: 'Billing', icon: Receipt },
];

export function Sidebar() {
  const { role } = useRole();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = role === 'doctor' ? doctorNavItems : patientNavItems;

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("border-b border-border/50", collapsed ? "p-4" : "p-6")}>
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="relative flex-shrink-0"
          >
            <Hexagon className={cn("text-primary transition-all", collapsed ? "w-8 h-8" : "w-10 h-10")} strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("font-bold text-primary", collapsed ? "text-xs" : "text-sm")}>+</span>
            </div>
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-display text-lg font-bold text-foreground group-hover:text-glow transition-all">
                ONCHAIN
              </h1>
              <p className="text-[10px] text-primary font-medium tracking-[0.25em] -mt-0.5">HOSPITAL</p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Collapse Button - Desktop only */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center hover:border-primary/50 transition-colors z-50"
      >
        <ChevronLeft className={cn("w-4 h-4 text-muted-foreground transition-transform", collapsed && "rotate-180")} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                collapsed && 'justify-center',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={cn(
                "relative z-10 p-1.5 rounded-md transition-colors",
                isActive ? "bg-primary/20" : "group-hover:bg-muted"
              )}>
                <Icon className={cn('w-4 h-4', isActive && 'text-glow')} />
              </div>
              {!collapsed && (
                <span className="font-medium relative z-10 text-sm">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border/50", collapsed ? "p-3" : "p-4")}>
        <div className={cn(
          "rounded-lg bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20",
          collapsed ? "p-2" : "px-4 py-3"
        )}>
          {collapsed ? (
            <div className="flex justify-center">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            </div>
          ) : (
            <>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Network</p>
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-sm font-medium text-primary">Base Mainnet</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-lg bg-card/80 backdrop-blur border border-border shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar border-r border-sidebar-border z-40 lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 relative",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}>
        <SidebarContent collapsed={isCollapsed} />
      </aside>
    </>
  );
}
