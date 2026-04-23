import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { LogIn } from 'lucide-react';

export default function AdminLayout({ isAdmin }: { isAdmin: boolean }) {
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch(err) {
      console.error("Login failed", err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-200 text-center max-w-lg w-full">
          <h2 className="text-3xl font-display font-bold mb-4 text-slate-900">Admin Access</h2>
          <p className="text-slate-600 mb-8">You must be logged in as an authorized administrator to view and edit this area.</p>
          <button 
            onClick={handleLogin} 
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#e67e22] text-white font-medium rounded-sm hover:bg-[#d35400] transition-colors"
          >
            <LogIn size={20} /> Log In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 text-slate-900">
        <aside className="w-full md:w-64 shrink-0">
          <h2 className="font-display text-2xl font-bold mb-6 text-slate-900">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link 
              to="/admin/articles" 
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${location.pathname.includes('/articles') ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              Manage Articles
            </Link>
            <Link 
              to="/admin/projects" 
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${location.pathname.includes('/projects') ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              Manage Projects
            </Link>
            <Link 
              to="/admin/hobbies" 
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${location.pathname.includes('/hobbies') ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              Manage Hobbies
            </Link>
          </nav>
        </aside>

        <main className="flex-grow bg-white p-8 rounded-sm shadow-sm border border-slate-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
