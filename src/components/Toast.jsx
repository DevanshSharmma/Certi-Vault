import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-slate-900 border-emerald-500/40 text-white',
    error: 'bg-rose-950 border-rose-500/50 text-white',
    warning: 'bg-amber-950 border-amber-500/50 text-white',
    info: 'bg-slate-900 border-blue-500/40 text-white',
  }[type] || 'bg-slate-900 border-slate-700 text-white';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${bgStyles} max-w-md`}>
        {icons}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
