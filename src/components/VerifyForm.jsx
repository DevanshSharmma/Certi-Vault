import React, { useState } from 'react';
import { Search, ShieldCheck, Loader2 } from 'lucide-react';

export default function VerifyForm({ onVerify, isVerifying, initialId = '' }) {
  const [certId, setCertId] = useState(initialId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    onVerify(certId.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex flex-col sm:flex-row items-center gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-300 shadow-xl focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 transition">
        <div className="flex items-center gap-3 pl-3.5 flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value.toUpperCase())}
            placeholder="Enter Certificate ID (e.g. CERT-2026-7F4K92)"
            className="w-full py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 font-mono text-sm sm:text-base tracking-wider focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isVerifying || !certId.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B192C] text-amber-300 hover:bg-slate-900 active:scale-95 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verify Certificate</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
