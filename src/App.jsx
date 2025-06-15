
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import SidebarNav from '@/components/SidebarNav';
import DashboardPage from '@/pages/DashboardPage';
import PaypalCheckerPage from '@/pages/PaypalCheckerPage';
import HotmailCheckerPage from '@/pages/HotmailCheckerPage';
import SmtpCheckerPage from '@/pages/SmtpCheckerPage';
import InboxSearcherPage from '@/pages/InboxSearcherPage';
import SeedPhraseScannerPage from '@/pages/SeedPhraseScannerPage';
import OpenBulletPage from '@/pages/OpenBulletPage';
import SettingsPage from '@/pages/SettingsPage'; 

const App = () => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, filter: 'blur(4px) saturate(150%)' },
    in: { opacity: 1, filter: 'blur(0px) saturate(100%)' },
    out: { opacity: 0, filter: 'blur(4px) saturate(150%)' }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.6
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <SidebarNav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-grow p-6 md:p-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <DashboardPage />
                </motion.div>
              } />
              <Route path="/paypal-checker" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <PaypalCheckerPage />
                </motion.div>
              } />
              <Route path="/hotmail-checker" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <HotmailCheckerPage />
                </motion.div>
              } />
              <Route path="/smtp-checker" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <SmtpCheckerPage />
                </motion.div>
              } />
              <Route path="/openbullet-simulator" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <OpenBulletPage />
                </motion.div>
              } />
              <Route path="/inbox-searcher" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <InboxSearcherPage />
                </motion.div>
              } />
              <Route path="/seedphrase-scanner" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <SeedPhraseScannerPage />
                </motion.div>
              } />
              <Route path="/settings" element={
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <SettingsPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
        <footer className="p-6 text-center text-xs text-muted-foreground border-t border-border/50">
          © {new Date().getFullYear()} Account Checker Deluxe. All operations are simulated.
        </footer>
      </main>
      <Toaster />
    </div>
  );
};

export default App;
