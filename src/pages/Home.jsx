import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FilePlus, 
  Search, 
  Download, 
  QrCode, 
  Award, 
  Sparkles, 
  Printer, 
  Database, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import CertificatePreview from '../components/CertificatePreview';

export default function Home({ setActivePage, onDirectVerify }) {
  const [demoName, setDemoName] = useState('Prashant Sharma');
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      title: 'Certificate Generation',
      desc: 'Create formal credentials for any recipient with customizable honors, titles, and issuing organizations.',
      icon: Award,
    },
    {
      title: 'Instant Verification',
      desc: 'Public verification engine validates authenticity in milliseconds without needing user logins or accounts.',
      icon: ShieldCheck,
    },
    {
      title: 'Unique Certificate IDs',
      desc: 'Every certificate is assigned an collision-safe uppercase cryptographic ID (e.g. CERT-2026-7F4K92).',
      icon: Sparkles,
    },
    {
      title: 'QR Code Verification',
      desc: 'Embedded real 2D matrix barcode scans directly into the live verification status endpoint.',
      icon: QrCode,
    },
    {
      title: 'Printable Vector PDF',
      desc: 'Genuine A4 landscape PDF built with ReportLab, complete with high-res seal, signature, and security bar.',
      icon: Download,
    },
    {
      title: 'Certificate Records',
      desc: 'Real SQLite/PostgreSQL-ready database stores all issued credentials with search and revocation controls.',
      icon: Database,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Enter Details',
      desc: 'Type recipient name, select certificate type (Appreciation, Achievement, Completion), and optionally customize description.',
    },
    {
      num: '02',
      title: 'Generate Certificate',
      desc: 'Our engine generates a collision-safe unique ID, registers the record in database, and builds the real vector PDF.',
    },
    {
      num: '03',
      title: 'Download PDF',
      desc: 'Download the authentic high-resolution A4 landscape PDF or trigger a clean browser print layout.',
    },
    {
      num: '04',
      title: 'Verify Anytime',
      desc: 'Anyone with the certificate ID or QR code can instantly check legitimacy on our public registry.',
    },
  ];

  const faqs = [
    {
      q: 'Is any user login or sign-up required to create or verify certificates?',
      a: 'No. CertiVault is entirely public and friction-free. You can immediately generate certificates and anyone can publicly verify credentials without an account or password.',
    },
    {
      q: 'Can I generate a certificate for any recipient name?',
      a: 'Yes. The recipient name is completely dynamic and never hardcoded. You can enter any name (e.g. Prashant Sharma, Rahul Sharma, Ananya Singh, Aman Verma) and it will immediately appear across preview, PDF, database, and verification.',
    },
    {
      q: 'What is the Left Security Bar on the certificate?',
      a: 'CertiVault certificates include an authentic vertical security margin band on the left side with gold pinstripes, micro-guilloche diamond lattice, and an integrity badge, mirroring the security credentials used in prestige diplomas and accredited certifications.',
    },
    {
      q: 'Does the QR code really work?',
      a: 'Yes! The QR code is generated with python qrcode and encodes the real verification URL. Scanning it with a smartphone camera will open the verification page for that exact certificate ID.',
    },
    {
      q: 'Can a certificate be revoked?',
      a: 'Yes. Authorized operators can revoke a certificate from the directory. Once revoked, verification immediately flags the certificate as REVOKED while preserving the audit record in the database.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 bg-gradient-to-b from-[#0B192C] via-[#0D1E35] to-slate-950 text-white rounded-b-[2.5rem] shadow-2xl px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Credential Authority • No Login Required</span>
          </div>

          {/* Heading */}
          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            CREATE PROFESSIONAL <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent">
              CERTIFICATES IN SECONDS
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Generate beautifully designed digital certificates with unique certificate IDs, authentic left security margin bar, and instant QR-based verification.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => { setActivePage('generate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FilePlus className="w-5 h-5 text-slate-950" />
              <span>Generate Certificate</span>
            </button>
            <button
              onClick={() => { setActivePage('verify'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 transition flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-sm"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Verify Certificate</span>
            </button>
          </div>

          {/* Live Interactive Preview Showcase on Hero */}
          <div className="pt-10 pb-6 max-w-4xl mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Interactive Live Preview Mockup</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Try typing a name:</span>
                <input
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="Enter any name..."
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-medium text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Certificate Preview Element */}
            <div className="transform transition duration-300 hover:scale-[1.01]">
              <CertificatePreview
                recipientName={demoName || 'Prashant Sharma'}
                certificateType="Certificate of Appreciation"
                description="In recognition of valuable participation, dedication and contribution."
                organizationName="CertiVault"
                issueDate="22 September 2026"
                certificateId="CERT-2026-DEMO01"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Enterprise-Grade Credential Architecture
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Engineered for academic institutions, hackathons, enterprise training, and professional awards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS (01 - 04) */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Workflow
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
              How CertiVault Works
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              From manual data entry to cryptographically verifiable credential in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-cinzel text-3xl font-black text-amber-500/80 tracking-tight">
                    {step.num}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-slate-900 mt-2 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Questions & Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-cinzel font-bold text-sm sm:text-base text-slate-900 hover:text-amber-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-90 text-amber-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Issue Verifiable Credentials?
            </h3>
            <p className="text-slate-300 text-sm max-w-lg">
              Start now. No registration, no subscription fees. Real PDFs and live verification engine.
            </p>
          </div>
          <button
            onClick={() => { setActivePage('generate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/30 transition transform hover:-translate-y-0.5 shrink-0"
          >
            Launch Certificate Generator
          </button>
        </div>
      </section>

    </div>
  );
}
