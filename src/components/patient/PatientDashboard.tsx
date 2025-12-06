import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GlowCard, StatusBadge, DataDisplay } from '@/components/ui/custom-ui';
import { generatePatientId } from '@/lib/web3/config';
import { Activity, FileText, Shield, CreditCard, Clock, CheckCircle } from 'lucide-react';

export function PatientDashboard() {
  const { address } = useAccount();
  const patientId = address ? generatePatientId(address) : '---';

  const stats = [
    { label: 'Total Records', value: '12', icon: FileText, color: 'primary' as const },
    { label: 'Active Consents', value: '3', icon: Shield, color: 'secondary' as const },
    { label: 'Pending Bills', value: '2', icon: CreditCard, color: 'warning' as const },
    { label: 'Last Visit', value: '2 days ago', icon: Clock, color: 'primary' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Patient {patientId}
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg">
                Your medical records are secured on-chain. All data access is logged and requires your explicit consent.
              </p>
            </div>
            <div className="hidden sm:block">
              <StatusBadge status="verified" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
            <CheckCircle className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">Records Integrity Status</p>
              <p className="text-sm text-muted-foreground">
                All records verified against on-chain hashes
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlowCard glowColor={stat.color} className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <GlowCard>
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Record verified', detail: 'Blood test results - REC-001', time: '2 hours ago', type: 'success' },
            { action: 'Access granted', detail: 'Dr. Sarah Chen - Lab Results', time: '1 day ago', type: 'info' },
            { action: 'Payment completed', detail: 'INV-003 - $75.00 USDC', time: '2 days ago', type: 'success' },
            { action: 'New record added', detail: 'Chest X-Ray - REC-004', time: '3 days ago', type: 'info' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-primary' : 'bg-secondary'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </GlowCard>
    </div>
  );
}
