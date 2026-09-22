import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import GenerateCertificate from './pages/GenerateCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import Certificates from './pages/Certificates';
import About from './pages/About';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [directVerifyId, setDirectVerifyId] = useState('');
  const [toast, setToast] = useState(null);

  // Check initial URL path (for direct QR scans e.g. /verify/CERT-2026-XXXXXX)
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname;
      const verifyMatch = pathname.match(/^\/verify\/(.+)$/i);
      if (verifyMatch && verifyMatch[1]) {
        setActivePage('verify');
        setDirectVerifyId(verifyMatch[1]);
      } else if (pathname === '/generate') {
        setActivePage('generate');
      } else if (pathname === '/verify') {
        setActivePage('verify');
      } else if (pathname === '/certificates') {
        setActivePage('certificates');
      } else if (pathname === '/about') {
        setActivePage('about');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Update browser history when activePage changes
  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    if (pageId === 'home') {
      window.history.pushState({}, '', '/');
    } else if (pageId === 'verify' && directVerifyId) {
      window.history.pushState({}, '', `/verify/${directVerifyId}`);
    } else {
      window.history.pushState({}, '', `/${pageId}`);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home 
            setActivePage={handlePageChange} 
            onDirectVerify={(id) => {
              setDirectVerifyId(id);
              handlePageChange('verify');
            }} 
          />
        )}

        {activePage === 'generate' && (
          <GenerateCertificate 
            setActivePage={handlePageChange}
            setDirectVerifyId={setDirectVerifyId}
            onShowToast={showToast}
          />
        )}

        {activePage === 'verify' && (
          <VerifyCertificate 
            initialCertId={directVerifyId}
            onShowToast={showToast}
          />
        )}

        {activePage === 'certificates' && (
          <Certificates 
            setActivePage={handlePageChange}
            setDirectVerifyId={setDirectVerifyId}
            onShowToast={showToast}
          />
        )}

        {activePage === 'about' && (
          <About setActivePage={handlePageChange} />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
