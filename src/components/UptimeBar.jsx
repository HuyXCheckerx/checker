import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ServerOff as ServerIcon } from 'lucide-react';

const UptimeBar = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="glassmorphism rounded-xl p-6 text-center">
        <ServerIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Service Uptime</h3>
        <p className="text-muted-foreground">Uptime data currently unavailable.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glassmorphism rounded-xl p-6"
    >
      <div className="flex items-center mb-5">
        <ServerIcon className="w-6 h-6 mr-3 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Service Status</h3>
      </div>
      <div className="space-y-4">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-muted-foreground flex-1 truncate pr-2" title={service.name}>{service.name}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2.5 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    service.uptime >= 99.9 ? 'bg-green-500' : 
                    service.uptime >= 99 ? 'bg-yellow-400' : 'bg-destructive'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${service.uptime}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.4, ease: "circOut" }}
                />
              </div>
              <Badge 
                variant={service.uptime >= 99.9 ? 'success' : service.uptime >= 99 ? 'warning' : 'destructive'}
                className="min-w-[65px] text-xs flex items-center justify-center px-2 py-0.5"
              >
                {service.uptime >= 99.9 ? <CheckCircle className="w-3 h-3 mr-1"/> : <AlertTriangle className="w-3 h-3 mr-1" />}
                {service.uptime}%
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UptimeBar;