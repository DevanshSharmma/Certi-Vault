import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  Award, 
  User, 
  Feather, 
  Copy, 
  Check, 
  Loader2,
  FileCheck,
  Search
} from 'lucide-react';
import VerifyForm from '../components/VerifyForm';
import CertificatePreview from '../components/CertificatePreview';
import { verifyCertificate, triggerPdfDownload } from '../services/api';

export default function VerifyCertificate({ initialCertId = '', onShowToast }) {
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // If opened with an initial ID (e.g. from QR code or direct link), auto verify
    if (initialCertId) {
      handleVerify(initialCertId);
    }
  }, [initialCertId]);

  const handleVerify = async (idToVerify) => {
    const cleanId = (idToVerify || certIdInput).trim();
    if (!cleanId) return;

    try {
      setLoading(true);
      const data = await verifyCertificate(cleanId);
      setResult(data);
      if (data.status === 'VALID') {
        onShowToast('Certificate verified successfully!', 'success');
      } else if (data.status === 'REVOKED') {
        onShowToast('Warning: This certificate is REVOKED', 'warning');
      } else {
        onShowToast('Certificate not found', 'error');
      }
    } catch (err) {
      setResult({
        valid: false,
        status: 'INVALID',
        message: err.message || 'Verification failed',
        certificate: null,
      });
      onShowToast('Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Certificate ID copied to clipboard', 'info');
  };

  const handleDownload = async () => {
    if (!result || !result.certificate) return;
    try {
      setIsDownloading(true);
      await triggerPdfDownload(result.certificate.certificate_id, result.certificate.recipient_name);
      onShowToast('Official PDF downloaded successfully', 'success');
    } catch (err) {
      onShowToast(err.message || 'Download failed', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Public Credential Verification Engine</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#0B192C]">
          Verify Certificate Authenticity
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          Validate digital credentials issued through CertiVault. Enter the Certificate ID or scan the QR code printed on the certificate.
        </p>
      </div>

      {/* Manual Search Form */}
      <VerifyForm
        onVerify={handleVerify}
        isVerifying={loading}
        initialId={certIdInput}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="font-cinzel text-base font-bold text-slate-700 tracking-wider">
            Verifying Certificate Record...
          </p>
          <p className="text-xs text-slate-400">Querying cryptographic database registry</p>
        </div>
      )}

      {/* Verification Result Card */}
      {!loading && result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* STATE 1: VALID CERTIFICATE */}
          {result.status === 'VALID' && result.certificate && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden">
              
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                    <ShieldCheck className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-400 text-emerald-950 mb-1">
                      Status: VALID
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl font-black tracking-wide">
                      ✓ CERTIFICATE VERIFIED
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                      This certificate is authentic, active, and cryptographically registered in our ledger.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-emerald-900 hover:bg-emerald-50 shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span>View Certificate</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-950 text-white hover:bg-slate-900 shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Certificate Details Table */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Recipient */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>Recipient Full Name</span>
                    </span>
                    <p className="font-cinzel text-xl font-extrabold text-slate-900">
                      {result.certificate.recipient_name}
                    </p>
                  </div>

                  {/* Certificate Type */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Certificate Type</span>
                    </span>
                    <p className="font-cinzel text-lg font-bold text-slate-900">
                      {result.certificate.certificate_type}
                    </p>
                  </div>

                  {/* Organization */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Issuing Organization</span>
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {result.certificate.organization_name}
                    </p>
                  </div>

                  {/* Issue Date */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Issue Date</span>
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {result.certificate.issue_date}
                    </p>
                  </div>

                  {/* Certificate ID */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Certificate ID
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-base font-bold text-[#0B192C]">
                        {result.certificate.certificate_id}
                      </p>
                      <button
                        onClick={() => handleCopy(result.certificate.certificate_id)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition"
                        title="Copy ID"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Authorized Signatory */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-amber-600" />
                      <span>Authorized Signatory</span>
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {result.certificate.signatory_name} — <span className="text-slate-500">{result.certificate.signatory_title}</span>
                    </p>
                  </div>

                </div>

                {/* Description Text */}
                {result.certificate.description && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs sm:text-sm text-slate-700 italic">
                    "{result.certificate.description}"
                  </div>
                )}

              </div>

            </div>
          )}

          {/* STATE 2: REVOKED CERTIFICATE */}
          {result.status === 'REVOKED' && (
            <div className="bg-white rounded-3xl border-2 border-rose-500 shadow-2xl overflow-hidden">
              <div className="bg-rose-600 text-white p-6 sm:p-8 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-9 h-9 text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-widest bg-rose-200 text-rose-900 mb-1">
                    STATUS: REVOKED
                  </span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-black">
                    ⚠ CERTIFICATE REVOKED
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100 mt-0.5">
                    This certificate was revoked by the issuing authority and is no longer valid.
                  </p>
                </div>
              </div>

              {result.certificate && (
                <div className="p-6 sm:p-8 space-y-4 bg-rose-50/20">
                  <p className="text-xs font-bold uppercase text-slate-500">Historical Record:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-slate-500">Recipient:</span>
                      <p className="font-bold text-slate-800">{result.certificate.recipient_name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Certificate ID:</span>
                      <p className="font-mono font-bold text-slate-800">{result.certificate.certificate_id}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Type:</span>
                      <p className="text-slate-800">{result.certificate.certificate_type}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Originally Issued:</span>
                      <p className="text-slate-800">{result.certificate.issue_date}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATE 3: INVALID CERTIFICATE (NOT FOUND) */}
          {result.status === 'INVALID' && (
            <div className="bg-white rounded-3xl border-2 border-slate-400 shadow-2xl p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto border border-slate-300">
                <XCircle className="w-10 h-10 text-rose-600" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-widest bg-rose-100 text-rose-800">
                  STATUS: INVALID
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
                  ✕ CERTIFICATE NOT FOUND
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  No certificate matching this Certificate ID exists in our records.
                </p>
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Please double check the ID entered. Certificate IDs follow the format: <span className="font-mono font-bold">CERT-YYYY-XXXXXX</span>.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Full Certificate Preview Modal */}
      {showPreviewModal && result && result.certificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
              <h3 className="font-cinzel text-lg font-bold">
                Certificate Preview: {result.certificate.certificate_id}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-amber-400 text-slate-950 hover:bg-amber-300 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="bg-[#FCFBF7] rounded-2xl p-2 sm:p-4">
              <CertificatePreview
                recipientName={result.certificate.recipient_name}
                certificateType={result.certificate.certificate_type}
                description={result.certificate.description}
                organizationName={result.certificate.organization_name}
                issueDate={result.certificate.issue_date}
                signatoryName={result.certificate.signatory_name}
                signatoryTitle={result.certificate.signatory_title}
                certificateId={result.certificate.certificate_id}
                isGenerated={true}
                qrCodeUrl={`/api/qr/${result.certificate.certificate_id}`}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
