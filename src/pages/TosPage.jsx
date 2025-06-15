import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle } from 'lucide-react';

const TosPage = ({ terms }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-12 max-w-4xl mx-auto"
    >
      <header className="text-center space-y-4 py-8 glassmorphism rounded-xl shadow-lg">
        <FileText className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-5xl font-extrabold tracking-tight text-glow-primary">{terms.title}</h1>
        <p className="text-muted-foreground">Last Updated: {terms.lastUpdated}</p>
      </header>

      <motion.div 
        className="glassmorphism rounded-xl p-8 md:p-12 space-y-10 shadow-xl"
        variants={sectionVariants}
      >
        {terms.sections.map((section, idx) => (
          <motion.section 
            key={idx} 
            className="space-y-3"
            initial={{ opacity: 0, y:15 }}
            animate={{ opacity: 1, y:0, transition: { delay: idx * 0.15 } }}
          >
            <h2 className="text-3xl font-semibold text-primary border-b-2 border-primary/30 pb-2 mb-4 flex items-center">
              {section.heading === "Disclaimer" && <AlertTriangle className="w-7 h-7 mr-3 text-destructive" />}
              {section.heading}
            </h2>
            <ul className="list-disc list-outside space-y-2.5 text-foreground/90 pl-6 text-lg leading-relaxed">
              {section.points.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </motion.section>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TosPage;