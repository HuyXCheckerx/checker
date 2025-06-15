import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Cpu, ShieldCheck } from 'lucide-react';

const HomePage = ({ onAddToCart, products }) => {
  const featuredProducts = [
    products.blockchain[0], 
    products.seo[0],
    products.exploits[0]
  ].filter(Boolean); // Filter out undefined if categories are empty

  const heroVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const ctaButtonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 15px hsl(var(--primary))" },
    tap: { scale: 0.95 }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.6 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-24">
      <motion.section
        variants={heroVariants}
        initial="initial"
        animate="animate"
        className="text-center py-20 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 animate-aurora bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-secondary to-accent"></div>
        <div className="relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.6 } }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              CRYONER
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }}
          >
            Elite Digital Arsenal: SEO Parsers, Solana Snipers, Database Exploits & 0-Day Intel.
            <br className="hidden md:block" />
            Engineered by <span className="text-primary font-semibold">@pillowware</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6 } }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <motion.div variants={ctaButtonVariants} whileHover="hover" whileTap="tap">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-glow-primary">
                <Link to="/blockchain">
                  Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={ctaButtonVariants} whileHover="hover" whileTap="tap">
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10 hover:text-primary rounded-lg">
                <Link to="/vouches">
                  See Vouches
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        <h2 className="text-4xl font-bold text-center tracking-tight">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        className="py-16 glassmorphism rounded-xl"
      >
        <h2 className="text-4xl font-bold text-center tracking-tight mb-12">Our Specializations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto px-4">
          {[
            { title: "SEO & Parsers", icon: <Zap className="w-12 h-12 text-primary mb-4" />, desc: "High-performance, proxyless solutions for Google SERP and web data extraction.", link: "/seo" },
            { title: "Blockchain Tools", icon: <Cpu className="w-12 h-12 text-secondary mb-4" />, desc: "Cutting-edge Solana mempool snipers and advanced blockchain utilities.", link: "/blockchain" },
            { title: "Exploits & 0-Days", icon: <ShieldCheck className="w-12 h-12 text-accent mb-4" />, desc: "Exclusive database exploits, 0-day intelligence, and security research tools.", link: "/exploits" },
          ].map(spec => (
            <motion.div 
              key={spec.title} 
              variants={cardVariants}
              className="flex flex-col items-center text-center p-6 bg-card/50 rounded-lg shadow-lg hover:shadow-primary/20 transition-shadow"
            >
              {spec.icon}
              <h3 className="text-2xl font-semibold mb-3">{spec.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{spec.desc}</p>
              <Button asChild variant="link" className="text-primary hover:text-primary/80">
                <Link to={spec.link}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;