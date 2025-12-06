import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GlowCard, StatusBadge, SectionHeader } from '@/components/ui/custom-ui';
import { Billing, Invoice } from '@/lib/web3/contracts';
import { shortenAddress, generatePatientId } from '@/lib/web3/config';
import { Receipt, Plus, Loader2, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DoctorBilling() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientAddress, setPatientAddress] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['doctorInvoices', address],
    queryFn: () => Billing.getDoctorInvoices(address || ''),
    enabled: !!address,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      Billing.createInvoice(patientAddress, address || '', description, parseFloat(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorInvoices'] });
      toast({
        title: 'Invoice Created',
        description: 'The invoice has been created and recorded on-chain.',
      });
      setIsModalOpen(false);
      setPatientAddress('');
      setDescription('');
      setAmount('');
    },
  });

  const dueInvoices = invoices?.filter(i => i.status === 'DUE') || [];
  const paidInvoices = invoices?.filter(i => i.status === 'PAID') || [];
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = dueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Billing Management"
        description="Create and manage patient invoices. All payments are processed in USDC on Base."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlowCard>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-display font-bold text-primary">${totalRevenue}</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard glowColor="warning">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-warning/20">
              <Receipt className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-display font-bold text-warning">${pendingAmount}</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard glowColor="secondary">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/20">
              <Receipt className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-display font-bold text-secondary">{invoices?.length || 0}</p>
            </div>
          </div>
        </GlowCard>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending ({dueInvoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <InvoiceList invoices={invoices || []} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <InvoiceList invoices={dueInvoices} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="paid" className="space-y-4">
          <InvoiceList invoices={paidInvoices} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      {/* Create Invoice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Create Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice for a patient. The invoice will be recorded on-chain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="patientAddress">Patient Wallet Address</Label>
              <Input
                id="patientAddress"
                placeholder="0x..."
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., General Consultation, Lab Work, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              onClick={() => createMutation.mutate()}
              disabled={!patientAddress || !description || !amount || createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Receipt className="w-4 h-4 mr-2" />
              )}
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceList({ invoices, isLoading }: { invoices: Invoice[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GlowCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Invoice
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Patient
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/30"
              >
                <td className="py-3 px-4 text-sm font-mono">{invoice.id}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm">{generatePatientId(invoice.patientAddress)}</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {shortenAddress(invoice.patientAddress)}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm max-w-[200px] truncate">{invoice.description}</td>
                <td className="py-3 px-4 text-sm font-medium text-primary">${invoice.amount}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={invoice.status === 'DUE' ? 'due' : 'paid'} />
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlowCard>
  );
}
