import { motion } from 'framer-motion';
import { useRole } from '@/contexts/RoleContext';
import { User, Stethoscope, Hexagon } from 'lucide-react';

export function RoleSelectionModal() {
  const { setRole } = useRole();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Hexagon className="w-12 h-12 text-primary" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">+</span>
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">ONCHAIN HOSPITAL</h1>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Who are you?
            </h2>
            <p className="text-muted-foreground text-sm">
              Select your role to access the appropriate dashboard
            </p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('patient')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    Patient
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View records, manage consent, pay bills
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('doctor')}
              className="w-full p-6 rounded-lg border border-border bg-card hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Stethoscope className="w-7 h-7 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                    Doctor / Admin
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Access patient records, view logs, manage billing
                  </p>
                </div>
              </div>
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            This is a prototype. Role selection is for demo purposes only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
