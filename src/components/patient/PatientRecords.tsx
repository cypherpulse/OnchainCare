import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowCard, StatusBadge, SectionHeader, DataDisplay } from '@/components/ui/custom-ui';
import { RecordRegistry, MedicalRecordHash } from '@/lib/web3/contracts';
import { mockMedicalRecords, getRecordTypeLabel, getRecordTypeColor } from '@/lib/mock-data';
import { shortenAddress } from '@/lib/web3/config';
import { FileText, Hash, Calendar, CheckCircle, Loader2, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function PatientRecords() {
  const { address } = useAccount();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { data: records, isLoading } = useQuery({
    queryKey: ['patientRecords', address],
    queryFn: () => RecordRegistry.getPatientRecords(address || ''),
    enabled: !!address,
  });

  const handleVerify = async (recordId: string) => {
    setVerifying(true);
    try {
      const record = records?.find(r => r.recordId === recordId);
      if (record) {
        await RecordRegistry.verifyRecordHash(recordId, record.hash);
        toast({
          title: 'Record Verified',
          description: 'The record hash matches the on-chain data.',
        });
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Could not verify the record hash.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  const selectedRecordData = selectedRecord ? mockMedicalRecords[selectedRecord] : null;
  const selectedRecordHash = selectedRecord ? records?.find(r => r.recordId === selectedRecord) : null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Medical Records"
        description="View and verify your medical records. All data is verified against on-chain hashes."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Records List */}
          <div className="space-y-3">
            {records?.map((record, i) => {
              const offchainData = mockMedicalRecords[record.recordId];
              return (
                <motion.div
                  key={record.recordId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedRecord(record.recordId)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedRecord === record.recordId
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {offchainData?.title || record.recordId}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs border ${getRecordTypeColor(record.recordType)}`}>
                              {getRecordTypeLabel(record.recordType)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={record.verified ? 'verified' : 'pending'} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Hash className="w-3 h-3" />
                      {shortenAddress(record.hash, 8)}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Record Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedRecordData && selectedRecordHash && (
              <motion.div
                key={selectedRecord}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlowCard className="sticky top-24">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg">{selectedRecordData.title}</h3>
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="p-1 rounded hover:bg-muted/50 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <DataDisplay label="Doctor" value={selectedRecordData.doctor} />
                      <DataDisplay label="Department" value={selectedRecordData.department} />
                      <DataDisplay
                        label="Date"
                        value={new Date(selectedRecordData.date).toLocaleDateString()}
                      />
                      <DataDisplay label="Record ID" value={selectedRecordData.id} mono />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-sm text-foreground">{selectedRecordData.summary}</p>
                    </div>

                    {/* Record Details */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Details</p>
                      <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                        {Object.entries(selectedRecordData.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-mono text-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* On-chain Hash */}
                    <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">On-Chain Hash</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {selectedRecordHash.hash}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleVerify(selectedRecord!)}
                        disabled={verifying}
                        className="flex-1"
                      >
                        {verifying ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Verify Integrity
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Access
                      </Button>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedRecord && (
            <div className="hidden lg:flex items-center justify-center p-12 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground text-sm">Select a record to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
