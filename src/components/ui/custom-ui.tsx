import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'warning' | 'destructive';
  hover?: boolean;
}

export function GlowCard({ children, className, glowColor = 'primary', hover = true }: GlowCardProps) {
  const glowClasses = {
    primary: 'hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] border-primary/20',
    secondary: 'hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)] border-secondary/20',
    warning: 'hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)] border-warning/20',
    destructive: 'hover:shadow-[0_0_30px_hsl(var(--destructive)/0.3)] border-destructive/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-lg border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300',
        hover && glowClasses[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: 'verified' | 'pending' | 'granted' | 'revoked' | 'due' | 'paid';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    verified: {
      label: 'Verified',
      classes: 'bg-success/20 text-success border-success/30',
    },
    pending: {
      label: 'Pending',
      classes: 'bg-warning/20 text-warning border-warning/30',
    },
    granted: {
      label: 'Access Granted',
      classes: 'bg-secondary/20 text-secondary border-secondary/30',
    },
    revoked: {
      label: 'Revoked',
      classes: 'bg-destructive/20 text-destructive border-destructive/30',
    },
    due: {
      label: 'Due',
      classes: 'bg-warning/20 text-warning border-warning/30',
    },
    paid: {
      label: 'Paid',
      classes: 'bg-success/20 text-success border-success/30',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.classes,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </span>
  );
}

interface DataDisplayProps {
  label: string;
  value: string | ReactNode;
  mono?: boolean;
  className?: string;
}

export function DataDisplay({ label, value, mono = false, className }: DataDisplayProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={cn('text-foreground', mono && 'font-mono text-sm')}>{value}</p>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
