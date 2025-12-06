import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GlowCard, StatusBadge, DataDisplay } from '@/components/ui/custom-ui';
import { ConsentManager, Billing } from '@/lib/web3/contracts';
import { shortenAddress } from '@/lib/web3/config';
import { Users, Activity, DollarSign, TrendingUp, Clock, Eye } from 'lucide-react';

export function DoctorDashboard() {
  const { address } = useAccount();

  const { data: consents } = useQuery({
    queryKey: ['doctorConsents', address],
    queryFn: () => ConsentManager.getDoctorConsents(address || ''),
    enabled: !!address,
  });

  const { data: accessLogs } = useQuery({
    queryKey: ['accessLogs', address],
    queryFn: () => ConsentManager.getAccessLogs({ doctorAddress: address }),
    enabled: !!address,
  });

  const { data: invoices } = useQuery({
    queryKey: ['doctorInvoices', address],
    queryFn: () => Billing.getDoctorInvoices(address || ''),
    enabled: !!address,
  });

  const activePatients = consents?.length || 0;
  const recentLogs = accessLogs?.slice(0, 5) || [];
  const totalRevenue = invoices?.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0) || 0;
  const pendingPayments = invoices?.filter(i => i.status === 'DUE').length || 0;

  const stats = [
    { label: 'Active Patients', value: activePatients.toString(), icon: Users, color: 'primary' as const },
    { label: 'Records Accessed', value: accessLogs?.length.toString() || '0', icon: Eye, color: 'secondary' as const },
    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'primary' as const },
    { label: 'Pending Payments', value: pendingPayments.toString(), icon: TrendingUp, color: 'warning' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-card to-card p-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Doctor Dashboard</p>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Healthcare Provider Portal
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg">
                View patient records with consent, manage billing, and track all access events on-chain.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm text-secondary">On-Chain Verified</span>
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Access Events */}
        <GlowCard>
          <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            Recent Access Events
          </h2>
          <div className="space-y-3">
            {recentLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.action === 'VIEW' ? 'bg-secondary/20 text-secondary' :
                    log.action === 'VERIFY' ? 'bg-primary/20 text-primary' :
                    log.action === 'UPDATE' ? 'bg-warning/20 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {log.action} - {log.recordId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Patient {log.patientId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>

        {/* Patients with Consent */}
        <GlowCard glowColor="secondary">
          <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Patients with Active Consent
          </h2>
          <div className="space-y-3">
            {consents?.slice(0, 5).map((consent, i) => (
              <motion.div
                key={consent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {consent.patientAddress.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-foreground">
                      {shortenAddress(consent.patientAddress)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {consent.scopes.length} scope{consent.scopes.length > 1 ? 's' : ''} granted
                    </p>
                  </div>
                </div>
                <StatusBadge status="granted" />
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
