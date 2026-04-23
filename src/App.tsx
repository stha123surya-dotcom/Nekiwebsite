import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import AdminLayout from './components/AdminLayout';
import AdminArticles from './pages/AdminArticles';
import AdminProjects from './pages/AdminProjects';
import Navigation from './components/Navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && (user.email === 'stha123surya@gmail.com' || user.email === 'neki123nki@gmail.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthChecking(false);
    });
    return unsub;
  }, []);

  if (authChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <HashRouter>
      <Navigation isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route path="/articles" element={<Articles isAdmin={isAdmin} />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout isAdmin={isAdmin} />}>
          <Route path="articles" element={<AdminArticles />} />
          <Route path="projects" element={<AdminProjects />} />
        </Route>
      </Routes>
      
      {/* Floating WhatsApp Action Button */}
      <a 
        href="https://wa.me/9779841737795" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out group-hover:ml-3 font-medium">Chat with us</span>
      </a>
    </HashRouter>
  );
}
