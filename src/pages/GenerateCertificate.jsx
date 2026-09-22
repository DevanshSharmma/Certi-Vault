import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  ExternalLink, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';
import CertificateForm from '../components/CertificateForm';
import CertificatePreview from '../components/CertificatePreview';
import { createCertificate, triggerPdfDownload } from '../services/api';

export default function GenerateCertificate({ setActivePage, setDirectVerifyId, onShowToast }) {
  const [formData, setFormData] = useState({
    recipient_name: 'Prashant Sharma', // Example placeholder, dynamic
    certificate_type: 'Certificate of Appreciation',
    description: 'In recognition of valuable participation, dedication and contribution.',
    organization_name: 'CertiVault',
    issue_date: '22 September 2026',
    signatory_name: 'Alex Morgan',
    signatory_title: 'Authorized Signatory',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const validateForm = () => {
    const errs = {};
    const trimmed = (formData.recipient_name || '').trim();
    if (!trimmed) {
      errs.recipient_name = "Recipient full name is required.";
    } else if (trimmed.length > 100) {
      errs.recipient_name = "Recipient name cannot exceed 100 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      onShowToast('Please enter a valid recipient name', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createCertificate(formData);
      setGeneratedCert(result);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onShowToast(`Certificate generated successfully: ${result.certificate_id}`, 'success');
    } catch (err) {
      onShowToast(err.message || 'Failed to generate certificate', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedCert) return;
    try {
      setIsDownloading(true);
      await triggerPdfDownload(generatedCert.certificate_id, generatedCert.recipient_name);
      onShowToast('PDF automatically downloaded!', 'success');
    } catch (err) {
      onShowToast(err.message || 'Download failed', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setGeneratedCert(null);
    setFormData({
      recipient_name: '',
      certificate_type: 'Certificate of Appreciation',
      description: 'In recognition of valuable participation, dedication and contribution.',
      organization_name: 'CertiVault',
      issue_date: '22 September 2026',
      signatory_name: 'Alex Morgan',
      signatory_title: 'Authorized Signatory',
    });
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Status Header */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Certificate Studio
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Generate Digital Certificate
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time reactive editor. The preview dynamically updates as you type.
          </p>
        </div>

        {generatedCert && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={() => {
                setDirectVerifyId(generatedCert.certificate_id);
                setActivePage('verify');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Verify</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Create another certificate"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Success Banner when generated */}
      {generatedCert && (
        <div className="no-print bg-emerald-50 border border-emerald-300/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-emerald-950">
                Certificate Generated & Registered Successfully!
              </h4>
              <p className="text-xs text-emerald-800">
                Official Unique ID: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">{generatedCert.certificate_id}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Split Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="no-print lg:col-span-5 space-y-4">
          <CertificateForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </div>

        {/* RIGHT COLUMN: Live Reactive Certificate Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="no-print flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Live Certificate Preview (A4 Landscape)</span>
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {generatedCert ? 'Official Registered View' : 'Interactive Draft'}
            </span>
          </div>

          {/* Real-time Preview Component */}
          <div className="relative">
            <CertificatePreview
              recipientName={formData.recipient_name}
              certificateType={formData.certificate_type}
              description={formData.description}
              organizationName={formData.organization_name}
              issueDate={formData.issue_date}
              signatoryName={formData.signatory_name}
              signatoryTitle={formData.signatory_title}
              certificateId={generatedCert ? generatedCert.certificate_id : 'CERT-2026-PREVIEW'}
              isGenerated={!!generatedCert}
              qrCodeUrl={generatedCert ? `/api/qr/${generatedCert.certificate_id}` : null}
            />
          </div>

          {/* Action guidance under preview */}
          <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>The preview mirrors the exact ReportLab high-resolution vector PDF with left security bar.</span>
            </div>
            {generatedCert && (
              <button
                onClick={handleDownloadPdf}
                className="font-bold text-amber-700 hover:text-amber-800 underline uppercase tracking-wider shrink-0"
              >
                Download PDF
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
