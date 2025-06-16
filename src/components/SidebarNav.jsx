
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShieldCheck, Mail, Server, Search, KeyRound, Settings, Bot, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/paypal-checker', label: 'Palhitter', icon: ShieldCheck },
  { path: '/hotmail-checker', label: 'Veralium Hotmail', icon: Mail },
  { path: '/smtp-checker', label: 'SMTP Checker', icon: Server },
  { path: '/openbullet-simulator', label: 'Openpillow', icon: Bot },
  { type: 'divider', label: 'Tools' },
  { path: '/inbox-searcher', label: 'Inbox Searcher', icon: Search },
  { path: '/seedphrase-scanner', label: 'cloud seed scanner', icon: KeyRound },
  { type: 'divider', label: 'System' },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const SidebarNav = () => {
  const location = useLocation();

  const sidebarVariants = {
    open: { width: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.1 } }
  };
  
  const iconVariants = {
    open: { rotate: 0 },
    closed: { rotate: 0 } 
  };

  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      className="bg-card border-r border-border/50 flex flex-col h-screen sticky top-0 shadow-xl z-50"
    >
      <div className={`flex items-center ${isOpen ? 'p-6 justify-between' : 'p-6 justify-center'}`}>
        {isOpen && (
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-primary tracking-tight">Pillow<span className="text-accent">Multitool</span></motion.h1>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
          <motion.div variants={iconVariants} animate={isOpen ? "open" : "closed"}>
            <Home className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => (
          item.type === 'divider' ? (
            <motion.div key={`divider-${index}`} variants={itemVariants} className="pt-3 pb-1">
              {isOpen && <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-3">{item.label}</span>}
              {!isOpen && <hr className="border-border/50 my-2 mx-auto w-10/12" />}
            </motion.div>
          ) : (
            <NavLink key={item.path} to={item.path} className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg transition-colors duration-150 group",
                isActive ? "bg-primary/15 text-primary shadow-glow-primary-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isOpen ? "px-4 py-2.5" : "justify-center p-3"
              )
            }>
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isOpen ? "mr-3" : "mr-0")} />
              {isOpen && <motion.span variants={itemVariants} className="text-sm font-medium">{item.label}</motion.span>}
              {!isOpen && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-card border border-border text-xs text-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        ))}
      </nav>

      <motion.div variants={itemVariants} className={`border-t border-border/50 ${isOpen ? 'p-4' : 'p-3'}`}>
        {isOpen ? (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Horizons Co.</p>
            <p className="text-xs text-muted-foreground">All simulations.</p>
          </div>
        ) : (
          <div className="w-full h-8 bg-muted rounded-sm animate-pulse"></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SidebarNav;
