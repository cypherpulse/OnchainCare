import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Hexagon, Shield, Database, FileCheck, Wallet, Activity, Lock, Zap, ChevronRight, ExternalLink } from 'lucide-react';

export function ConnectWalletPrompt() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Radial Gradient Overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />

      {/* Floating Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Navigation */}
      <nav className="relative z-20 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <Hexagon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">+</span>
                </div>
              </motion.div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">ONCHAIN</h1>
                <p className="text-[10px] text-primary font-medium tracking-[0.3em] -mt-1">HOSPITAL</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-medium">Base Network</span>
              </div>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">Connect</span>
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">Deployed on Base L2</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                <span className="text-glow">Secure</span> Medical Records on{' '}
                <span className="text-primary text-glow">Blockchain</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Patient-controlled, cryptographically verified health records. 
                Your data stays private while maintaining immutable audit trails on Base network.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openConnectModal}
                      className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)]"
                    >
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </ConnectButton.Custom>

                <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border bg-card/50 text-foreground font-medium hover:border-primary/50 hover:bg-card transition-all">
                  <ExternalLink className="w-4 h-4" />
                  View on BaseScan
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '100K+', label: 'Records Secured' },
                  { value: '50K+', label: 'Patients' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <p className="text-2xl sm:text-3xl font-display font-bold text-primary">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Central Hexagon */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Orbiting rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-8 border border-primary/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-16 border border-secondary/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-24 border border-primary/30 rounded-full"
                />

                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 40px hsl(var(--primary) / 0.3)',
                        '0 0 80px hsl(var(--primary) / 0.5)',
                        '0 0 40px hsl(var(--primary) / 0.3)',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-32 h-32 rounded-2xl bg-card border border-primary/50 flex items-center justify-center"
                  >
                    <Hexagon className="w-16 h-16 text-primary" strokeWidth={1} />
                  </motion.div>
                </div>

                {/* Floating feature icons */}
                {[
                  { icon: Shield, position: 'top-4 left-1/2 -translate-x-1/2', delay: 0 },
                  { icon: Database, position: 'right-4 top-1/2 -translate-y-1/2', delay: 0.5 },
                  { icon: Lock, position: 'bottom-4 left-1/2 -translate-x-1/2', delay: 1 },
                  { icon: Activity, position: 'left-4 top-1/2 -translate-y-1/2', delay: 1.5 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + item.delay, type: 'spring' }}
                    className={`absolute ${item.position}`}
                  >
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                      className="w-14 h-14 rounded-xl bg-card/80 backdrop-blur border border-border flex items-center justify-center"
                    >
                      <item.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powered by <span className="text-primary">Web3</span> Technology
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A hybrid on-chain/off-chain architecture that ensures privacy while maintaining 
              cryptographic proof of data integrity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Patient-Controlled Access',
                description: 'Grant and revoke data access permissions directly from your wallet. Every consent is recorded on-chain.',
                color: 'primary',
              },
              {
                icon: Database,
                title: 'On-Chain Verification',
                description: 'Record hashes stored on Base blockchain. Verify data integrity anytime without exposing sensitive information.',
                color: 'secondary',
              },
              {
                icon: FileCheck,
                title: 'Immutable Audit Trail',
                description: 'Every access event is permanently logged. Full transparency for regulatory compliance.',
                color: 'primary',
              },
              {
                icon: Lock,
                title: 'Privacy First',
                description: 'Actual medical data never touches the blockchain. Only cryptographic proofs are stored on-chain.',
                color: 'secondary',
              },
              {
                icon: Activity,
                title: 'Real-Time Monitoring',
                description: 'Track who accesses your records in real-time with instant notifications and detailed logs.',
                color: 'primary',
              },
              {
                icon: Zap,
                title: 'Instant Payments',
                description: 'Pay medical bills with USDC stablecoins. Fast, low-fee transactions on Base L2.',
                color: 'secondary',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 ${
                  feature.color === 'primary' 
                    ? 'border-border hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]' 
                    : 'border-border hover:border-secondary/50 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.1)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  feature.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'primary' ? 'text-primary' : 'text-secondary'
                  }`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/5 p-8 sm:p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Connect your wallet to access the secure medical records dashboard. 
                Available on Base mainnet and testnet.
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openConnectModal}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
                  >
                    <Wallet className="w-5 h-5" />
                    Launch App
                  </motion.button>
                )}
              </ConnectButton.Custom>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <span className="font-display text-sm text-muted-foreground">Onchain Hospital © 2024</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
