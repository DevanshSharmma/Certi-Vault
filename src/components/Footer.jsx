import React from 'react';
import { ShieldCheck, Lock, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="no-print bg-[#070F1E] text-slate-400 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center p-1">
                <ShieldCheck className="w-5 h-5 text-[#0B192C]" strokeWidth={2.5} />
              </div>
              <span className="font-cinzel text-xl font-bold text-white tracking-wider">
                CERTI<span className="text-amber-400">VAULT</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A high-integrity digital certificate generation and verification platform. Issue tamper-evident credentials with unique certificate IDs and instant QR-based cryptographic verification.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Public Verification Engine • No Login Required</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-cinzel text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('generate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Generate Certificate
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('verify'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Verify Certificate
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('certificates'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  Certificate Directory
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition">
                  About CertiVault
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Security & Verification */}
          <div>
            <h4 className="font-cinzel text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Trust & Integrity
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Standard A4 Landscape PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Scannable 2D QR Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Machine-Readable Code 128</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Collision-Safe Unique ID Registry</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CertiVault. All rights reserved. CREATE. VERIFY. TRUST.</p>
          <p className="text-center sm:text-right text-slate-500">
            Fictional credential authority demonstration. Original brand assets and cryptographic design.
          </p>
        </div>

      </div>
    </footer>
  );
}
