import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AppHeader = () => (
  <motion.header
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="text-center mb-12 md:mb-20"
  >
    <Link to="/">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-3 transition-all duration-300 hover:opacity-80">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-aurora" style={{backgroundSize: '200% auto'}}>
          CRYONER
        </span>
      </h1>
    </Link>
    <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
      by <span className="font-medium text-primary">@pillowware</span>
    </p>
    <p className="text-foreground/80 mt-4 max-w-3xl mx-auto text-lg md:text-xl">
      Elite Digital Arsenal: SEO Parsers, Solana Snipers, Database Exploits & 0-Day Intel.
    </p>
  </motion.header>
);