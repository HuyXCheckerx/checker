import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';

const VouchesPage = ({ vouches }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const vouchCardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { y: -5, boxShadow: "0 10px 20px hsl(var(--primary)/0.2)" }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-12"
    >
      <header className="text-center space-y-4 py-8 glassmorphism rounded-xl shadow-lg">
        <Award className="w-16 h-16 text-yellow-400 mx-auto" />
        <h1 className="text-5xl font-extrabold tracking-tight" style={{textShadow: '0 0 8px hsl(50 100% 50% / 0.7), 0 0 16px hsl(50 100% 50% / 0.5)'}}>Client Vouches</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Hear what our satisfied clients have to say about Cryoner's cutting-edge solutions.
        </p>
      </header>

      {vouches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vouches.map((vouch, index) => (
            <motion.div
              key={index}
              variants={vouchCardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="glassmorphism rounded-xl p-6 border border-primary/20 shadow-lg flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {vouch.icon}
                  <span className="text-primary font-semibold ml-2 text-lg">{vouch.user}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < vouch.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                  ))}
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed flex-grow">{vouch.text}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          No vouches available yet. Be the first to share your success!
        </p>
      )}
    </motion.div>
  );
};

export default VouchesPage;