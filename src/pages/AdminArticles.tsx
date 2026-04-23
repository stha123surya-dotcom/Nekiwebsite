import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminArticles() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'articles'), {
        title,
        content,
        coverImage,
        createdAt: serverTimestamp()
      });
      setMessage('Article published successfully!');
      setTitle('');
      setContent('');
      setCoverImage('');
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Publish New Article</h3>
      
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
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}
