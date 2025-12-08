import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/web3/config';
import { RoleProvider } from '@/contexts/RoleContext';
import '@rainbow-me/rainbowkit/styles.css';

import Index from "./pages/Index";
import Records from "./pages/Records";
import Consent from "./pages/Consent";
import Billing from "./pages/Billing";
import Patients from "./pages/Patients";
import AccessLogs from "./pages/AccessLogs";
import BillingManage from "./pages/BillingManage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
   
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: 'hsl(142 71% 45%)',
          accentColorForeground: 'hsl(222 47% 3%)',
          borderRadius: 'medium',
        })}
      >
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/records" element={<Records />} />
                <Route path="/consent" element={<Consent />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/access-logs" element={<AccessLogs />} />
                <Route path="/billing-manage" element={<BillingManage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RoleProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
