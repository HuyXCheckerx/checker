import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Settings, Bell, Palette, ShieldQuestion, Save } from 'lucide-react';

const SettingsPage = () => {
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved (Simulated)",
      description: "Your preferences have been updated.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const Section = ({ title, icon: Icon, children }) => (
    <motion.div variants={itemVariants} className="glassmorphism-deep rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
        <Icon className="w-6 h-6 mr-3" /> {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Application Settings</h1>
        <p className="text-muted-foreground">Customize your checker experience.</p>
      </motion.div>

      <Section title="Notifications" icon={Bell}>
        <div>
          <Label htmlFor="emailNotifications" className="text-base">Email Notifications for Hits</Label>
          <Input type="email" id="emailNotifications" placeholder="your_email@example.com" className="mt-2 bg-input/70 border-border/70" />
          <p className="text-xs text-muted-foreground mt-1">Receive an email when a valid account is found.</p>
        </div>
        <div>
          <Label htmlFor="telegramNotifications" className="text-base">Telegram Bot Token</Label>
          <Input type="text" id="telegramNotifications" placeholder="Enter your Telegram Bot Token" className="mt-2 bg-input/70 border-border/70" />
           <p className="text-xs text-muted-foreground mt-1">Connect your Telegram bot for instant notifications.</p>
        </div>
      </Section>

      <Section title="Appearance" icon={Palette}>
        <div>
          <Label className="text-base">Theme</Label>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" className="flex-1 border-primary/50 bg-primary/10 text-primary">Dark (Current)</Button>
            <Button variant="outline" className="flex-1" onClick={() => toast({title: "Theme Option", description: "Light theme coming soon!", duration: 3000})}>Light</Button>
            <Button variant="outline" className="flex-1" onClick={() => toast({title: "Theme Option", description: "System theme coming soon!", duration: 3000})}>System</Button>
          </div>
        </div>
      </Section>
      
      <Section title="Security & Privacy" icon={ShieldQuestion}>
         <div>
          <Label htmlFor="proxySettings" className="text-base">Proxy Settings (Optional)</Label>
          <Input type="text" id="proxySettings" placeholder="protocol://user:pass@host:port" className="mt-2 bg-input/70 border-border/70" />
           <p className="text-xs text-muted-foreground mt-1">Route checker traffic through a proxy. Supports HTTP/SOCKS.</p>
        </div>
        <div>
            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => toast({title: "Action Confirmation", description: "Local cache and logs cleared (simulated).", variant: "destructive", duration: 3000})}>
                Clear Local Cache & Logs
            </Button>
            <p className="text-xs text-muted-foreground mt-1">This will remove any stored combolists or results from your browser.</p>
        </div>
      </Section>

      <motion.div variants={itemVariants} className="flex justify-end mt-10">
        <Button size="lg" onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary-md text-base py-5 px-10">
          <Save className="w-5 h-5 mr-2.5" /> Save All Settings
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;