import React from 'react';
import { User, Award, FileText, Building2, Calendar, Feather, Briefcase, Loader2, Sparkles } from 'lucide-react';

const CERTIFICATE_TYPES = [
  "Certificate of Appreciation",
  "Certificate of Participation",
  "Certificate of Achievement",
  "Certificate of Recognition",
  "Certificate of Completion",
];

export default function CertificateForm({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  errors = {}
}) {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6">
      
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-slate-900">
                Certificate Details
              </h3>
              <p className="text-xs text-slate-500">
                Fill the fields below. Live preview on the right updates in real-time.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            No Account Needed
          </span>
        </div>
      </div>

      {/* Recipient Full Name (Mandatory, Dynamic) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-amber-600" />
          <span>Recipient Full Name <span className="text-rose-500">*</span></span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.recipient_name}
            onChange={(e) => handleChange('recipient_name', e.target.value)}
            placeholder="Enter recipient's full name"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.recipient_name ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 hover:border-slate-400 focus:border-amber-500'
            } text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/15 transition`}
          />
        </div>
        {errors.recipient_name && (
          <p className="text-xs text-rose-500 font-medium pl-1">{errors.recipient_name}</p>
        )}
        <p className="text-[11px] text-slate-400 pl-1">
          E.g. Prashant Sharma, Rahul Sharma, Ananya Singh (Never hardcoded)
        </p>
      </div>

      {/* Certificate Type */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Certificate Type <span className="text-rose-500">*</span></span>
        </label>
        <select
          value={formData.certificate_type}
          onChange={(e) => handleChange('certificate_type', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-amber-500 text-slate-900 text-sm font-medium bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/15 transition cursor-pointer"
        >
          {CERTIFICATE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Achievement / Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Achievement / Description</span>
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="In recognition of valuable participation, dedication and contribution..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/15 transition resize-none"
        />
      </div>

      {/* Organization Name & Issue Date (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Organization Name</span>
          </label>
          <input
            type="text"
            value={formData.organization_name}
            onChange={(e) => handleChange('organization_name', e.target.value)}
            placeholder="CertiVault"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Issue Date</span>
          </label>
          <input
            type="text"
            value={formData.issue_date}
            onChange={(e) => handleChange('issue_date', e.target.value)}
            placeholder="22 September 2026"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
          />
        </div>
      </div>

      {/* Signatory Name & Title (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-amber-600" />
            <span>Signatory Name</span>
          </label>
          <input
            type="text"
            value={formData.signatory_name}
            onChange={(e) => handleChange('signatory_name', e.target.value)}
            placeholder="Alex Morgan"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>Signatory Title</span>
          </label>
          <input
            type="text"
            value={formData.signatory_title}
            onChange={(e) => handleChange('signatory_title', e.target.value)}
            placeholder="Authorized Signatory"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 active:scale-[0.99] shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>Generating Certificate...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Generate Certificate</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
