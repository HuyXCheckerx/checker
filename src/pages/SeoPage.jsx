import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Zap } from 'lucide-react';

const SeoPage = ({ products, onAddToCart }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-12"
    >
      <motion.header variants={itemVariants} className="text-center space-y-4 py-8 glassmorphism rounded-xl shadow-lg">
        <Zap className="w-16 h-16 text-primary mx-auto animate-pulse-glow" />
        <h1 className="text-5xl font-extrabold tracking-tight text-glow-primary">SEO & Parsers</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock unparalleled data extraction capabilities with our high-performance, proxyless SEO tools and parsers.
        </p>
      </motion.header>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {products.map(product => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </motion.div>
      {products.length === 0 && (
        <motion.p variants={itemVariants} className="text-center text-muted-foreground text-lg py-10">
          No SEO & Parser products available at the moment. Check back soon!
        </motion.p>
      )}
    </motion.div>
  );
};

export default SeoPage;