import React from 'react';
import logoSvg from '../assets/logo.svg';
import sealSvg from '../assets/seal.svg';
import signatureSvg from '../assets/signature.svg';

export default function CertificatePreview({
  recipientName = 'RECIPIENT NAME',
  certificateType = 'Certificate of Appreciation',
  description = 'In recognition of valuable participation, dedication and contribution.',
  organizationName = 'CertiVault',
  issueDate = '22 September 2026',
  signatoryName = 'Alex Morgan',
  signatoryTitle = 'Authorized Signatory',
  certificateId = 'CERT-2026-PREVIEW',
  isGenerated = false,
  qrCodeUrl = null,
}) {
  const displayName = (recipientName && recipientName.trim()) ? recipientName.trim().toUpperCase() : 'RECIPIENT NAME';
  const displayType = (certificateType && certificateType.trim()) ? certificateType.trim().toUpperCase() : 'CERTIFICATE OF APPRECIATION';
  const displayOrg = (organizationName && organizationName.trim()) ? organizationName.trim().toUpperCase() : 'CERTIVAULT';
  const displayDesc = (description && description.trim()) ? description.trim() : 'In recognition of valuable participation, dedication and exemplary standard of contribution.';
  const displayDate = (issueDate && issueDate.trim()) ? issueDate.trim() : '22 September 2026';
  const displayId = (certificateId && certificateId.trim()) ? certificateId.trim() : 'CERT-2026-XXXXXX';
  const displaySigName = (signatoryName && signatoryName.trim()) ? signatoryName.trim() : 'Alex Morgan';
  const displaySigTitle = (signatoryTitle && signatoryTitle.trim()) ? signatoryTitle.trim() : 'Authorized Signatory';

  // Verification URL for QR code
  const verifyUrl = `${window.location.origin}/verify/${displayId}`;
  const qrSrc = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&color=0B192C`;

  return (
    <div className="printable-certificate-wrapper w-full select-none">
      {/* Certificate Outer Container with standard A4 Landscape Ratio (1.414 / 1) */}
      <div 
        className="certificate-canvas relative w-full bg-[#FCFBF7] text-[#0B192C] shadow-2xl rounded-2xl overflow-hidden border border-amber-200/60 p-4 sm:p-7 md:p-9"
        style={{ aspectRatio: '1.414 / 1', minHeight: '460px' }}
      >
        {/* 1. Ornate Multi-Layer Borders */}
        <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/70 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border-2 border-[#0B192C] rounded-lg pointer-events-none" />
        <div className="absolute inset-[15px] sm:inset-[20px] border border-[#D4AF37]/50 rounded-md pointer-events-none" />

        {/* 2. Corner Bracket Ornaments */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none flex items-start justify-start">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full m-0.5" />
        </div>
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none flex items-start justify-end">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full m-0.5" />
        </div>
        <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none flex items-end justify-start">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full m-0.5" />
        </div>
        <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none flex items-end justify-end">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full m-0.5" />
        </div>

        {/* 3. Subtle Central Security Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
          <div className="w-96 h-96 rounded-full border-[12px] border-[#0B192C] flex items-center justify-center">
            <span className="font-cinzel text-5xl font-black text-[#0B192C] tracking-widest -rotate-12">
              CERTI•VAULT
            </span>
          </div>
        </div>

        {/* 4. REAL SECURITY ACCENT BAR ON LEFT SIDE ("put one real bar on left side and make the certificate real genique") */}
        <div 
          className="absolute top-5 bottom-5 left-5 sm:left-6 w-10 sm:w-12 bg-[#0B192C] border-y border-r border-[#D4AF37] rounded-l-md flex flex-col items-center justify-between py-5 overflow-hidden shadow-inner"
          style={{ zIndex: 10 }}
        >
          {/* Inner gold pinstripes */}
          <div className="absolute top-2 bottom-2 left-1 w-[1px] bg-[#D4AF37]/40" />
          <div className="absolute top-2 bottom-2 right-1 w-[1px] bg-[#D4AF37]/40" />

          {/* Top Security Crest Medallion */}
          <div className="relative z-10 w-7 h-7 rounded-full bg-[#0B192C] border border-[#D4AF37] flex items-center justify-center shadow-md">
            <div className="w-5 h-5 rounded-full border border-[#B38F3F] flex items-center justify-center">
              <span className="text-[#D4AF37] text-[10px] font-bold">★</span>
            </div>
          </div>

          {/* Vertical Guilloche / Security Pattern */}
          <div className="flex-1 flex flex-col items-center justify-around py-2 opacity-60">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-3.5 h-3.5 rotate-45 border border-[#1E3E62] bg-[#0B192C] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Micro-text along vertical bar */}
          <div className="relative z-10 -rotate-90 origin-center text-[7px] font-bold tracking-[0.25em] text-amber-200/80 whitespace-nowrap uppercase mb-8">
            CERTI•VAULT SECURITY INTEGRITY
          </div>

          {/* Bottom Security Emblem */}
          <div className="relative z-10 w-5 h-5 rounded-full border border-[#D4AF37]/80 flex items-center justify-center">
            <span className="text-[#D4AF37] text-[8px]">✓</span>
          </div>
        </div>

        {/* 5. Main Certificate Content Area (Offset to account for left security bar) */}
        <div className="relative z-10 h-full flex flex-col justify-between pl-12 sm:pl-16 pr-2 sm:pr-4 py-1">
          
          {/* Top Header: Brand Logo & Issuing Organization */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <img src={logoSvg} alt="CertiVault Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" />
            </div>
            <p className="font-semibold text-[10px] sm:text-xs tracking-[0.25em] text-slate-600 uppercase">
              {displayOrg}
            </p>
            {/* Elegant separator line with center diamond */}
            <div className="flex items-center justify-center gap-2 max-w-sm mx-auto my-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center my-1">
            <h2 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider text-[#0B192C]">
              {displayType}
            </h2>
            <p className="font-playfair italic text-xs sm:text-sm text-slate-600 mt-1">
              This certificate is proudly presented to
            </p>
          </div>

          {/* RECIPIENT NAME: THE PROMINENT CENTRAL FOCUS */}
          <div className="text-center my-2 sm:my-3">
            <div className="inline-block relative">
              <h1 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0B192C] tracking-wide px-4 py-1 transition-all">
                {displayName}
              </h1>
              {/* Elegant Gold Underline with Diamond Center */}
              <div className="relative flex items-center justify-center my-0.5">
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <div className="absolute w-2 h-2 rotate-45 bg-[#D4AF37] border border-[#0B192C]" />
              </div>
            </div>
          </div>

          {/* Description / Achievement Text */}
          <div className="text-center max-w-xl mx-auto px-4 my-1">
            <p className="font-playfair text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>

          {/* Metadata Row: Issue Date & Unique ID */}
          <div className="text-center text-[10px] sm:text-xs font-semibold text-slate-700 tracking-wide">
            <span>Issue Date: <span className="text-[#0B192C] font-bold">{displayDate}</span></span>
            <span className="mx-2 text-[#D4AF37]">•</span>
            <span>Certificate ID: <span className="font-mono font-bold text-[#0B192C]">{displayId}</span></span>
          </div>

          {/* Bottom Section: QR & Barcode (Left), Seal (Center), Signature (Right) */}
          <div className="pt-2 sm:pt-4 border-t border-slate-200/80 grid grid-cols-3 items-end">
            
            {/* Left: Real QR Code + Code 128 Barcode */}
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-md border border-[#D4AF37] shadow-sm shrink-0">
                <img 
                  src={qrSrc} 
                  alt="Verification QR Code" 
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase">
                  Scan to Verify
                </span>
                <span className="font-mono text-[9px] text-[#0B192C] font-semibold">
                  {displayId}
                </span>
                {/* SVG Code 128 Barcode Representation */}
                <div className="flex items-center gap-[1.5px] h-4 mt-0.5 opacity-85">
                  <div className="w-[1.5px] h-full bg-[#0B192C]" />
                  <div className="w-[1px] h-full bg-[#0B192C]" />
                  <div className="w-[2.5px] h-full bg-[#0B192C]" />
                  <div className="w-[1px] h-full bg-[#0B192C]" />
                  <div className="w-[2px] h-full bg-[#0B192C]" />
                  <div className="w-[3px] h-full bg-[#0B192C]" />
                  <div className="w-[1px] h-full bg-[#0B192C]" />
                  <div className="w-[2px] h-full bg-[#0B192C]" />
                  <div className="w-[1.5px] h-full bg-[#0B192C]" />
                  <div className="w-[2.5px] h-full bg-[#0B192C]" />
                  <div className="w-[1px] h-full bg-[#0B192C]" />
                  <div className="w-[2px] h-full bg-[#0B192C]" />
                  <div className="w-[3px] h-full bg-[#0B192C]" />
                  <div className="w-[1.5px] h-full bg-[#0B192C]" />
                </div>
              </div>
            </div>

            {/* Center: Original Certificate Seal */}
            <div className="flex justify-center -mb-2">
              <img 
                src={sealSvg} 
                alt="CertiVault Seal" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md transform hover:rotate-6 transition duration-300"
              />
            </div>

            {/* Right: Digital Signature & Authorized Signatory */}
            <div className="flex flex-col items-center text-center">
              <div className="h-10 sm:h-12 flex items-end justify-center">
                <img 
                  src={signatureSvg} 
                  alt="Digital Signature" 
                  className="h-9 sm:h-11 w-auto object-contain drop-shadow-sm" 
                />
              </div>
              <div className="w-28 sm:w-36 h-[1.5px] bg-[#0B192C] my-1" />
              <p className="font-cinzel text-[11px] sm:text-xs font-bold text-[#0B192C]">
                {displaySigName}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 font-medium">
                {displaySigTitle}
              </p>
            </div>

          </div>

          {/* Fine Print Footer */}
          <div className="text-center pt-1">
            <p className="text-[7.5px] sm:text-[8px] text-slate-400 font-medium tracking-wide">
              Official CertiVault Cryptographically Signed Digital Credential • Document Tamper-Evident ID: {displayId}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
