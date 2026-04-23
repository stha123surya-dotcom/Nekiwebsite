import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ArrowRight, Plus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hobbies({ isAdmin }: { isAdmin?: boolean }) {
  const [hobbies, setHobbies] = useState<any[]>([]);

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

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Hobbies & Interests</h1>
          <p className="text-slate-600 max-w-xl">Exploring my passions outside of architecture and master planning.</p>
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
          <p className="text-slate-500 italic col-span-full">No hobbies posted yet.</p>
        ) : (
          hobbies.map(hobby => (
            <article key={hobby.id} className="border border-slate-200 rounded-sm overflow-hidden flex flex-col hover:border-[#e67e22] transition-colors">
              {hobby.coverImage && (
                <img src={hobby.coverImage} alt={hobby.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-slate-500 mb-2">
                  {new Date(hobby.createdAt).toLocaleDateString()}
                </span>
                <h2 className="font-display text-xl font-bold mb-3">{hobby.title}</h2>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {hobby.content}
                </p>
                <button className="flex items-center gap-2 text-sm font-medium text-[#e67e22] hover:text-[#d35400] transition-colors mt-auto">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
