import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Cpu, ShieldCheck, Star } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const cardVariants = {
    rest: { scale: 1, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" },
    hover: { 
      scale: 1.03,
      boxShadow: `0px 10px 25px ${
        product.category === 'seo' ? 'hsl(var(--primary)/0.3)' : 
        product.category === 'blockchain' ? 'hsl(var(--secondary)/0.3)' : 
        'hsl(var(--accent)/0.3)'
      }`,
      transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 15 }
    }
  };

  const getCategoryStyles = () => {
    switch (product.category) {
      case 'seo':
        return { icon: <Zap className="w-5 h-5 mr-2 text-primary" />, color: 'primary', glow: 'shadow-glow-primary' };
      case 'blockchain':
        return { icon: <Cpu className="w-5 h-5 mr-2 text-secondary" />, color: 'secondary', glow: 'shadow-glow-secondary' };
      case 'exploits':
        return { icon: <ShieldCheck className="w-5 h-5 mr-2 text-accent" />, color: 'accent', glow: 'shadow-glow-accent' };
      default:
        return { icon: null, color: 'muted', glow: '' };
    }
  };

  const categoryStyles = getCategoryStyles();
  const priceDisplay = product.priceUnit === 'SOL' 
    ? `${product.price.toFixed(1)} SOL` 
    : `$${product.price.toFixed(2)}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="glassmorphism rounded-xl p-6 flex flex-col justify-between overflow-hidden border border-transparent hover:border-current"
      style={{color: `hsl(var(--${categoryStyles.color}))`}}
    >
      <div>
        <div className="relative mb-5 h-52 w-full overflow-hidden rounded-lg shadow-inner-strong">
          <img-replace
            src={product.image || "https://placehold.co/600x400/0A0A19/C0C0FF/png?text=Cryoner+Tool&font=inter"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          {product.status && (
            <Badge 
              className={`absolute top-3 right-3 shadow-lg bg-${categoryStyles.color}/80 text-${categoryStyles.color}-foreground border-${categoryStyles.color}/50`}
            >
              {product.status}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mb-1">
          {categoryStyles.icon}
          <h3 className={`text-2xl font-bold text-foreground`}>{product.name}</h3>
        </div>
        {product.rating && (
          <div className="flex items-center mb-2">
            {[...Array(Math.floor(product.rating))].map((_, i) => <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />)}
            {product.rating % 1 !== 0 && <Star key="half" className="w-4 h-4 fill-current text-yellow-400 opacity-50" />} 
            {[...Array(5 - Math.ceil(product.rating))].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />)}
            <span className="ml-2 text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
          </div>
        )}
        <p className="text-muted-foreground text-sm mb-4 h-20 overflow-y-auto custom-scrollbar">{product.description}</p>
      </div>

      <div className="mt-auto">
        <div className={`text-4xl font-black mb-5 text-${categoryStyles.color}`}>
          {priceDisplay}
        </div>
        
        <Button
          onClick={() => onAddToCart(product)}
          size="lg"
          className={`w-full text-lg font-semibold bg-${categoryStyles.color} hover:bg-${categoryStyles.color}/90 text-${categoryStyles.color}-foreground transition-all duration-300 transform hover:scale-105 ${categoryStyles.glow}`}
        >
          <ShoppingCart className="w-5 h-5 mr-2.5" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;