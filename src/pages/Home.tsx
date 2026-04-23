import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, ArrowRight, ChevronRight, X, Edit, Trash2 } from 'lucide-react';
import { categories, experience } from '../data';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useLocation } from 'react-router-dom';

export default function Home({ isAdmin }: { isAdmin: boolean }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [projectsList, setProjectsList] = useState<any[]>([]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjectsList(fetched);
    });
    return unsub;
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:neki123mlo@gmail.com?subject=${encodeURIComponent(contactForm.subject || 'Consultation Request')}&body=${encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`)}`;
    window.location.href = mailtoLink;
    setIsContactModalOpen(false);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  useEffect(() => {
    if (selectedProject || isContactModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject, isContactModalOpen]);

  useEffect(() => {
    // We removed scroll logic for nav
  }, []);

  const filteredProjects = projectsList.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#e67e22] selection:text-white pt-24">

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-block mb-4 px-3 py-1 border border-slate-200 text-xs font-semibold tracking-widest uppercase text-slate-500 rounded-full">
              Structural Minimalism
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-slate-900">
              Designing <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Enduring</span> <br/>
              Structures.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg font-light leading-relaxed">
              Senior Architect & M.Sc. Construction Management expert. Bridging the gap between visionary design and structural integrity.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="flex items-center gap-2 px-6 py-3 bg-[#e67e22] text-white font-medium rounded-sm hover:bg-[#d35400] transition-colors">
                View Project Vault <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] md:h-[600px] w-full"
          >
            <div className="absolute inset-0 bg-slate-100 rounded-sm overflow-hidden">
              <img 
                src="https://github.com/stha123surya-dotcom/website-practice/blob/main/Images/Interior101.png?raw=true" 
                alt="Architectural Structure" 
                className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Architectural Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            </div>
            {/* Accent Box */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-l-4 border-b-4 border-[#e67e22] pointer-events-none hidden md:block"></div>
          </motion.div>
        </div>
      </section>

      {/* Credentials & Bio */}
      <section id="about" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Credentials &<br/>Expertise</h2>
              <div className="w-12 h-1 bg-[#e67e22] mb-8"></div>
              <p className="text-slate-600 leading-relaxed mb-6">
                With a dual career path as a Senior Architect and Academic Lecturer, I bring over 15 years of rigorous professional experience to every project, ensuring both aesthetic brilliance and structural soundness.
              </p>
            </div>
            
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-8">
              {/* Education */}
              <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
                <h3 className="font-display font-semibold text-xl mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm">01</span>
                  Education
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900">M.Sc. Construction Management</h4>
                    <p className="text-sm text-slate-500 mt-1">IOE, Pulchowk Campus • 79%</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">B.Arch</h4>
                    <p className="text-sm text-slate-500 mt-1">IOE, Pulchowk Campus • 79.68%</p>
                  </div>
                </div>
              </div>

              {/* Memberships */}
              <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
                <h3 className="font-display font-semibold text-xl mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm">02</span>
                  Memberships
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="text-[#e67e22] mt-0.5 shrink-0" size={18} />
                    <span className="text-slate-700">Nepal Engineering Council (NEC) - 'A' Class</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="text-[#e67e22] mt-0.5 shrink-0" size={18} />
                    <span className="text-slate-700">Society of Nepalese Architects (SONA)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="text-[#e67e22] mt-0.5 shrink-0" size={18} />
                    <span className="text-slate-700">Nepal Engineers' Association (NEA)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Professional Narrative</h2>
            <p className="text-slate-400">15+ Years of Architectural Excellence</p>
          </div>

          <div className="relative border-l border-slate-700 ml-4 md:ml-0 md:pl-0">
            {experience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="mb-12 relative pl-8 md:pl-0"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] top-1 w-2.5 h-2.5 bg-[#e67e22] rounded-full ring-4 ring-slate-900"></div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
                  <span className="text-xs font-mono text-[#e67e22] tracking-widest uppercase mb-2 block">{exp.period}</span>
                  <h3 className="font-display text-xl font-semibold mb-1">{exp.role}</h3>
                  <h4 className="text-slate-400 font-medium mb-3">{exp.company}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Vault */}
      <section id="projects" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Project Vault</h2>
              <p className="text-slate-600 max-w-xl">A curated selection of projects spanning various expertise pillars.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  value={searchQuery}
                  placeholder="Search projects..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] transition-colors"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${
                  activeCategory === category 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Masonry Grid Simulation */}
          {projectsList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">Loading projects...</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative overflow-hidden bg-slate-100 rounded-sm aspect-[4/3] cursor-pointer"
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-[#e67e22] text-xs font-semibold tracking-wider uppercase mb-2 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {project.category}
                    </span>
                    <h3 className="text-white font-display text-xl font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      {project.description}
                    </p>
                    {isAdmin && (
                      <div className="mt-4 flex gap-2">
                        <Link 
                          to={`/admin/projects?edit=${project.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-sm"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          className="bg-red-900/80 hover:bg-red-900 text-white p-2 rounded-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </div>
      </section>

      {/* Contact Footer */}
      <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12 border-t-4 border-[#e67e22]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">Let's Build<br/>Something Enduring.</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Available for consultations, master planning, and architectural design projects.
              </p>
              <button onClick={() => setIsContactModalOpen(true)} className="inline-flex items-center gap-2 w-max px-8 py-4 bg-[#e67e22] text-white font-medium rounded-sm hover:bg-[#d35400] transition-colors">
                Request Consultation <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="space-y-8 md:pl-12 md:border-l border-slate-800">
              <div>
                <h3 className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <a href="mailto:neki123mlo@gmail.com" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[#e67e22]" />
                    </div>
                    neki123mlo@gmail.com
                  </a>
                  <a href="tel:+9779841737795" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-[#e67e22]" />
                    </div>
                    +977-9841737795
                  </a>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-[#e67e22]" />
                    </div>
                    Ikha-Lakhu-19, Lalitpur, Nepal
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Neki Chipalu. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/neki-chipalu-16368b401/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://www.facebook.com/neki123" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/95 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white text-slate-900 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Close project"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-2/3 h-[40vh] md:h-auto min-h-[300px] md:min-h-[600px] relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col bg-white overflow-y-auto">
                <span className="text-[#e67e22] text-xs font-semibold tracking-wider uppercase mb-3 block">
                  {selectedProject.category}
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight text-slate-900">
                  {selectedProject.title}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                  {selectedProject.description}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-sm hover:bg-[#e67e22] transition-colors"
                  >
                    Close Project
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/95 backdrop-blur-sm"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-white text-slate-900 rounded-sm shadow-2xl p-8"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-display text-2xl font-bold mb-2">Request Consultation</h3>
              <p className="text-slate-500 text-sm mb-6">Fill out the form below and it will open your default email client to send your message instantly.</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Name</label>
                  <input required type="text" value={contactForm.name} onChange={e => setContactForm(c => ({...c, name: e.target.value}))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                  <input required type="email" value={contactForm.email} onChange={e => setContactForm(c => ({...c, email: e.target.value}))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                  <input required type="text" value={contactForm.subject} onChange={e => setContactForm(c => ({...c, subject: e.target.value}))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22]" placeholder="Project Inquiry" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Message</label>
                  <textarea required rows={4} value={contactForm.message} onChange={e => setContactForm(c => ({...c, message: e.target.value}))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] resize-none" placeholder="Tell me about your project..."></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-3 bg-[#e67e22] text-white text-sm font-medium rounded-sm hover:bg-[#d35400] transition-colors flex items-center justify-center gap-2">
                    Send Email <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}