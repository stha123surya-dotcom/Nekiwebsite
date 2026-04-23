import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AdminHobbies() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editId) {
      getDoc(doc(db, 'hobbies', editId)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setCoverImage(data.coverImage || '');
        }
      });
    }
  }, [editId]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editId) {
        await updateDoc(doc(db, 'hobbies', editId), {
          title,
          content,
          coverImage,
        });
        setMessage('Leisure activity updated successfully!');
      } else {
        await addDoc(collection(db, 'hobbies'), {
          title,
          content,
          coverImage,
          createdAt: serverTimestamp()
        });
        setMessage('Leisure activity published successfully!');
        setTitle('');
        setContent('');
        setCoverImage('');
      }
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">{editId ? 'Edit Leisure Activity' : 'Publish New Leisure Activity'}</h3>
        {editId && (
          <button onClick={() => { navigate('/admin/hobbies'); setTitle(''); setContent(''); setCoverImage(''); }} className="px-4 py-2 border border-slate-300 rounded-sm text-sm hover:bg-slate-50">Cancel Edit</button>
        )}
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded-sm text-sm ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Title *</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Cover Image URL</label>
          <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Content *</label>
          <textarea required rows={10} value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] resize-none"></textarea>
        </div>
        <button disabled={loading} type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-[#e67e22] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : (editId ? 'Save Changes' : 'Publish Post')}
        </button>
      </form>
    </div>
  );
}
