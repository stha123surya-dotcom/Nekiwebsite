import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ArrowRight, Plus, LogIn, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Hobbies({ isAdmin }: { isAdmin?: boolean }) {
  const [hobbies, setHobbies] = useState<any[]>([]);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'hobbies'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setHobbies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch(err) {
      console.error("Login failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteDoc(doc(db, 'hobbies', id));
      } catch (err) {
        console.error("Error deleting hobby", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Leisure Activities</h1>
          <p className="text-slate-600 max-w-xl">Exploring my leisure activities outside of architecture and master planning.</p>
        </div>
        <div className="flex gap-4 shrink-0">
          {isAdmin ? (
            <Link to="/admin/hobbies" className="flex items-center gap-2 px-4 py-2 bg-[#e67e22] text-white rounded-sm hover:bg-[#d35400] transition-colors font-medium text-sm">
              <Plus size={16} /> New Post
            </Link>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-sm hover:bg-slate-50 transition-colors font-medium text-sm">
              <LogIn size={16} /> Admin Login
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hobbies.length === 0 ? (
          <p className="text-slate-500 italic col-span-full">No leisure activities posted yet.</p>
        ) : (
          hobbies.map(hobby => (
            <article key={hobby.id} className="border border-slate-200 rounded-sm overflow-hidden flex flex-col hover:border-[#e67e22] transition-colors">
              {hobby.coverImage && (
                <div 
                  className="cursor-pointer relative group"
                  onClick={() => setFullScreenImage(hobby.coverImage)}
                >
                  <img src={hobby.coverImage} alt={hobby.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium tracking-wide bg-black/50 px-3 py-1 rounded-full">View Image</span>
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-slate-500 mb-2">
                  {hobby.createdAt ? new Date(hobby.createdAt.toDate ? hobby.createdAt.toDate() : hobby.createdAt).toLocaleDateString() : 'Draft'}
                </span>
                <h2 className="font-display text-xl font-bold mb-3">{hobby.title}</h2>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {hobby.content}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <button className="flex items-center gap-2 text-sm font-medium text-[#e67e22] hover:text-[#d35400] transition-colors">
                    Read More <ArrowRight size={16} />
                  </button>
                  
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Link 
                        to={`/admin/hobbies?edit=${hobby.id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-sm"
                        title="Edit Activity"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(hobby.id)}
                        className="bg-red-900/80 hover:bg-red-900 text-white p-2 rounded-sm"
                        title="Remove Activity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setFullScreenImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors z-[110]"
              onClick={() => setFullScreenImage(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={fullScreenImage} 
              alt="Fullscreen activity" 
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
