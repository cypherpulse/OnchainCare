import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GlowCard, StatusBadge, SectionHeader, DataDisplay } from '@/components/ui/custom-ui';
import { Billing, Invoice, PaymentEvent } from '@/lib/web3/contracts';
import { shortenAddress } from '@/lib/web3/config';
import { CreditCard, DollarSign, Loader2, ExternalLink, Receipt, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PatientBilling() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ['patientInvoices', address],
    queryFn: () => Billing.getPatientInvoices(address || ''),
    enabled: !!address,
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['paymentHistory', address],
    queryFn: () => Billing.getPaymentHistory(address || ''),
    enabled: !!address,
  });

  const payMutation = useMutation({
    mutationFn: ({ invoiceId, amount }: { invoiceId: string; amount: number }) =>
      Billing.payInvoice(invoiceId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patientInvoices'] });
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      toast({
        title: 'Payment Successful',
        description: `Invoice ${variables.invoiceId} has been paid.`,
      });
      setPayingInvoice(null);
    },
  });

  const dueInvoices = invoices?.filter(i => i.status === 'DUE') || [];
  const paidInvoices = invoices?.filter(i => i.status === 'PAID') || [];
  const totalDue = dueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Billing & Payments"
        description="View invoices and make payments using USDC on Base."
      />

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <GlowCard glowColor="warning">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-warning/20">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="text-2xl font-display font-bold text-warning">${totalDue}</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
              <p className="text-2xl font-display font-bold text-foreground">{dueInvoices.length}</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard glowColor="secondary">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/20">
              <History className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid This Month</p>
              <p className="text-2xl font-display font-bold text-secondary">{paidInvoices.length}</p>
            </div>
          </div>
        </GlowCard>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {loadingInvoices ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {invoices?.map((invoice, i) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-foreground">{invoice.description}</p>
                        <StatusBadge status={invoice.status === 'DUE' ? 'due' : 'paid'} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono">{invoice.id}</span>
                        <span>•</span>
                        <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display font-bold text-foreground">
                        ${invoice.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">USDC</p>
                    </div>
                  </div>

                  {invoice.status === 'DUE' && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <Button
                        onClick={() => {
                          setPayingInvoice(invoice.id);
                          payMutation.mutate({ invoiceId: invoice.id, amount: invoice.amount });
                        }}
                        disabled={payMutation.isPending && payingInvoice === invoice.id}
                        className="w-full sm:w-auto"
                      >
                        {payMutation.isPending && payingInvoice === invoice.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        Pay with USDC
                      </Button>
                    </div>
                  )}

                  {invoice.status === 'PAID' && invoice.txHash && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Tx:</span>
                      <span className="font-mono text-primary">{shortenAddress(invoice.txHash, 8)}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loadingPayments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <GlowCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tx Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments?.map((payment) => (
                      <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 text-sm">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">{payment.invoiceId}</td>
                        <td className="py-3 px-4 text-sm font-medium text-primary">
                          ${payment.amount} USDC
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-muted-foreground">
                            {shortenAddress(payment.txHash, 6)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlowCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
