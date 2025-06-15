import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { X, Minus, Plus, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';

const ShoppingCartSheet = ({ isOpen, onOpenChange, items, onUpdateQuantity, onRemoveItem, onCheckout, totalAmount }) => {
  
  const itemVariants = {
    initial: { opacity: 0, x: -30, height: 0 },
    animate: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.3 } },
    exit: { opacity: 0, x: 30, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col glassmorphism p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-2xl font-bold text-primary flex items-center">
            <ShoppingBag className="w-7 h-7 mr-3" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-center py-10 text-lg"
              >
                Your cart is looking a bit lonely.
              </motion.p>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="flex items-center justify-between bg-card/70 p-4 rounded-lg shadow-md border border-border"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <img-replace 
                      src={item.image || "https://placehold.co/80x80/0A0A19/C0C0FF/png?text=Item&font=inter"} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-md object-cover mr-4 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground font-semibold text-base truncate" title={item.name}>{item.name}</h4>
                      <p className="text-primary text-sm font-bold">
                        {item.priceUnit === 'SOL' ? `${item.price.toFixed(1)} SOL` : `$${item.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className="text-base px-3 tabular-nums">{item.quantity}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                     <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {items.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-background/50">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-foreground">Total:</span>
                <span className="text-3xl font-black text-primary">${totalAmount.toFixed(2)}</span>
              </div>
              
              <Button
                onClick={onCheckout}
                size="lg"
                className="w-full text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-glow-primary"
                disabled={items.length === 0}
              >
                <CreditCard className="w-5 h-5 mr-2.5" />
                Proceed to Checkout
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCartSheet;