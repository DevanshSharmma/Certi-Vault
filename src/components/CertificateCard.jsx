import React, { useState } from 'react';
import { Award, Download, ExternalLink, ShieldCheck, AlertTriangle, Copy, Check, Eye } from 'lucide-react';
import { triggerPdfDownload } from '../services/api';

export default function CertificateCard({
  certificate,
  onView,
  onVerify,
  onRevoke,
  onShowToast
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const {
    certificate_id,
    recipient_name,
    certificate_type,
    organization_name,
    issue_date,
    status
  } = certificate;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onShowToast) onShowToast('Certificate ID copied to clipboard!', 'info');
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await triggerPdfDownload(certificate_id, recipient_name);
      if (onShowToast) onShowToast('PDF certificate downloaded!', 'success');
    } catch (err) {
      if (onShowToast) onShowToast(err.message || 'Download failed', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group">
      
      {/* Top row: Type and Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          {certificate_type}
        </span>

        {status === 'VALID' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            VALID
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            REVOKED
          </span>
        )}
      </div>

      {/* Recipient & Org */}
      <div className="my-2 space-y-1">
        <h4 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
          {recipient_name}
        </h4>
        <p className="text-xs text-slate-500 font-medium">
          Issued by {organization_name} • {issue_date}
        </p>
      </div>

      {/* Certificate ID Pill */}
      <div className="my-3 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-slate-700">
          {certificate_id}
        </span>
        <button
          onClick={handleCopyId}
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
          title="Copy Certificate ID"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => onView(certificate)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          View
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-600" />
          {downloading ? 'Downloading...' : 'PDF'}
        </button>
        <button
          onClick={() => onVerify(certificate_id)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition col-span-1"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Verify
        </button>
        {status === 'VALID' ? (
          <button
            onClick={() => onRevoke(certificate_id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition col-span-1"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Revoke
          </button>
        ) : (
          <div className="flex items-center justify-center text-[11px] font-medium text-slate-400 col-span-1">
            Archived
          </div>
        )}
      </div>

    </div>
  );
}
