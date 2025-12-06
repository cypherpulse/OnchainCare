import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GlowCard, SectionHeader } from '@/components/ui/custom-ui';
import { ConsentManager, AccessLog } from '@/lib/web3/contracts';
import { shortenAddress, generatePatientId } from '@/lib/web3/config';
import { Activity, Eye, Edit, FileCheck, Download, Filter, Calendar, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const actionIcons = {
  VIEW: Eye,
  UPDATE: Edit,
  VERIFY: FileCheck,
  EXPORT: Download,
};

const actionColors = {
  VIEW: 'bg-secondary/20 text-secondary border-secondary/30',
  UPDATE: 'bg-warning/20 text-warning border-warning/30',
  VERIFY: 'bg-primary/20 text-primary border-primary/30',
  EXPORT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export function DoctorAccessLogs() {
  const { address } = useAccount();
  const [patientFilter, setPatientFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['accessLogs', address],
    queryFn: () => ConsentManager.getAccessLogs({ doctorAddress: address }),
    enabled: !!address,
  });

  const filteredLogs = logs?.filter(log => {
    const matchesPatient = patientFilter
      ? log.patientId.toLowerCase().includes(patientFilter.toLowerCase()) ||
        log.patientAddress.toLowerCase().includes(patientFilter.toLowerCase())
      : true;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesPatient && matchesAction;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Access Log"
        description="View all on-chain access events. Every record access is immutably logged."
      />

      {/* Filters */}
      <GlowCard className="!p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient ID or address..."
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="VIEW">View</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="VERIFY">Verify</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlowCard>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-4">
          {filteredLogs?.map((log, i) => {
            const Icon = actionIcons[log.action];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-card border-2 border-primary hidden sm:flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="sm:ml-14">
                  <GlowCard className="!p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg border ${actionColors[log.action]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs border ${actionColors[log.action]}`}>
                              {log.action}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              Record {log.recordId}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.patientId}
                            </span>
                            <span className="font-mono text-xs">
                              {shortenAddress(log.patientAddress)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        Recorded on-chain by{' '}
                        <span className="font-mono text-primary">{shortenAddress(log.doctorAddress)}</span>
                      </p>
                    </div>
                  </GlowCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
