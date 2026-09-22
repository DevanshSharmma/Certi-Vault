import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  FileCheck2, 
  QrCode, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function About({ setActivePage }) {
  const pillars = [
    {
      title: 'Zero Login Requirement',
      desc: 'Credential generation and public verification are deliberately friction-free. Anyone can issue awards or verify authenticity without accounts, passwords, or paywalls.',
      icon: Lock,
    },
    {
      title: 'Collision-Safe Unique ID Registry',
      desc: 'Each credential is cryptographically anchored by a unique uppercase identifier format (CERT-YYYY-XXXXXX) backed by database constraints.',
      icon: ShieldCheck,
    },
    {
      title: 'Real Scannable QR Matrix',
      desc: 'Every certificate embeds a real 2D QR code generated with python qrcode encoding the absolute verification URL. Instant phone camera verification.',
      icon: QrCode,
    },
    {
      title: 'Genuine Vector PDF Engine',
      desc: 'Built using ReportLab in Python, creating true A4 landscape vector documents with embedded barcode, signature, seal, and left security band.',
      icon: FileCheck2,
    },
  ];

  const techStack = [
    { name: 'FastAPI', category: 'Backend Engine', desc: 'Asynchronous Python framework powering high-performance REST APIs.' },
    { name: 'ReportLab', category: 'PDF Generation', desc: 'Genuine high-resolution vector PDF generator for printable A4 credentials.' },
    { name: 'SQLAlchemy & SQLite', category: 'Database Layer', desc: 'ORM data persistence ready for production PostgreSQL deployment.' },
    { name: 'React 19 & Vite 8', category: 'Frontend Platform', desc: 'Modern reactive interface with real-time dynamic certificate preview.' },
    { name: 'Tailwind CSS', category: 'Design System', desc: 'Prestige color palette featuring deep navy, gold filigree, and crisp typography.' },
    { name: 'Python QRCode & Barcode', category: 'Machine Vision', desc: 'Algorithmic generation of scannable QR matrix and Code 128 barcodes.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-3">
          <img src={logoSvg} alt="CertiVault" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#0B192C]">
          About CertiVault
        </h1>
        <p className="font-cinzel text-sm sm:text-base font-bold text-amber-600 tracking-widest uppercase">
          Create • Verify • Trust
        </p>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          CertiVault is a digital certificate generation and verification platform designed to issue elegant, tamper-evident digital credentials with instant QR-based authentication.
        </p>
      </div>

      {/* Security Architecture & Left Bar Highlight */}
      <div className="bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Credential Design</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Authentic Left Security Margin Bar
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Unlike basic online certificate generators that produce flat bordered boxes, CertiVault credentials feature an authentic vertical security margin band along the left side. Engineered with deep midnight navy, dual gold pinstripes, micro-guilloche diamond lattice, and an embedded star crest, this security ribbon gives every certificate a genuine, distinguished credential appearance suitable for corporate recognition and academic honors.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-300">
            <span className="flex items-center gap-1.5">✓ Precision ReportLab coordinates</span>
            <span className="flex items-center gap-1.5">✓ 1:1 Parity between live preview & PDF</span>
            <span className="flex items-center gap-1.5">✓ Built-in anti-fraud verification</span>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-6">
        <h2 className="font-cinzel text-2xl font-bold text-[#0B192C] text-center">
          Core Pillars of Trust
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-slate-900">
                  {pil.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pil.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-6">
        <h2 className="font-cinzel text-2xl font-bold text-[#0B192C] text-center">
          Modern Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                {tech.category}
              </span>
              <h4 className="font-cinzel text-base font-bold text-slate-900">
                {tech.name}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Authenticity & Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 leading-relaxed space-y-2">
        <h4 className="font-cinzel font-bold text-sm text-amber-950 uppercase tracking-wider">
          Compliance & Authenticity Notice
        </h4>
        <p>
          CertiVault is an original fictional platform created for demonstrable digital credential issuance and anti-tamper verification. CertiVault does not claim accreditation from regulatory bodies, government departments, or licensed universities. All trademarks, seals, and signatures are original fictional assets created specifically for this system.
        </p>
      </div>

    </div>
  );
}
