import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GlowCard, StatusBadge, SectionHeader, EmptyState } from '@/components/ui/custom-ui';
import { ConsentManager, ConsentRecord } from '@/lib/web3/contracts';
import { shortenAddress } from '@/lib/web3/config';
import { getRecordTypeLabel, getRecordTypeColor } from '@/lib/mock-data';
import { Shield, Plus, Loader2, UserX, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const RECORD_TYPES = ['LAB_RESULT', 'PRESCRIPTION', 'CONSULTATION', 'IMAGING', 'PROCEDURE'] as const;

export function PatientConsent() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorAddress, setDoctorAddress] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const { data: consents, isLoading } = useQuery({
    queryKey: ['patientConsents', address],
    queryFn: () => ConsentManager.getPatientConsents(address || ''),
    enabled: !!address,
  });

  const grantMutation = useMutation({
    mutationFn: () => ConsentManager.grantAccess(address || '', doctorAddress, selectedScopes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientConsents'] });
      toast({
        title: 'Access Granted',
        description: 'The doctor now has access to the selected records.',
      });
      setIsModalOpen(false);
      setDoctorAddress('');
      setSelectedScopes([]);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (consentId: string) => ConsentManager.revokeAccess(consentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientConsents'] });
      toast({
        title: 'Access Revoked',
        description: 'The consent has been revoked on-chain.',
      });
    },
  });

  const activeConsents = consents?.filter(c => !c.revoked) || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consent & Access Management"
        description="Control who has access to your medical records. All consents are recorded on-chain."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Consent
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeConsents.length === 0 ? (
        <EmptyState
          icon={<Shield className="w-8 h-8" />}
          title="No Active Consents"
          description="You haven't granted access to any doctors yet. Grant access to share your medical records securely."
          action={
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {activeConsents.map((consent, i) => (
            <motion.div
              key={consent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlowCard glowColor="secondary">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {consent.granteeName || 'Unknown Doctor'}
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {shortenAddress(consent.granteeAddress)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="granted" />
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Granted Scopes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {consent.scopes.map(scope => (
                      <span
                        key={scope}
                        className={`px-2 py-1 rounded text-xs border ${getRecordTypeColor(scope)}`}
                      >
                        {getRecordTypeLabel(scope)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Granted {new Date(consent.grantedAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeMutation.mutate(consent.id)}
                    disabled={revokeMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {revokeMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserX className="w-4 h-4 mr-2" />
                        Revoke
                      </>
                    )}
                  </Button>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Grant Access Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Grant Access</DialogTitle>
            <DialogDescription>
              Enter the doctor's wallet address and select the record types to share.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="doctorAddress">Doctor Wallet Address</Label>
              <Input
                id="doctorAddress"
                placeholder="0x..."
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label>Record Types to Share</Label>
              <div className="space-y-2">
                {RECORD_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={type}
                      checked={selectedScopes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedScopes([...selectedScopes, type]);
                        } else {
                          setSelectedScopes(selectedScopes.filter(s => s !== type));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="font-normal cursor-pointer">
                      {getRecordTypeLabel(type)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => grantMutation.mutate()}
              disabled={!doctorAddress || selectedScopes.length === 0 || grantMutation.isPending}
              className="w-full"
            >
              {grantMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Sign & Grant Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
