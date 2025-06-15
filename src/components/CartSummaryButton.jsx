import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart as CartIcon } from 'lucide-react';

export const CartSummaryButton = ({ onCheckout, itemCount, totalAmount }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="fixed top-6 right-6 z-50"
  >
    <Button
      variant="outline"
      onClick={onCheckout}
      className="glassmorphism border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group py-3 px-5 rounded-lg shadow-md"
    >
      <CartIcon className="w-5 h-5 mr-2.5 text-primary group-hover:text-primary/80 transition-colors" />
      Cart ({itemCount})
      {totalAmount > 0 && (
        <Badge className="ml-2.5 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
          ${totalAmount.toFixed(2)}
        </Badge>
      )}
    </Button>
  </motion.div>
);