import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { projects as seedProjects } from '../data';
import { setDoc } from 'firebase/firestore';

export default function AdminProjects() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editId) {
      getDoc(doc(db, 'projects', editId)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category);
          setDescription(data.description);
          setImage(data.image);
        }
      });
    }
  }, [editId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), { title, category, description, image });
        setMessage('Project updated successfully!');
      } else {
        await addDoc(collection(db, 'projects'), { title, category, description, image });
        setMessage('Project added successfully!');
        setTitle(''); setCategory(''); setDescription(''); setImage('');
      }
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  const seedDatabase = async () => {
    if(confirm('This will seed the database with initial projects from data.ts. Continue?')) {
      setLoading(true);
      for (const p of seedProjects) {
        await setDoc(doc(db, 'projects', 'proj_' + p.id), {
          title: p.title,
          category: p.category,
          description: p.description,
          image: p.image
        });
      }
      setMessage('Database seeded successfully!');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">{editId ? 'Edit Project' : 'Add New Project'}</h3>
        <div className="flex gap-2">
          {editId && (
            <button onClick={() => { navigate('/admin/projects'); setTitle(''); setCategory(''); setDescription(''); setImage(''); }} className="px-4 py-2 border border-slate-300 rounded-sm text-sm hover:bg-slate-50">Cancel Edit</button>
          )}
          <button onClick={seedDatabase} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-sm hover:bg-slate-200">
            Seed Initial Projects
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded-sm text-sm ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Title *</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
          <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" placeholder="e.g. Master Planning" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Image URL *</label>
          <input required type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
          <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] resize-none"></textarea>
        </div>
        <button disabled={loading} type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-[#e67e22] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : (editId ? 'Save Changes' : 'Add Project')}
        </button>
      </form>
    </div>
  );
}
