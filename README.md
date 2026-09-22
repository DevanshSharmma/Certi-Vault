# CertiVault

### Digital Certificate Generation & Verification System

CertiVault is a modern full-stack web application for creating, managing, downloading, and publicly verifying digitally generated certificates.

The platform provides a professional certificate-generation workflow with unique certificate IDs, QR-code verification, PDF generation, certificate history, revocation support, and a responsive user interface.

---

## 🚀 Features

### 📜 Certificate Generation
- Generate professional certificates dynamically.
- Enter any recipient name without requiring registration.
- Automatically generate a unique Certificate ID.
- Add certificate title, issue date, and issuer information.
- Professional certificate layout with:
  - Decorative borders
  - Digital seal
  - Watermark
  - Typography
  - Digital signature
  - CertiVault branding

### 🔐 Certificate Verification
- Every certificate receives a unique verification ID.
- Generate a real QR code containing the public verification URL.
- Scan the QR code to verify certificate authenticity.
- Public verification page available through:

```text
/verify/{certificateId}
