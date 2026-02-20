
import React, { useState } from 'react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg p-10 border border-slate-100 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Contact Request</h2>
            <div className="space-y-4">
              <div>
                <label className="mono text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Your Name</label>
                <input required className="w-full border-b border-slate-200 py-2 focus:border-slate-900 outline-none text-sm font-light" placeholder="Dr. Jane Doe" />
              </div>
              <div>
                <label className="mono text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
                <input required type="email" className="w-full border-b border-slate-200 py-2 focus:border-slate-900 outline-none text-sm font-light" placeholder="jane@institute.org" />
              </div>
              <div>
                <label className="mono text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Brief Message</label>
                <textarea required rows={4} className="w-full border-b border-slate-200 py-2 focus:border-slate-900 outline-none text-sm font-light resize-none" placeholder="Let's connect!" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-colors">
              Send Message
            </button>
          </form>
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 bg-[#2d5a27] text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase">Message Received</h3>
            <p className="text-slate-500 text-sm font-light">I will get back to you as soon as I can. I am also on LinkedIn and can be messaged there.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
