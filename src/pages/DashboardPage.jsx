import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle, AlertCircle, Clock, UploadCloud, Play } from 'lucide-react';

const DashboardPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const StatCard = ({ title, value, icon, color, unit }) => (
    <motion.div 
      variants={itemVariants}
      className="glassmorphism-deep rounded-xl p-6 flex items-center space-x-4 shadow-lg"
    >
      <div className={`p-3 rounded-lg bg-${color}/20 text-${color}`}>
        {React.createElement(icon, { className: "w-7 h-7" })}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">
          {value}
          {unit && <span className="text-lg ml-1 text-muted-foreground">{unit}</span>}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          <span className="text-glow bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-flow" style={{backgroundSize: '200% auto'}}>
            Account Checker
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Welcome to your advanced account validation dashboard.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Total Hits" value="0" icon={CheckCircle} color="primary" />
        <StatCard title="Total Fails" value="0" icon={AlertCircle} color="destructive" />
        <StatCard title="Custom Captures" value="0" icon={BarChart3} color="secondary" />
        <StatCard title="Avg. CPM" value="0" icon={Clock} color="accent" unit="cpm" />
      </motion.div>

      <motion.div variants={itemVariants} className="glassmorphism-deep rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-semibold text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "PayPal Checker", path: "/paypal-checker", icon: UploadCloud },
            { label: "Hotmail Checker", path: "/hotmail-checker", icon: UploadCloud },
            { label: "SMTP Checker", path: "/smtp-checker", icon: UploadCloud },
            { label: "Inbox Searcher", path: "/inbox-searcher", icon: Play },
            { label: "SeedPhrase Scanner", path: "/seedphrase-scanner", icon: Play },
          ].map(action => (
            <Button key={action.path} asChild size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200 group text-lg py-7">
              <Link to={action.path}>
                <action.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="glassmorphism-deep rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-semibold text-primary mb-6">Recent Activity</h2>
        <div className="text-center py-10">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse-subtle" />
          <p className="text-muted-foreground">No activity yet. Start a check to see your results here.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;