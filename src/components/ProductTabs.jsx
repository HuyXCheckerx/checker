import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { Shield, Zap, Cpu, Award } from 'lucide-react';

export const ProductTabs = ({ products, vouches, onAddToCart }) => {
  const tabCategories = [
    { value: 'blockchain', label: "Blockchain", icon: <Cpu className="w-5 h-5 mr-2" /> },
    { value: 'seo', label: "SEO", icon: <Zap className="w-5 h-5 mr-2" /> },
    { value: 'exploits', label: "Exploits", icon: <Shield className="w-5 h-5 mr-2" /> },
    { value: 'vouches', label: "Vouches", icon: <Award className="w-5 h-5 mr-2" /> }
  ];

  return (
    <Tabs defaultValue="blockchain" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 p-1.5 rounded-xl mb-10 shadow-xl shadow-primary/10">
        {tabCategories.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-muted-foreground data-[state=active]:text-primary-foreground data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 py-3 rounded-lg text-sm sm:text-base"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {['seo', 'blockchain', 'exploits'].map(category => (
        <TabsContent key={category} value={category} className="focus-visible:ring-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {products[category] && products[category].map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
            {(!products[category] || products[category].length === 0) && (
                <p className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground py-8">No products in this category yet.</p>
            )}
          </motion.div>
        </TabsContent>
      ))}

      <TabsContent value="vouches" className="focus-visible:ring-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {vouches.map((vouch, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="glassmorphism rounded-xl p-6 border border-primary/20 shadow-lg hover:shadow-primary/30 transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {vouch.icon}
                  <span className="text-primary font-semibold ml-2">{vouch.user}</span>
                </div>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < vouch.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}>&#9733;</span>
                  ))}
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed">{vouch.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};