import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import AdminLayout from './components/AdminLayout';
import AdminArticles from './pages/AdminArticles';
import AdminProjects from './pages/AdminProjects';
import AdminHobbies from './pages/AdminHobbies';
import Navigation from './components/Navigation';
import Hobbies from './pages/Hobbies';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { MessageCircle } from 'lucide-react';

function GlobalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <p className="font-medium text-slate-300">
            &copy; {year} Surya Man Shrestha. All Rights Reserved.
          </p>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> Designed and created by Surya Man Shrestha. All content, aesthetics, and architectural materials presented on this website are the intellectual property of the webpage owner and are protected by copyright laws. Unauthorized reproduction is strictly prohibited.
          </p>
        </div>
        <div className="flex gap-6 shrink-0 mt-4 md:mt-0">
          <a href="https://www.linkedin.com/in/neki-chipalu-16368b401/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e67e22] transition-colors">LinkedIn</a>
          <a href="https://www.facebook.com/neki123" target="_blank" rel="noopener noreferrer" className="hover:text-[#e67e22] transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
}

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
    <div className="min-h-screen flex flex-col w-full selection:bg-[#e67e22] selection:text-white">
      <HashRouter>
        <Navigation isAdmin={isAdmin} />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/articles" element={<Articles isAdmin={isAdmin} />} />
            <Route path="/hobbies" element={<Hobbies isAdmin={isAdmin} />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout isAdmin={isAdmin} />}>
              <Route path="articles" element={<AdminArticles />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="hobbies" element={<AdminHobbies />} />
            </Route>
          </Routes>
        </main>
        
        <GlobalFooter />
        
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
    </div>
  );
}
