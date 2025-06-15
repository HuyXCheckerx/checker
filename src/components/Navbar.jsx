import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Menu, X, Zap, Cpu, ShieldCheck, FileText, Home, Award } from 'lucide-react';

const navLinks = [
  { to: '/', text: 'Home', icon: <Home className="w-4 h-4" /> },
  { to: '/seo', text: 'SEO & Parsers', icon: <Zap className="w-4 h-4" /> },
  { to: '/blockchain', text: 'Blockchain Tools', icon: <Cpu className="w-4 h-4" /> },
  { to: '/exploits', text: 'Exploits & 0-Days', icon: <ShieldCheck className="w-4 h-4" /> },
  { to: '/vouches', text: 'Vouches', icon: <Award className="w-4 h-4" /> },
  { to: '/tos', text: 'TOS', icon: <FileText className="w-4 h-4" /> },
];

export const Navbar = ({ onCartClick, cartItemCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavItem = ({ to, text, icon, exact = false }) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out group
         ${isActive 
           ? 'text-primary text-glow-primary' 
           : 'text-muted-foreground hover:text-foreground'
         }`
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left data-[active=true]:scale-x-100"></span>
    </NavLink>
  );
  
  const MobileNavItem = ({ to, text, icon, exact = false }) => (
    <NavLink
      to={to}
      end={exact}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
         ${isActive 
           ? 'bg-primary/10 text-primary' 
           : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
         }`
      }
    >
      {icon && <span className="mr-3">{icon}</span>}
      {text}
    </NavLink>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-background/80 backdrop-blur-lg shadow-xl shadow-primary/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="mr-3">
              <img-replace src="/logo.svg" alt="Cryoner Logo" className="h-10 w-auto" />
            </motion.div>
            <span className="text-3xl font-extrabold tracking-tight text-glow-primary">
              CRYONER
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => <NavItem key={link.to} {...link} exact={link.to === '/'} />)}
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="mr-2 text-muted-foreground hover:text-primary relative"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-muted-foreground hover:text-primary">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-background/95 backdrop-blur-md shadow-lg absolute top-full left-0 right-0 pb-4"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => <MobileNavItem key={link.to} {...link} exact={link.to === '/'} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};