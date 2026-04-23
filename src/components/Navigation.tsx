import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Navigation({ isAdmin }: { isAdmin: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch(err) {
      console.error("Login failed", err);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-[#2c3e50]/90 backdrop-blur-md shadow-sm py-4' : 'bg-[#2c3e50]/80 backdrop-blur-sm py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            <img 
              src="https://github.com/stha123surya-dotcom/website-practice/blob/main/Images/1bg-1.png?raw=true" 
              alt="Neki Logo" 
              className="h-12 md:h-16 -my-2 md:-my-3 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(71%) saturate(1004%) hue-rotate(352deg) brightness(92%) contrast(91%)' }}
            />
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-200 hover:text-[#e67e22] transition-colors">Home</Link>
            <Link to="/#projects" className="text-sm font-medium text-slate-200 hover:text-[#e67e22] transition-colors">Project Vault</Link>
            <Link to="/articles" className="text-sm font-medium text-slate-200 hover:text-[#e67e22] transition-colors">Articles</Link>
            <Link to="/hobbies" className="text-sm font-medium text-slate-200 hover:text-[#e67e22] transition-colors">Leisure Activities</Link>
            
            {isAdmin && (
              <Link to="/admin/articles" className="text-sm font-bold text-white border-b-2 border-[#e67e22]">Admin</Link>
            )}

            {!isAdmin && location.pathname === '/admin' && (
              <button onClick={handleLogin} className="text-sm font-bold text-[#e67e22]">Admin Login</button>
            )}
            {isAdmin && (
              <button onClick={() => signOut(auth)} className="text-sm font-bold text-red-400">Logout</button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6"
          >
            <div className="flex flex-col space-y-6 text-lg font-display font-medium">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Home</Link>
              <Link to="/#projects" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Project Vault</Link>
              <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Articles</Link>
              <Link to="/hobbies" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Leisure Activities</Link>
              {isAdmin && (
                <Link to="/admin/articles" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4 text-[#e67e22]">Admin</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
