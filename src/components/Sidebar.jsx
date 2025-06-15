import React from 'react';
import { motion } from 'framer-motion';
import ShoppingCartSheet from '@/components/ShoppingCartSheet'; // Assuming this is the new cart component
import UptimeBar from '@/components/UptimeBar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Sidebar = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, services, onShowTos, totalAmount, isCartOpen, setIsCartOpen }) => (
  <aside className="lg:col-span-4 space-y-8 hidden lg:block"> {/* Hide on smaller screens, main layout handles cart button */}
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      {/* ShoppingCartSheet is now a global component, this sidebar might be for other info or removed */}
      {/* If you still want a cart summary here, you'd need a different component than the Sheet */}
      <div className="glassmorphism rounded-xl p-6 border border-primary/20 shadow-lg">
        <h3 className="text-2xl font-bold text-primary mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0"><Link to="/vouches">Client Vouches</Link></Button></li>
          <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0"><Link to="/tos">Terms of Service</Link></Button></li>
        </ul>
      </div>
    </motion.div>
    
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
      <UptimeBar services={services} />
    </motion.div>

    {/* TOS button might be redundant if linked above, or could be styled differently */}
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
      <div className="glassmorphism rounded-xl p-6 border border-primary/20 shadow-lg">
        <h3 className="text-2xl font-bold text-primary mb-3">Support</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Need help? Contact @pillowware on Telegram for support.
        </p>
        <Button 
          onClick={() => window.open('https://t.me/pillowware', '_blank')} 
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground transition-all shadow-glow-primary"
        >
          Contact Support
        </Button>
      </div>
    </motion.div>
  </aside>
);