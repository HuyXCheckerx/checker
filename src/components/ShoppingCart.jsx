import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';

const ShoppingCart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const itemVariants = {
    initial: { opacity: 0, x: -30, height: 0 },
    animate: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: 30, height: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-effect rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex items-center mb-6">
        <ShoppingBag className="w-7 h-7 mr-3 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Your Cart</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar-cart">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-center py-10 text-lg"
            >
              Your cart is currently empty.
            </motion.p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="flex items-center justify-between bg-card/50 p-4 rounded-lg shadow-md"
                >
                  <div className="flex-1 mr-3">
                    <h4 className="text-foreground font-semibold text-base">{item.name}</h4>
                    <p className="text-primary text-sm font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className="text-base px-3">{item.quantity}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 p-0 ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {items.length > 0 && (
        <div className="mt-auto border-t border-border pt-6">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xl font-semibold text-foreground">Total:</span>
            <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
          </div>
          
          <Button
            onClick={onCheckout}
            size="lg"
            className="w-full text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-xl neon-glow-primary"
            disabled={items.length === 0}
          >
            <CreditCard className="w-5 h-5 mr-2.5" />
            Proceed to Checkout
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ShoppingCart;