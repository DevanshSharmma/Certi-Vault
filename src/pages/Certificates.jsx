import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Award, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  RotateCw, 
  Calendar, 
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import CertificatePreview from '../components/CertificatePreview';
import { getCertificates, revokeCertificate, triggerPdfDownload } from '../services/api';

export default function Certificates({ setActivePage, setDirectVerifyId, onShowToast }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCertForView, setSelectedCertForView] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getCertificates({
        query: searchQuery,
        status: statusFilter,
      });
      setCertificates(data);
    } catch (err) {
      onShowToast(err.message || 'Failed to fetch certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCertificates();
  };

  const handleRevoke = async (certificateId) => {
    const confirm = window.confirm(`Are you sure you want to revoke certificate ${certificateId}? Once revoked, verification will permanently reflect this status.`);
    if (!confirm) return;

    try {
      setRevokingId(certificateId);
      await revokeCertificate(certificateId);
      onShowToast(`Certificate ${certificateId} has been REVOKED.`, 'warning');
      fetchCertificates();
    } catch (err) {
      onShowToast(err.message || 'Failed to revoke certificate', 'error');
    } finally {
      setRevokingId(null);
    }
  };

  const handleDownload = async (cert) => {
    try {
      setDownloadingId(cert.certificate_id);
      await triggerPdfDownload(cert.certificate_id, cert.recipient_name);
      onShowToast('PDF certificate downloaded successfully', 'success');
    } catch (err) {
      onShowToast(err.message || 'Download failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Certificate ID copied', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Live Database Ledger
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Certificate Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time searchable record of all credentials generated in CertiVault.
          </p>
        </div>

        <button
          onClick={fetchCertificates}
          className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Controls: Search Bar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Recipient Name, Certificate ID, or Organization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B192C] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition shrink-0"
          >
            Search
          </button>
        </form>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {['ALL', 'VALID', 'REVOKED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0 ${
                statusFilter === st
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#0B192C] text-amber-200 uppercase font-cinzel text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">Recipient Name</th>
                <th scope="col" className="px-6 py-4">Certificate Type</th>
                <th scope="col" className="px-6 py-4">Certificate ID</th>
                <th scope="col" className="px-6 py-4">Issue Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Loading certificate records...</span>
                    </div>
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No certificates found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try generating a new certificate or adjusting your search query.</p>
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Recipient */}
                    <td className="px-6 py-4 font-cinzel font-bold text-slate-900 whitespace-nowrap">
                      {cert.recipient_name}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                        {cert.certificate_type}
                      </span>
                    </td>

                    {/* Certificate ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                        <span>{cert.certificate_id}</span>
                        <button
                          onClick={() => handleCopy(cert.certificate_id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                          title="Copy ID"
                        >
                          {copiedId === cert.certificate_id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {cert.issue_date}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cert.status === 'VALID' ? (
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
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCertForView(cert)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="View Certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(cert)}
                          disabled={downloadingId === cert.certificate_id}
                          className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDirectVerifyId(cert.certificate_id);
                            setActivePage('verify');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition"
                          title="Verify Status"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        {cert.status === 'VALID' && (
                          <button
                            onClick={() => handleRevoke(cert.certificate_id)}
                            disabled={revokingId === cert.certificate_id}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                            title="Revoke Certificate"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Certificate Preview */}
      {selectedCertForView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
              <h3 className="font-cinzel text-lg font-bold">
                {selectedCertForView.recipient_name} — {selectedCertForView.certificate_id}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedCertForView)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-amber-400 text-slate-950 hover:bg-amber-300 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCertForView(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="bg-[#FCFBF7] rounded-2xl p-2 sm:p-4">
              <CertificatePreview
                recipientName={selectedCertForView.recipient_name}
                certificateType={selectedCertForView.certificate_type}
                description={selectedCertForView.description}
                organizationName={selectedCertForView.organization_name}
                issueDate={selectedCertForView.issue_date}
                signatoryName={selectedCertForView.signatory_name}
                signatoryTitle={selectedCertForView.signatory_title}
                certificateId={selectedCertForView.certificate_id}
                isGenerated={true}
                qrCodeUrl={`/api/qr/${selectedCertForView.certificate_id}`}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
