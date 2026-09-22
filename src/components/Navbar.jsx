import React, { useState } from 'react';
import { Award, ShieldCheck, FilePlus, Search, Info, Menu, X } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Award },
    { id: 'generate', label: 'Generate Certificate', icon: FilePlus },
    { id: 'verify', label: 'Verify Certificate', icon: ShieldCheck },
    { id: 'certificates', label: 'Certificates', icon: Search },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center p-1.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition transform">
              <ShieldCheck className="w-7 h-7 text-[#0B192C]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center tracking-wider">
                <span className="font-cinzel text-xl font-bold text-white tracking-widest">CERTI</span>
                <span className="font-cinzel text-xl font-bold text-amber-400 tracking-widest">VAULT</span>
              </div>
              <p className="text-[9px] font-semibold tracking-[0.25em] text-slate-400 uppercase -mt-0.5">
                Create • Verify • Trust
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('generate')}
              className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              Generate Now
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B192C] px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/20'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNav('generate')}
              className="w-full py-3 rounded-xl text-center text-xs font-semibold uppercase tracking-wider bg-amber-400 text-slate-950 font-bold"
            >
              Generate Certificate
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
