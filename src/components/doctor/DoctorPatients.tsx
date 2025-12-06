import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowCard, StatusBadge, SectionHeader, DataDisplay } from '@/components/ui/custom-ui';
import { ConsentManager, RecordRegistry } from '@/lib/web3/contracts';
import { mockMedicalRecords, getRecordTypeLabel, getRecordTypeColor } from '@/lib/mock-data';
import { shortenAddress, generatePatientId } from '@/lib/web3/config';
import { Users, FileText, Hash, CheckCircle, Loader2, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function DoctorPatients() {
  const { address } = useAccount();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { data: consents, isLoading } = useQuery({
    queryKey: ['doctorConsents', address],
    queryFn: () => ConsentManager.getDoctorConsents(address || ''),
    enabled: !!address,
  });

  const { data: patientRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['patientRecords', selectedPatient],
    queryFn: () => RecordRegistry.getPatientRecords(selectedPatient || ''),
    enabled: !!selectedPatient,
  });

  const selectedConsent = consents?.find(c => c.patientAddress === selectedPatient);

  // Filter records by granted scopes
  const accessibleRecords = patientRecords?.filter(
    record => selectedConsent?.scopes.includes(record.recordType)
  );

  const handleVerify = async (recordId: string, hash: string) => {
    setVerifying(true);
    try {
      await RecordRegistry.verifyRecordHash(recordId, hash);
      toast({
        title: 'Record Verified',
        description: 'The record hash matches the on-chain data.',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Patients with Consent"
        description="View medical records for patients who have granted you access."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="space-y-3">
            {consents?.map((consent, i) => (
              <motion.div
                key={consent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  onClick={() => setSelectedPatient(consent.patientAddress)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedPatient === consent.patientAddress
                      ? 'border-secondary bg-secondary/10'
                      : 'border-border bg-card hover:border-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {generatePatientId(consent.patientAddress)}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          {shortenAddress(consent.patientAddress)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {consent.scopes.map(scope => (
                      <span
                        key={scope}
                        className={`px-2 py-0.5 rounded text-xs border ${getRecordTypeColor(scope)}`}
                      >
                        {getRecordTypeLabel(scope)}
                      </span>
                    ))}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Patient Records */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedPatient && selectedConsent ? (
                <motion.div
                  key={selectedPatient}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <GlowCard glowColor="secondary">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-display font-semibold text-lg">
                          Patient {generatePatientId(selectedPatient)}
                        </h3>
                        <p className="text-sm font-mono text-muted-foreground">
                          {shortenAddress(selectedPatient, 8)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPatient(null)}
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30 mb-6">
                      <p className="text-sm text-secondary font-medium mb-2">Granted Access Scopes</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedConsent.scopes.map(scope => (
                          <span
                            key={scope}
                            className={`px-3 py-1 rounded text-sm border ${getRecordTypeColor(scope)}`}
                          >
                            {getRecordTypeLabel(scope)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {loadingRecords ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Accessible Records ({accessibleRecords?.length || 0})
                        </h4>
                        {accessibleRecords?.map((record) => {
                          const offchainData = mockMedicalRecords[record.recordId];
                          return (
                            <div
                              key={record.recordId}
                              className="p-4 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-foreground">
                                      {offchainData?.title || record.recordId}
                                    </p>
                                    <StatusBadge status={record.verified ? 'verified' : 'pending'} />
                                  </div>
                                  <span className={`inline-block px-2 py-0.5 rounded text-xs border ${getRecordTypeColor(record.recordType)}`}>
                                    {getRecordTypeLabel(record.recordType)}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerify(record.recordId, record.hash)}
                                  disabled={verifying}
                                >
                                  {verifying ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Verify
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <Hash className="w-3 h-3" />
                                {shortenAddress(record.hash, 12)}
                              </div>
                              {offchainData && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {offchainData.summary}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </GlowCard>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground text-sm">Select a patient to view their records</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
