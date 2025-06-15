import React from 'react';
import { motion } from 'framer-motion';
import UptimeBar from '@/components/UptimeBar';
import { serviceData } from '@/data/appData'; // Assuming serviceData is still relevant

export const AppFooter = () => (
  <motion.footer 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="mt-24 py-12 border-t border-border/50 glassmorphism rounded-t-xl"
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">CRYONER</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Providing elite digital tools for SEO, blockchain, and security professionals.
            Engineered by <span className="text-primary font-medium">@pillowware</span>.
          </p>
        </div>
        <div className="md:pl-8">
           <UptimeBar services={serviceData} />
        </div>
      </div>
      <div className="text-center mt-10 pt-8 border-t border-border/30">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} CRYONER by @pillowware. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          All tools are provided for educational and research purposes only. Use responsibly.
        </p>
      </div>
    </div>
  </motion.footer>
);